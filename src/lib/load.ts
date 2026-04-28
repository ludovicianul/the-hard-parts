import { readFileSync } from "node:fs";
import { resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { CATEGORIES, type CategoryDescriptor } from "./categories";
import type { CategoryCode } from "@/content/schemas/shared";
import {
  FailureModeFileSchema,
  type FailureModeEntry,
  type FailureModeFile,
} from "@/content/schemas/failure-mode";
import {
  TechDecisionFileSchema,
  type TechDecisionEntry,
  type TechDecisionFile,
} from "@/content/schemas/tech-decision";
import {
  RedFlagFileSchema,
  type RedFlagEntry,
  type RedFlagFile,
} from "@/content/schemas/red-flag";
import {
  PlaybookFileSchema,
  type PlaybookEntry,
  type PlaybookFile,
} from "@/content/schemas/playbook";

/**
 * Content loader layer.
 *
 * Single source of truth for "where content files live". Page components must
 * not import JSON directly. They go through these loaders.
 *
 * All loading happens synchronously at build time via Node `fs`. No runtime
 * fetching. No network. Safe for Astro's static generation and Cloudflare Pages
 * Free deployment.
 */

// Resolve paths relative to the repository root.
const REPO_ROOT = pathResolve(
  fileURLToPath(new URL("../../", import.meta.url)),
);

function readJson<T>(relPath: string): T {
  const absPath = pathResolve(REPO_ROOT, relPath);
  const raw = readFileSync(absPath, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`Invalid JSON in ${relPath}: ${(err as Error).message}`);
  }
}

function parseOrThrow<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Schema validation failed for ${label}:\n${issues}`);
  }
  return result.data;
}

// ---------- Per-category loaders ----------

let _fm: FailureModeFile | null = null;
export function loadFailureModes(): FailureModeFile {
  if (_fm) return _fm;
  const descriptor = CATEGORIES.FM;
  const [file] = descriptor.files;
  if (!file) throw new Error("FM: no content files configured");
  const raw = readJson<unknown>(file);
  _fm = parseOrThrow(FailureModeFileSchema, raw, `FM (${file})`);
  return _fm;
}

let _td: TechDecisionFile | null = null;
export function loadTechDecisions(): TechDecisionFile {
  if (_td) return _td;
  const descriptor = CATEGORIES.TD;
  const [file] = descriptor.files;
  if (!file) throw new Error("TD: no content files configured");
  const raw = readJson<unknown>(file);
  _td = parseOrThrow(TechDecisionFileSchema, raw, `TD (${file})`);
  return _td;
}

let _rf: RedFlagFile | null = null;
export function loadRedFlags(): RedFlagFile {
  if (_rf) return _rf;
  const descriptor = CATEGORIES.RF;
  const [file] = descriptor.files;
  if (!file) throw new Error("RF: no content files configured");
  const raw = readJson<unknown>(file);
  _rf = parseOrThrow(RedFlagFileSchema, raw, `RF (${file})`);
  return _rf;
}

let _ep: PlaybookFile | null = null;
export function loadPlaybooks(): PlaybookFile {
  if (_ep) return _ep;
  const descriptor = CATEGORIES.EP;
  const parsedFiles: PlaybookFile[] = descriptor.files.map((file) => {
    const raw = readJson<unknown>(file);
    return parseOrThrow(PlaybookFileSchema, raw, `EP (${file})`);
  });
  if (parsedFiles.length === 0) {
    throw new Error("EP: no content files configured");
  }

  // Merge the 5 subcategory files into one logical collection.
  // Top-level `category` block is canonical from the first file; `categories`
  // list is the union across all files (should already match, but be defensive).
  const first = parsedFiles[0]!;
  const mergedSubcategories = new Set<string>(first.category.categories);
  for (const f of parsedFiles) {
    for (const c of f.category.categories) mergedSubcategories.add(c);
  }
  const mergedEntries: PlaybookEntry[] = parsedFiles.flatMap((f) => f.entries);

  _ep = {
    category: {
      code: "EP",
      name: first.category.name,
      summary: first.category.summary,
      categories: [...mergedSubcategories],
    },
    template: first.template,
    entries: mergedEntries,
  };
  return _ep;
}

// ---------- Generic helpers ----------

export type AnyEntry =
  | (FailureModeEntry & { __code: "FM" })
  | (TechDecisionEntry & { __code: "TD" })
  | (RedFlagEntry & { __code: "RF" })
  | (PlaybookEntry & { __code: "EP" });

export function listSlugs(code: CategoryCode): string[] {
  return listEntries(code).map((e) => e.slug);
}

/**
 * Canonical filter applied to every site-facing listing.
 *
 * `issueStatus: "removed"` entries are kept in the JSON catalog so
 * the public release-notes page (`/issues/[issue]`) can still
 * announce the retirement, but the canonical site (category
 * landings, detail pages, search index, sitemap, cross-reference
 * resolver) treats them as if they no longer exist.
 *
 * If you ever need the unfiltered list (e.g. inside the issues
 * loader, which intentionally surfaces removals), read directly
 * from `loadFailureModes().entries` etc. — that's why the per-
 * category loaders above remain raw.
 */
function isPubliclyVisible(entry: { issueStatus?: string }): boolean {
  return entry.issueStatus !== "removed";
}

export function listEntries(code: CategoryCode): Array<
  | FailureModeEntry
  | TechDecisionEntry
  | RedFlagEntry
  | PlaybookEntry
> {
  switch (code) {
    case "FM":
      return loadFailureModes().entries.filter(isPubliclyVisible);
    case "TD":
      return loadTechDecisions().entries.filter(isPubliclyVisible);
    case "RF":
      return loadRedFlags().entries.filter(isPubliclyVisible);
    case "EP":
      return loadPlaybooks().entries.filter(isPubliclyVisible);
  }
}

export function findEntry(
  code: CategoryCode,
  slug: string,
):
  | FailureModeEntry
  | TechDecisionEntry
  | RedFlagEntry
  | PlaybookEntry
  | undefined {
  return listEntries(code).find((e) => e.slug === slug);
}

export function subcategoryOf(
  code: CategoryCode,
  entry:
    | FailureModeEntry
    | TechDecisionEntry
    | RedFlagEntry
    | PlaybookEntry,
): string {
  const key: keyof typeof entry = CATEGORIES[code]
    .subcategoryEntryKey as keyof typeof entry;
  const value = (entry as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export function declaredSubcategories(code: CategoryCode): string[] {
  const desc = CATEGORIES[code];
  switch (desc.code) {
    case "FM":
      return [...loadFailureModes().category.categories];
    case "TD":
      return [...loadTechDecisions().category.categories];
    case "RF":
      return [...loadRedFlags().category.layers];
    case "EP":
      return [...loadPlaybooks().category.categories];
  }
}

export function categoryBlock(code: CategoryCode): {
  code: CategoryCode;
  name: string;
  summary: string;
  subcategories: string[];
} {
  switch (code) {
    case "FM": {
      const c = loadFailureModes().category;
      return {
        code,
        name: c.name,
        summary: c.summary,
        subcategories: [...c.categories],
      };
    }
    case "TD": {
      const c = loadTechDecisions().category;
      return {
        code,
        name: c.name,
        summary: c.summary,
        subcategories: [...c.categories],
      };
    }
    case "RF": {
      const c = loadRedFlags().category;
      return {
        code,
        name: c.name,
        summary: c.summary,
        subcategories: [...c.layers],
      };
    }
    case "EP": {
      const c = loadPlaybooks().category;
      return {
        code,
        name: c.name,
        summary: c.summary,
        subcategories: [...c.categories],
      };
    }
  }
}

/** Used by test/debug scripts; do not call from pages. */
export function _descriptor(code: CategoryCode): CategoryDescriptor {
  return CATEGORIES[code];
}
