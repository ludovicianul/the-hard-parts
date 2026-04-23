import { CATEGORIES, CATEGORY_ORDER, hrefForEntry } from "./categories";
import { listEntries } from "./load";
import type { CategoryCode, ResolvedRef } from "@/content/schemas/shared";

/**
 * Compute the padded catalog number + full refCode for an entry.
 *
 *   formatRefCode("FM",  4, 60)   -> { refNum: "05",  refCode: "FM-05"  }
 *   formatRefCode("TD", 44, 145)  -> { refNum: "045", refCode: "TD-045" }
 *
 * Padding = `max(2, digits(total))` so small categories stay 2-digit
 * and large categories grow to 3 without ever going below 2 (which
 * would look ad-hoc — e.g. "FM-5" beside "TD-045").
 */
export function formatRefCode(
  code: CategoryCode,
  indexInCategory: number,
  totalInCategory: number,
): { refNum: string; refCode: string } {
  const width = Math.max(2, String(totalInCategory).length);
  const refNum = String(indexInCategory + 1).padStart(width, "0");
  return {
    refNum,
    refCode: `${CATEGORIES[code].shortLabel}-${refNum}`,
  };
}

/**
 * Cross-reference resolution.
 *
 * Entries reference each other via slugs in fields like `relatedFailureModes`,
 * `relatedRedFlags`, `relatedPlaybooks`, `relatedTechDecisions`, as well as
 * the intra-category `oftenLeadsTo` / `oftenCausedBy` (Failure Modes),
 * `adjacentDecisions` (Tech Decisions), and `oftenLeadsToFailureModes`
 * (Tech Decisions).
 *
 * This layer builds a slug -> ResolvedRef index covering all four categories
 * so that any slug can be linked to the correct detail route without the
 * component layer knowing where it came from.
 */

type Index = Map<string, ResolvedRef>;
let _index: Index | null = null;

function buildIndex(): Index {
  const idx: Index = new Map();
  for (const code of CATEGORY_ORDER) {
    const desc = CATEGORIES[code];
    const entries = listEntries(code);
    const total = entries.length;
    // Stable catalog number per entry, padded to the width needed by
    // this category's own size. Matches the refCode on each entry's
    // own detail-page masthead, so a cross-reference link displays
    // the same "FM-05" string a reader would see when they land on
    // the target page.
    entries.forEach((entry, indexInCategory) => {
      const { refNum, refCode } = formatRefCode(code, indexInCategory, total);
      const ref: ResolvedRef = {
        code,
        slug: entry.slug,
        title: entry.title,
        categoryRoute: `/${desc.route}`,
        href: hrefForEntry(code, entry.slug),
        indexInCategory,
        refNum,
        refCode,
      };
      // Slug collisions would be a real integrity bug; validator catches that.
      if (!idx.has(entry.slug)) {
        idx.set(entry.slug, ref);
      }
    });
  }
  return idx;
}

export function indexBySlug(): Index {
  if (!_index) _index = buildIndex();
  return _index;
}

/** Resolve a single slug across all categories. `undefined` if dangling. */
export function resolveSlug(slug: string): ResolvedRef | undefined {
  return indexBySlug().get(slug);
}

/**
 * Resolve an array of related slugs, preserving original order.
 * Dangling refs are filtered out here (validator reports them separately).
 */
export function resolveMany(slugs: readonly string[] | undefined): ResolvedRef[] {
  if (!slugs || slugs.length === 0) return [];
  const idx = indexBySlug();
  const out: ResolvedRef[] = [];
  for (const slug of slugs) {
    const hit = idx.get(slug);
    if (hit) out.push(hit);
  }
  return out;
}

/**
 * Resolve an array of references, keeping BOTH resolved and unresolved values.
 *
 * Returned shape:
 *   resolved   — every input slug that maps to a real entry, in original order
 *   unresolved — every input string that did NOT resolve, in original order
 *
 * Unresolved values are editorial backlog (either slug-shaped references to
 * entries not yet authored, or free phrases). The UI renders them in a muted
 * non-linked fallback so the reader still sees the intent without following a
 * broken link. Content itself is never mutated here.
 */
export function partitionRefs(
  refs: readonly string[] | undefined,
): { resolved: ResolvedRef[]; unresolved: string[] } {
  if (!refs || refs.length === 0) return { resolved: [], unresolved: [] };
  const idx = indexBySlug();
  const resolved: ResolvedRef[] = [];
  const unresolved: string[] = [];
  for (const value of refs) {
    if (typeof value !== "string" || value.length === 0) continue;
    const hit = idx.get(value);
    if (hit) resolved.push(hit);
    else unresolved.push(value);
  }
  return { resolved, unresolved };
}

/** Group resolved refs by category code for display ordering. */
export function groupByCategory(
  refs: readonly ResolvedRef[],
): Record<CategoryCode, ResolvedRef[]> {
  const out: Record<CategoryCode, ResolvedRef[]> = {
    FM: [],
    TD: [],
    RF: [],
    EP: [],
  };
  for (const r of refs) out[r.code].push(r);
  return out;
}

/** All slugs known to the site, across categories. Debug-only. */
export function allKnownSlugs(): string[] {
  return [...indexBySlug().keys()];
}
