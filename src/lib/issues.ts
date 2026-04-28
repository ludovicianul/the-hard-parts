import { readFileSync, existsSync } from "node:fs";
import { resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { CATEGORIES, CATEGORY_ORDER } from "./categories";
import type { CategoryCode, IssueStatus } from "@/content/schemas/shared";
import {
  IssueMetaFileSchema,
  type IssueMeta,
} from "@/content/schemas/issue";
import {
  loadFailureModes,
  loadTechDecisions,
  loadRedFlags,
  loadPlaybooks,
} from "./load";
import { formatRefCode } from "./resolve";
import type { FailureModeEntry } from "@/content/schemas/failure-mode";
import type { TechDecisionEntry } from "@/content/schemas/tech-decision";
import type { RedFlagEntry } from "@/content/schemas/red-flag";
import type { PlaybookEntry } from "@/content/schemas/playbook";

/**
 * Issue / edition derivation layer.
 *
 * The site has a single source of truth for issue membership: the
 * `edition` field on each entry (e.g. `"edition-01"`). Everything
 * else — archive list, detail page, homepage ribbon — is derived
 * from that field plus the optional metadata in `content/issues.json`.
 *
 * No invented history. No sidecar release ledgers. No dual sources.
 *
 * Design properties:
 *   · Issues that have entries but no metadata still render (with
 *     just the issue number).
 *   · Issues that have metadata but no entries do NOT render — we
 *     refuse to publish empty issues. This makes "metadata sketch
 *     for a future issue" safe (it won't accidentally leak).
 *   · `issueStatus` defaults to `"new"` when absent. The inaugural
 *     edition therefore has every entry classified as NEW without
 *     needing a per-entry tag.
 *   · `issueStatus: "removed"` entries appear ONLY in the changelog.
 *     They are filtered from canonical listings by `lib/load.ts`.
 *
 * All loading is synchronous and build-time. Safe for static output.
 */

// ──────────────────────────────────────────────────────────────────
// Repo paths

const REPO_ROOT = pathResolve(
  fileURLToPath(new URL("../../", import.meta.url)),
);
const ISSUES_META_PATH = pathResolve(REPO_ROOT, "content/issues.json");

// ──────────────────────────────────────────────────────────────────
// Issue identifier helpers
//
// We carry both representations because they serve different jobs:
//   · `edition` ("edition-01") — what the JSON content stores; the
//     prefix makes the value self-describing when reading raw data.
//   · `number` ("01") — what the public URL uses (`/issues/01`) and
//     what the UI shows ("Issue 01").

const EDITION_PREFIX = "edition-";

/**
 * Strip the `edition-` prefix from a stored edition string. Returns
 * `null` if the value doesn't match the expected shape (we treat
 * malformed values defensively rather than crashing the build —
 * malformed values should already be rejected by `EditionSchema`,
 * so reaching the `null` branch indicates a bug elsewhere).
 */
export function parseEditionNumber(edition: string): string | null {
  if (!edition.startsWith(EDITION_PREFIX)) return null;
  const tail = edition.slice(EDITION_PREFIX.length);
  if (!/^\d{2,}$/.test(tail)) return null;
  return tail;
}

/** "01" → "edition-01". Inverse of `parseEditionNumber`. */
export function formatEdition(number: string): string {
  return `${EDITION_PREFIX}${number}`;
}

/** "01" → "Issue 01". Single source for the UI label. */
export function formatIssueLabel(number: string): string {
  return `Issue ${number}`;
}

/** "01" → "/issues/01". */
export function issueHref(number: string): string {
  return `/issues/${number}`;
}

/**
 * Numeric comparator for issue numbers. We compare numerically (not
 * lexicographically) so "10" sorts after "09" — a string sort would
 * place "10" between "01" and "02" once issues exceed nine.
 */
function compareIssueNumbersDesc(a: string, b: string): number {
  return Number(b) - Number(a);
}

// ──────────────────────────────────────────────────────────────────
// Metadata file (optional)

let _meta: Map<string, IssueMeta> | null = null;

function loadIssueMetaMap(): Map<string, IssueMeta> {
  if (_meta) return _meta;
  if (!existsSync(ISSUES_META_PATH)) {
    _meta = new Map();
    return _meta;
  }
  const raw = readFileSync(ISSUES_META_PATH, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Invalid JSON in content/issues.json: ${(err as Error).message}`,
    );
  }
  const result = IssueMetaFileSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`content/issues.json failed validation:\n${issues}`);
  }
  _meta = new Map(result.data.issues.map((i) => [i.number, i]));
  return _meta;
}

export function getIssueMeta(number: string): IssueMeta | undefined {
  return loadIssueMetaMap().get(number);
}

// ──────────────────────────────────────────────────────────────────
// Per-category raw entry stream
//
// Reads the underlying loader output WITHOUT the canonical-site
// "remove `issueStatus: removed`" filter — release notes need to
// surface retirements, even though they are hidden from category
// pages and search.

type AnyEntry =
  | FailureModeEntry
  | TechDecisionEntry
  | RedFlagEntry
  | PlaybookEntry;

function rawEntries(code: CategoryCode): AnyEntry[] {
  switch (code) {
    case "FM": return loadFailureModes().entries;
    case "TD": return loadTechDecisions().entries;
    case "RF": return loadRedFlags().entries;
    case "EP": return loadPlaybooks().entries;
  }
}

// ──────────────────────────────────────────────────────────────────
// Public types

/**
 * One entry's appearance in an issue's release notes. Carries enough
 * to render the row (title, ref-code pill, link) without reading the
 * raw entry again at the page layer.
 *
 * `href` is `null` for `removed` entries because their canonical
 * detail page is not generated (they are filtered from
 * `getStaticPaths` via `lib/load.ts`). The page layer renders
 * removed rows as plain text + strikethrough, not as links.
 */
export type IssueEntryRef = {
  code: CategoryCode;
  slug: string;
  title: string;
  refNum: string;     // "05"
  refCode: string;    // "FM-05"
  status: IssueStatus;
  href: string | null;
};

/** Per-category bucket within an issue. */
export type IssueCategoryBucket = {
  code: CategoryCode;
  name: string;
  /** Editorial route segment (e.g. "failure-modes"). */
  route: string;
  /** Counts per status; 0 for buckets with no entries in this issue. */
  counts: Record<IssueStatus, number>;
  /** Sub-lists by status, each preserving canonical entry order. */
  byStatus: Record<IssueStatus, IssueEntryRef[]>;
  /** Total entries in this issue from this category. */
  total: number;
};

/** Fully-resolved issue: metadata + per-category breakdowns. */
export type IssueDetail = {
  number: string;
  slug: string;          // same as number, kept distinct so callers can
                         // round-trip through the URL layer if needed
  href: string;
  label: string;         // "Issue 01"
  edition: string;       // "edition-01"
  meta: IssueMeta | undefined;
  /** Aggregate counts across all four categories. */
  totals: Record<IssueStatus | "total", number>;
  /** Categories in canonical order; empty buckets retained. */
  categories: IssueCategoryBucket[];
};

/** Lightweight summary used by the archive list + homepage ribbon. */
export type IssueSummary = {
  number: string;
  slug: string;
  href: string;
  label: string;
  meta: IssueMeta | undefined;
  totals: Record<IssueStatus | "total", number>;
};

// ──────────────────────────────────────────────────────────────────
// Discovery + grouping

/**
 * Inspect every entry in every category and group by issue number.
 * Memoised — discovery walks all 151+ entries; we don't redo it for
 * every page render.
 */
let _byIssue: Map<string, AnyEntry[]> | null = null;
let _byIssueCategory: Map<
  string,
  Map<CategoryCode, AnyEntry[]>
> | null = null;

function discover(): {
  byIssue: Map<string, AnyEntry[]>;
  byIssueCategory: Map<string, Map<CategoryCode, AnyEntry[]>>;
} {
  if (_byIssue && _byIssueCategory) {
    return { byIssue: _byIssue, byIssueCategory: _byIssueCategory };
  }
  _byIssue = new Map();
  _byIssueCategory = new Map();
  for (const code of CATEGORY_ORDER) {
    for (const entry of rawEntries(code)) {
      const editionStr = entry.edition;
      if (typeof editionStr !== "string") continue;
      const num = parseEditionNumber(editionStr);
      if (num === null) continue;

      let flat = _byIssue.get(num);
      if (!flat) { flat = []; _byIssue.set(num, flat); }
      flat.push(entry);

      let perCat = _byIssueCategory.get(num);
      if (!perCat) {
        perCat = new Map();
        _byIssueCategory.set(num, perCat);
      }
      let bucket = perCat.get(code);
      if (!bucket) { bucket = []; perCat.set(code, bucket); }
      bucket.push(entry);
    }
  }
  return { byIssue: _byIssue, byIssueCategory: _byIssueCategory };
}

/**
 * Resolve the status of an entry within an issue. Defaults to "new"
 * when `issueStatus` is absent — that's the convention for the
 * inaugural edition (every entry is new, no per-entry tag needed).
 */
function statusOf(entry: AnyEntry): IssueStatus {
  const s = (entry as { issueStatus?: IssueStatus }).issueStatus;
  return s ?? "new";
}

function refForEntry(
  code: CategoryCode,
  entry: AnyEntry,
  totalInCategory: number,
  indexInCategory: number,
  status: IssueStatus,
): IssueEntryRef {
  const { refNum, refCode } = formatRefCode(code, indexInCategory, totalInCategory);
  // `removed` entries do NOT have a canonical page (they are filtered
  // out of getStaticPaths by lib/load.ts). Render their row without
  // a link so a reader is not handed a 404.
  const href =
    status === "removed"
      ? null
      : `/${CATEGORIES[code].route}/${entry.slug}`;
  return {
    code,
    slug: entry.slug,
    title: entry.title,
    refNum,
    refCode,
    status,
    href,
  };
}

function emptyBuckets(): Record<IssueStatus, IssueEntryRef[]> {
  return { new: [], modified: [], removed: [] };
}

function emptyCounts(): Record<IssueStatus, number> {
  return { new: 0, modified: 0, removed: 0 };
}

function buildBuckets(
  num: string,
): IssueCategoryBucket[] {
  const { byIssueCategory } = discover();
  const perCat = byIssueCategory.get(num) ?? new Map();
  return CATEGORY_ORDER.map((code) => {
    const entries = perCat.get(code) ?? [];
    // Keep the original canonical-file order so reference numbers
    // stay stable across renders.
    const all = rawEntries(code);
    const totalInCategory = all.length;

    const byStatus = emptyBuckets();
    const counts = emptyCounts();
    for (const entry of entries) {
      const indexInCategory = all.indexOf(entry);
      const status = statusOf(entry);
      const ref = refForEntry(code, entry, totalInCategory, indexInCategory, status);
      byStatus[status].push(ref);
      counts[status]++;
    }
    return {
      code,
      name: CATEGORIES[code].name,
      route: CATEGORIES[code].route,
      counts,
      byStatus,
      total: entries.length,
    };
  });
}

function aggregate(buckets: IssueCategoryBucket[]): Record<IssueStatus | "total", number> {
  const totals: Record<IssueStatus | "total", number> = {
    new: 0, modified: 0, removed: 0, total: 0,
  };
  for (const b of buckets) {
    totals.new += b.counts.new;
    totals.modified += b.counts.modified;
    totals.removed += b.counts.removed;
    totals.total += b.total;
  }
  return totals;
}

// ──────────────────────────────────────────────────────────────────
// Public API

/**
 * Every issue that currently has at least one entry, ordered newest
 * first. Issues listed in `content/issues.json` but with zero
 * entries are deliberately excluded so we never publish an empty
 * release-notes page.
 */
export function listAllIssues(): IssueSummary[] {
  const { byIssue } = discover();
  const numbers = [...byIssue.keys()].sort(compareIssueNumbersDesc);
  return numbers.map((num) => {
    const buckets = buildBuckets(num);
    return {
      number: num,
      slug: num,
      href: issueHref(num),
      label: formatIssueLabel(num),
      meta: getIssueMeta(num),
      totals: aggregate(buckets),
    };
  });
}

/**
 * The currently-canonical issue: the highest-numbered issue with at
 * least one entry. `undefined` if no issues exist (defensive — used
 * by the homepage ribbon to hide itself when the catalog is empty).
 */
export function getCurrentIssue(): IssueSummary | undefined {
  const all = listAllIssues();
  return all[0];
}

/** Full detail for one issue (used by `/issues/[issue]`). */
export function getIssueDetail(number: string): IssueDetail | undefined {
  const { byIssue } = discover();
  if (!byIssue.has(number)) return undefined;
  const buckets = buildBuckets(number);
  return {
    number,
    slug: number,
    href: issueHref(number),
    label: formatIssueLabel(number),
    edition: formatEdition(number),
    meta: getIssueMeta(number),
    totals: aggregate(buckets),
    categories: buckets,
  };
}

/** Used by `getStaticPaths` on the issue detail route. */
export function listIssueNumbers(): string[] {
  return listAllIssues().map((i) => i.number);
}

// ──────────────────────────────────────────────────────────────────
// Re-export the validator for `lib/load.ts` to use when filtering
// removed entries out of canonical listings.

export function isRemoved(entry: { issueStatus?: IssueStatus }): boolean {
  return entry.issueStatus === "removed";
}
