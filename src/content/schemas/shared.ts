import { z } from "zod";

/**
 * Shared primitives used across all four categories.
 *
 * Design note: these schemas are intentionally written to match the SHAPE OF THE
 * ACTUAL CONTENT in `content/`, not an idealised version of the docs.
 * Every divergence from `docs/content-schema.md` and the per-category schema docs
 * is reported in the Phase 1 completion summary so the team can decide later
 * whether to migrate content or update docs. No invented schema changes here.
 */

export const SlugSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slug must be lowercase, hyphen-separated, no punctuation other than hyphens",
  );

/**
 * Shared `patternConfidence` allowed values.
 *
 * Canonical set (low -> high):
 *   low | medium | medium-high | high
 *
 * `medium-high` is intentional: some Tech Decisions entries need to express
 * "more confident than medium but not yet high" without inflating the claim.
 */
export const PatternConfidenceSchema = z.enum([
  "low",
  "medium",
  "medium-high",
  "high",
]);

/**
 * Canonical, disciplined `frequency` enum.
 *
 * Two kinds of values are accepted:
 *
 *   1. Five ordered *ladder* positions (rare → universal):
 *      `rare · occasional · common · very common · universal`.
 *      These are positions on a how-often-does-this-show-up axis,
 *      rendered as a 5-step bar ladder everywhere frequency appears.
 *
 *   2. One *trend* value: `increasing`.
 *      This is NOT a point on the ladder — it flags a pattern whose
 *      prevalence is rising (often AI-era content). The UI renders it
 *      with a trend arrow (↗) instead of bars, to keep "how common"
 *      and "which way it's moving" from collapsing into one visual.
 *
 * The ordered ladder lives in `src/lib/attribute-scales.ts`
 * (`FREQUENCY_SCALE`) and trend values in `FREQUENCY_TRENDS` there.
 * Keep this enum in sync with those two arrays.
 *
 * The enum intentionally does NOT accept contextual values like
 * `"common in AI work"` — nuance about AI impact lives in
 * `category: "ai"` and the AI fields (`aiCanHelpWith`,
 * `aiCanMakeWorseBy`, `aiSpecificNotes`), not in the frequency label.
 *
 * Content is normalised to this set at author time. Unknown values
 * fail the build at schema parse time.
 */
export const FrequencyEnum = z.enum([
  "rare",
  "occasional",
  "common",
  "very common",
  "universal",
  "increasing",
]);

/**
 * Canonical severity enum (low -> critical).
 *
 * `medium-high` is a deliberate notch for signals/decisions that are clearly
 * more than medium but not yet full high. It is not a general-purpose hedge;
 * prefer `medium` or `high` when either genuinely applies.
 */
export const SeverityEnum = z.enum([
  "low",
  "medium",
  "medium-high",
  "high",
  "critical",
]);

/** Cross-reference arrays are always arrays of slugs (possibly empty). */
export const SlugArray = z.array(SlugSchema);

/**
 * Reference arrays in practice.
 *
 * MISMATCH WITH DOCS: `docs/content-schema.md` says related-entry fields
 * should contain slugs. In the actual content some related fields mix real
 * slugs with human-readable phrases (e.g. `"nobody can explain what done means"`
 * alongside `"the-dependency-fog"`).
 *
 * We intentionally keep the canonical entry-level `slug` field strict but
 * relax reference arrays to "non-empty string" so the build can proceed.
 * The cross-reference validator will flag any reference that does not resolve
 * to a real known slug, surfacing the problem without failing the build by
 * default.
 */
export const RefArray = z.array(z.string().min(1));

/** Common AI fields per the docs' shared conventions. */
export const SharedAiFields = z.object({
  aiCanHelpWith: z.array(z.string()).optional(),
  aiCanMakeWorseBy: z.array(z.string()).optional(),
  aiSpecificNotes: z.string().optional(),
});

/** Cross-category relation fields. Loose-string arrays; refs validated separately. */
export const RelatedRefs = z.object({
  relatedFailureModes: RefArray.optional(),
  relatedRedFlags: RefArray.optional(),
  relatedTechDecisions: RefArray.optional(),
  relatedPlaybooks: RefArray.optional(),
});

/** Top-level `template` block present in every category file. */
export const TemplateBlock = z
  .object({
    fields: z.array(z.string()).optional(),
  })
  .passthrough();

/**
 * Edition / issue identifier present on every entry.
 *
 * Lightweight string slug, validated as `edition-NN` (zero-padded
 * two-digit issue number). The catalog's lib/issues.ts loader
 * derives the issue number ("01") from this string by stripping
 * the prefix. Keeping the prefix in the stored value makes the
 * field self-describing when reading raw JSON ("edition-01" reads
 * unambiguously; a bare "01" would not).
 *
 * Mandatory because every entry must declare which issue it was
 * last created or modified in — this is the basis for the public
 * changelog at /issues/[issue]. Authors must NOT leave it blank.
 */
export const EditionSchema = z
  .string()
  .regex(
    /^edition-\d{2,}$/,
    "edition must be of the form `edition-NN` (e.g. edition-01, edition-12)",
  );

/**
 * Per-entry change-status tag for the public release-notes layer.
 *
 * Optional. Semantics:
 *   · undefined  — entry is "new" in `edition`. The default for
 *                  inaugural-issue entries (Issue 01) and for any
 *                  brand-new entry added in a later issue.
 *   · "new"      — explicit form of the above (rarely needed).
 *   · "modified" — entry existed in a prior edition; its content
 *                  was meaningfully revised in `edition`.
 *   · "removed"  — entry was retired in `edition`. The JSON record
 *                  is kept so the retirement appears in the
 *                  changelog, but `lib/load.ts` filters it from
 *                  canonical listings (it does not appear on
 *                  category landings, detail pages, or search).
 *
 * Issue-membership is determined by `edition`; `issueStatus` only
 * tells the change-log how to bucket the entry within that issue.
 */
export const IssueStatusSchema = z.enum(["new", "modified", "removed"]);
export type IssueStatus = z.infer<typeof IssueStatusSchema>;

/** Categories used in cross-site routing/identity. */
export const CategoryCodeEnum = z.enum(["FM", "TD", "RF", "EP"]);
export type CategoryCode = z.infer<typeof CategoryCodeEnum>;

/** A lightweight resolved reference returned by the resolver layer. */
export type ResolvedRef = {
  code: CategoryCode;
  slug: string;
  title: string;
  categoryRoute: string; // e.g. "/failure-modes"
  href: string;          // e.g. "/failure-modes/the-friendly-rewrite"
  /**
   * 0-based position of this entry within its own category's canonical
   * file order. Used to build catalog reference numbers (see `refCode`,
   * `refNum`) that match the pill shown on the target entry's own
   * detail page.
   */
  indexInCategory: number;
  /**
   * Zero-padded catalog number *without* the category prefix, e.g. "05"
   * or "045". Padding width is `max(2, digits(totalEntries))` so small
   * categories stay compact ("FM-05") and large ones stay aligned
   * ("TD-045"). Match the target entry's own detail page code.
   */
  refNum: string;
  /**
   * Full catalog reference code with category prefix, e.g. "FM-05" or
   * "TD-045". This is the string shown on a target entry's masthead
   * pill AND on every cross-reference link that points to it, so the
   * two never drift.
   */
  refCode: string;
};
