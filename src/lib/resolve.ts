import { CATEGORIES, CATEGORY_ORDER, hrefForEntry } from "./categories";
import { listEntries } from "./load";
import type { CategoryCode, ResolvedRef } from "@/content/schemas/shared";

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
    for (const entry of listEntries(code)) {
      const ref: ResolvedRef = {
        code,
        slug: entry.slug,
        title: entry.title,
        categoryRoute: `/${desc.route}`,
        href: hrefForEntry(code, entry.slug),
      };
      // Slug collisions would be a real integrity bug; validator catches that.
      if (!idx.has(entry.slug)) {
        idx.set(entry.slug, ref);
      }
    }
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
