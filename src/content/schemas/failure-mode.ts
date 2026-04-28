import { z } from "zod";
import {
  EditionSchema,
  FrequencyEnum,
  IssueStatusSchema,
  PatternConfidenceSchema,
  RefArray,
  RelatedRefs,
  SeverityEnum,
  SharedAiFields,
  SlugSchema,
  TemplateBlock,
} from "./shared";

/**
 * Failure Modes — canonical schema.
 *
 * Aligned with `docs/schema-failure-modes.md`. Content has been migrated to
 * this shape; no compatibility layer remains.
 *
 * Canonical decisions (see docs for full rationale):
 *  - `warningSigns` is a nested object: `{ early, mid, late }`.
 *  - `oftenLeadsTo` and `oftenCausedBy` are first-class FM relationship fields.
 *    `relatedFailureModes` exists only as an optional fallback for neutral
 *    (non-causal) related links.
 *  - `frequency` is a tight controlled enum; no contextual values allowed.
 *  - Slugs omit leading articles like "the-"; titles may keep them.
 */

export const WarningSignsSchema = z
  .object({
    early: z.array(z.string()).min(1),
    mid: z.array(z.string()).min(1),
    late: z.array(z.string()).min(1),
  })
  .strict();

/**
 * `easilyConfusedWith` — structured list of nearby patterns a reader
 * might mistake for this one, each with a one-line distinction.
 *
 * Each item is `{ pattern, distinction }`:
 *  - `pattern`: a FM slug where a named mode exists, OR a short human
 *    label (e.g. "regular refactoring work"). We keep the string loose
 *    for the same reason `RefArray` is loose — some adjacent patterns
 *    don't yet have named entries but still deserve disambiguation.
 *  - `distinction`: one concise sentence explaining how this pattern
 *    differs from the nearby one. Not an essay; one clear contrast.
 *
 * This field exists so readers can tell adjacent failure modes apart
 * without hunting through both detail pages. It is NOT a generic
 * "related" link (that is `relatedFailureModes` / `oftenLeadsTo` /
 * `oftenCausedBy`) — it is specifically about recognition boundary.
 */
export const EasilyConfusedWithSchema = z
  .object({
    pattern: z.string().min(1),
    distinction: z.string().min(1),
  })
  .strict();

export const FailureModeEntrySchema = z
  .object({
    slug: SlugSchema,
    title: z.string().min(1),
    alternativeNames: z.array(z.string()).optional(),
    category: z.string().min(1), // validated against the top-level category.categories list
    summary: z.string().min(1),

    whoNoticesFirst: z.array(z.string()).optional(),
    mistakenFor: z.string().optional(),
    severity: SeverityEnum,
    frequency: FrequencyEnum,
    lifecycleStages: z.array(z.string()).min(1),

    whatItIs: z.string().min(1),
    bestMomentToIntervene: z.string().optional(),
    blastRadius: z.array(z.string()).optional(),
    oftenMistakenAs: z.string().optional(),

    /**
     * Concrete, external "tells" that make the pattern read as
     * responsible, mature, or healthy behavior to people outside
     * the team. Sharpens the recognition work that `mistakenFor`
     * (short label) and `feelsReasonableBecause` (internal narrative
     * logic) already do — this one is scannable and external: what
     * observers see that makes them endorse the pattern.
     *
     * Not required. Strong entries include 2–5 items.
     */
    looksHealthyBecause: z.array(z.string()).optional(),

    /**
     * Nearby patterns this one is often mistaken for, each with a
     * one-line distinction. Used by the detail page to give readers
     * an explicit recognition boundary between adjacent modes. See
     * `EasilyConfusedWithSchema` above for the item shape.
     *
     * Not required. Strong entries include 2–4 items.
     */
    easilyConfusedWith: z.array(EasilyConfusedWithSchema).optional(),

    // Narrative arc
    starts: z.string().min(1),
    feelsReasonableBecause: z.string().min(1),
    escalates: z.string().min(1),
    ends: z.string().min(1),

    // Warning signs: canonical nested { early, mid, late }
    warningSigns: WarningSignsSchema,

    whyItHappens: z.array(z.string()).min(1),
    immediateActions: z.array(z.string()).min(1),
    structuralFixes: z.array(z.string()).min(1),
    whatNotToDo: z.array(z.string()).optional(),

    /**
     * Operational recovery trio. These three scalar fields sharpen
     * the generic `immediateActions` / `structuralFixes` lists into
     * intervention guidance: what to do right now, what you must
     * give up, and which plausible "fix" actually makes it worse.
     *
     * Kept as three separate fields (not a nested `recovery` object)
     * so the Zod schema stays flat and `.passthrough()` compatible,
     * and so content authors can add any subset.
     */
    firstMove: z.string().optional(),
    hardTradeoff: z.string().optional(),
    recoveryTrap: z.string().optional(),

    recoveryDifficulty: z.string().min(1), // docs: easy|medium|medium-hard|hard|very hard

    // AI
    ...SharedAiFields.shape,
    /**
     * Pattern-specific false confidence that AI creates in THIS
     * failure mode. Distinct from `aiCanMakeWorseBy` (list of
     * mechanisms) and `aiSpecificNotes` (editorial synthesis):
     * this one names the specific illusion of correctness /
     * coverage / progress AI produces in the shape of this
     * particular pattern. Rendered on the detail page as a red
     * callout band between the two AI-effect lists and the blue
     * synthesis.
     */
    aiFalseConfidence: z.string().optional(),

    // First-class FM relationship fields.
    // `oftenLeadsTo` / `oftenCausedBy` carry causal meaning, not a weaker
    // "related" generic. They accept either FM slugs or short descriptive
    // causes/consequences (content may hold either).
    oftenLeadsTo: RefArray.optional(),
    oftenCausedBy: RefArray.optional(),

    // Neutral cross-category related references.
    // `relatedFailureModes` is kept optional as a non-causal fallback, per docs.
    ...RelatedRefs.shape,

    // Field notes
    commonQuote: z.string().optional(),
    whoSaysThis: z.string().optional(),
    counterMove: z.string().optional(),
    falsePositive: z.string().optional(),

    patternConfidence: PatternConfidenceSchema,

    /* Edition / issue tracking — see shared.ts for full semantics. */
    edition: EditionSchema,
    issueStatus: IssueStatusSchema.optional(),
  })
  .passthrough();

export type FailureModeEntry = z.infer<typeof FailureModeEntrySchema>;

export const FailureModeFileSchema = z.object({
  category: z.object({
    code: z.literal("FM"),
    name: z.string().min(1),
    summary: z.string().min(1),
    categories: z.array(z.string()).min(1),
  }),
  template: TemplateBlock.optional(),
  entries: z.array(FailureModeEntrySchema).min(1),
});

export type FailureModeFile = z.infer<typeof FailureModeFileSchema>;
