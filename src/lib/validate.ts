import { CATEGORIES, CATEGORY_ORDER } from "./categories";
import {
  categoryBlock,
  declaredSubcategories,
  listEntries,
  subcategoryOf,
} from "./load";
import { indexBySlug } from "./resolve";
import type { CategoryCode } from "@/content/schemas/shared";

/**
 * Build-time content integrity checks.
 *
 * Invoked explicitly by the validation script (`npm run validate`) and called
 * once per build from `src/lib/validate.ts`'s `ensureValidated()` helper,
 * which every page uses before generating static paths.
 *
 * Checks performed:
 *   1. Slug uniqueness (globally + per-category).
 *   2. Subcategory validity against the category's declared subcategory list.
 *   3. Cross-reference integrity for every known related-slug field.
 *   4. Enum conformance is done at parse time via Zod and reported there.
 *
 * Strictness policy:
 *   - Slug uniqueness and subcategory validity FAIL the build.
 *   - Cross-reference integrity is configurable. Default is `warn`, because
 *     current content has known dangling refs across the four categories.
 *     Flip to `strict` via `NSB_STRICT_REFS=1` once content is migrated.
 */

export type ValidationIssue = {
  severity: "error" | "warn";
  kind:
    | "slug-duplicate"
    | "slug-format"
    | "subcategory-invalid"
    | "ref-unresolved";
  category?: CategoryCode;
  slug?: string;
  field?: string;
  message: string;
};

const STRICT_REFS = process.env.NSB_STRICT_REFS === "1";

/** List of entry fields that contain related-slug arrays, per category. */
const REF_FIELDS: Record<CategoryCode, readonly string[]> = {
  FM: [
    "oftenLeadsTo",
    "oftenCausedBy",
    "relatedFailureModes",
    "relatedRedFlags",
    "relatedTechDecisions",
    "relatedPlaybooks",
  ],
  TD: [
    "oftenLeadsToFailureModes",
    "relatedRedFlags",
    "relatedPlaybooks",
    "adjacentDecisions",
  ],
  RF: [
    "relatedFailureModes",
    "relatedTechDecisions",
    "relatedPlaybooks",
    "relatedRedFlags",
  ],
  EP: [
    "relatedFailureModes",
    "relatedRedFlags",
    "relatedTechDecisions",
    "relatedPlaybooks",
  ],
};

export function runValidation(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1 + 2. Slug uniqueness + subcategory validity.
  const seenSlugs = new Map<string, CategoryCode>();
  for (const code of CATEGORY_ORDER) {
    const declared = new Set(declaredSubcategories(code));
    const entries = listEntries(code);
    for (const entry of entries) {
      // slug duplicate
      if (seenSlugs.has(entry.slug)) {
        issues.push({
          severity: "error",
          kind: "slug-duplicate",
          category: code,
          slug: entry.slug,
          message: `Duplicate slug "${entry.slug}" found in ${code}; already registered under ${seenSlugs.get(entry.slug)}`,
        });
      } else {
        seenSlugs.set(entry.slug, code);
      }

      // subcategory valid
      const sub = subcategoryOf(code, entry);
      if (!sub) {
        issues.push({
          severity: "error",
          kind: "subcategory-invalid",
          category: code,
          slug: entry.slug,
          message: `Entry "${entry.slug}" (${code}) has no subcategory value on field "${CATEGORIES[code].subcategoryEntryKey}"`,
        });
      } else if (!declared.has(sub)) {
        issues.push({
          severity: "error",
          kind: "subcategory-invalid",
          category: code,
          slug: entry.slug,
          message: `Entry "${entry.slug}" (${code}) uses subcategory "${sub}" which is not declared in category.${CATEGORIES[code].subcategoryListKey} [${[...declared].join(", ")}]`,
        });
      }
    }
  }

  // 3. Cross-reference integrity.
  const idx = indexBySlug();
  for (const code of CATEGORY_ORDER) {
    const fields = REF_FIELDS[code];
    for (const entry of listEntries(code)) {
      const rec = entry as Record<string, unknown>;
      for (const field of fields) {
        const refs = rec[field];
        if (!Array.isArray(refs)) continue;
        for (const ref of refs) {
          if (typeof ref !== "string") continue;
          if (!idx.has(ref)) {
            issues.push({
              severity: STRICT_REFS ? "error" : "warn",
              kind: "ref-unresolved",
              category: code,
              slug: entry.slug,
              field,
              message: `Unresolved reference "${ref}" in ${code}/${entry.slug}.${field}`,
            });
          }
        }
      }
    }
  }

  return issues;
}

/**
 * One-shot guard: run validation and throw on any error-severity issue.
 * Page files call this before generating paths so broken content fails the build.
 * Idempotent + cached across calls.
 */
let _done = false;
let _cached: ValidationIssue[] = [];
export function ensureValidated(): ValidationIssue[] {
  if (_done) return _cached;
  _cached = runValidation();
  _done = true;

  const errors = _cached.filter((i) => i.severity === "error");
  if (errors.length > 0) {
    const msg = errors.map((i) => `  [${i.kind}] ${i.message}`).join("\n");
    throw new Error(
      `Content validation failed with ${errors.length} error(s):\n${msg}`,
    );
  }
  return _cached;
}

export function summarizeIssues(issues: ValidationIssue[]): string {
  const byKind = new Map<string, number>();
  for (const i of issues) {
    const key = `${i.severity}:${i.kind}`;
    byKind.set(key, (byKind.get(key) ?? 0) + 1);
  }
  const lines = [...byKind.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, n]) => `  ${k}: ${n}`);
  return lines.length
    ? `Validation summary:\n${lines.join("\n")}`
    : "Validation summary: no issues";
}
