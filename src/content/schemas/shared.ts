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
 * Docs (content-schema.md §Confidence) define `high | medium | low`.
 * MISMATCH: Tech Decisions content also uses `medium-high` on some entries.
 * We widen to the union of docs + observed content values.
 */
export const PatternConfidenceSchema = z.enum([
  "high",
  "medium",
  "low",
  "medium-high",
]);

/**
 * An observed-values enum. Real content uses a richer vocabulary than the docs
 * (e.g. Failure Modes includes `"common in AI work"` under `frequency`).
 * We widen these enums to the UNION of docs + observed content values.
 * Any value not in this list should trigger a validation warning.
 */
export const FrequencyEnum = z.enum([
  // docs-sanctioned
  "rare",
  "uncommon",
  "occasional",
  "common",
  "very common",
  "universal",
  "increasing",
  // observed in content
  "common in AI work",
]);

/**
 * Severity enum.
 * Docs: `low | medium | high | critical`.
 * MISMATCH: Red Flags and Tech Decisions content also use `medium-high`.
 * We widen to the union of docs + observed values.
 */
export const SeverityEnum = z.enum([
  "low",
  "medium",
  "high",
  "critical",
  "medium-high",
]);

/** A common permissive shape: string OR array of strings. */
export const StringOrStringArray = z.union([
  z.string(),
  z.array(z.string()),
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
};
