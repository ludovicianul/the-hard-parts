import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve as pathResolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type { CategoryCode } from "@/content/schemas/shared";
import { CATEGORIES } from "./categories";

/**
 * Field Notes loader.
 *
 * Reads Markdown files from `content/field-notes/`. Each file must have
 * YAML frontmatter (delimited by `---`) with the following fields:
 *
 *   title:       string (required)
 *   date:        YYYY-MM-DD string (required, ISO 8601)
 *   slug:        string (required, kebab-case, matches filename without .md)
 *   summary:     string (required, one-paragraph excerpt shown on listings)
 *   references:  array of { code: CategoryCode, slug: string }[] (optional)
 *
 * Loading is synchronous and build-time only. Safe for Astro static output.
 */

const REPO_ROOT = pathResolve(
  fileURLToPath(new URL("../../", import.meta.url)),
);
const FIELD_NOTES_DIR = pathResolve(REPO_ROOT, "content/field-notes");

export type FieldNoteReference = {
  /** Category code: FM | TD | RF | EP */
  code: CategoryCode;
  /** Entry slug within that category */
  slug: string;
  /** Resolved display title — filled in by the loader */
  title?: string;
};

export type FieldNote = {
  slug: string;
  title: string;
  /** ISO 8601 date string, e.g. "2025-05-08" */
  date: string;
  summary: string;
  /** Raw Markdown body (everything after the closing `---`) */
  body: string;
  /** Cross-references into the four catalogs */
  references: FieldNoteReference[];
};

// ── Frontmatter parser ─────────────────────────────────────────────────────

/**
 * Minimal YAML frontmatter extractor.
 * Handles string scalars and simple arrays of inline-object records.
 * Does NOT support nested YAML — frontmatter for Field Notes is intentionally
 * flat so a full YAML parser dependency is unnecessary.
 */
function parseFrontmatter(raw: string): {
  meta: Record<string, unknown>;
  body: string;
} {
  const fence = "---";
  if (!raw.startsWith(fence)) return { meta: {}, body: raw };
  const secondFence = raw.indexOf(fence, fence.length);
  if (secondFence === -1) return { meta: {}, body: raw };

  const yamlBlock = raw.slice(fence.length, secondFence).trim();
  const body = raw.slice(secondFence + fence.length).trim();

  const meta: Record<string, unknown> = {};

  // Walk lines, collecting scalars and array-of-objects blocks.
  const lines = yamlBlock.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;

    // Skip blank lines.
    if (!line.trim()) { i++; continue; }

    // Array block: key followed by lines starting with `  - `
    const arrayKeyMatch = line.match(/^(\w+):\s*$/);
    if (arrayKeyMatch) {
      const key = arrayKeyMatch[1]!;
      const items: Record<string, string>[] = [];
      i++;
      while (i < lines.length && lines[i]!.startsWith("  - ")) {
        // Collect all `    key: value` pairs for this item.
        const item: Record<string, string> = {};
        const firstItemLine = lines[i]!.replace(/^\s+- /, "");
        const firstPairMatch = firstItemLine.match(/^(\w+):\s*(.*)$/);
        if (firstPairMatch) item[firstPairMatch[1]!] = firstPairMatch[2]!.trim();
        i++;
        while (i < lines.length && lines[i]!.match(/^\s{4}\w+:/)) {
          const pairMatch = lines[i]!.trim().match(/^(\w+):\s*(.*)$/);
          if (pairMatch) item[pairMatch[1]!] = pairMatch[2]!.trim();
          i++;
        }
        items.push(item);
      }
      meta[key] = items;
      continue;
    }

    // Scalar: `key: value`
    const scalarMatch = line.match(/^(\w+):\s*(.+)$/);
    if (scalarMatch) {
      meta[scalarMatch[1]!] = scalarMatch[2]!.trim();
      i++;
      continue;
    }

    i++;
  }

  return { meta, body };
}

// ── Entry lookup helpers (title resolution) ────────────────────────────────

function resolveReferenceTitle(
  code: CategoryCode,
  slug: string,
): string | undefined {
  try {
    // Lazy dynamic import would require async; instead use a narrow sync read.
    // We import from the already-memoised loaders via dynamic require-style.
    // Because this module runs at build time in Node, we can synchronously
    // import sibling modules. We use a deferred require so we don't create a
    // circular dependency at module-parse time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { listEntries } = require("./load") as typeof import("./load");
    const entry = listEntries(code).find((e) => e.slug === slug);
    return entry?.title;
  } catch {
    return undefined;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

let _notes: FieldNote[] | null = null;

function loadAll(): FieldNote[] {
  if (_notes) return _notes;

  if (!existsSync(FIELD_NOTES_DIR)) {
    _notes = [];
    return _notes;
  }

  const files = readdirSync(FIELD_NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  _notes = files
    .map((filename): FieldNote | null => {
      const absPath = pathResolve(FIELD_NOTES_DIR, filename);
      const raw = readFileSync(absPath, "utf8");
      const { meta, body } = parseFrontmatter(raw);

      const slug =
        typeof meta.slug === "string" ? meta.slug : basename(filename, ".md");
      const title = typeof meta.title === "string" ? meta.title : slug;
      const date = typeof meta.date === "string" ? meta.date : "";
      const summary = typeof meta.summary === "string" ? meta.summary : "";

      const rawRefs = Array.isArray(meta.references)
        ? (meta.references as Record<string, string>[])
        : [];

      const references: FieldNoteReference[] = rawRefs
        .filter((r) => r && typeof r.code === "string" && typeof r.slug === "string" && r.slug !== '')
        .map((r) => ({
          code: r.code as CategoryCode,
          slug: r.slug as string,
          title: r.slug !== '' ? resolveReferenceTitle(r.code as CategoryCode, r.slug as string) : undefined,
        }));

      return { slug, title, date, summary, body, references };
    })
    .filter((n): n is FieldNote => n !== null)
    // Newest first.
    .sort((a, b) => b.date.localeCompare(a.date));

  return _notes;
}

/** All published field notes, newest-first. */
export function listFieldNotes(): FieldNote[] {
  return loadAll();
}

/** The single most recent field note, or undefined when none exist. */
export function getLatestFieldNote(): FieldNote | undefined {
  return loadAll()[0];
}

/** Look up one field note by slug. */
export function getFieldNote(slug: string): FieldNote | undefined {
  return loadAll().find((n) => n.slug === slug);
}

/** All slugs — used by getStaticPaths. */
export function listFieldNoteSlugs(): string[] {
  return loadAll().map((n) => n.slug);
}

/** Format a field note date for display (e.g. "08 May 2025"). */
export function formatFieldNoteDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: "UTC",
  });
}

/** Category display name helper. */
export function categoryName(code: CategoryCode): string {
  return CATEGORIES[code]?.name ?? code;
}

/** Category route helper. */
export function categoryRoute(code: CategoryCode): string {
  return CATEGORIES[code]?.route ?? code.toLowerCase();
}
