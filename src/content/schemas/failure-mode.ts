import { z } from "zod";
import {
  FrequencyEnum,
  PatternConfidenceSchema,
  RefArray,
  RelatedRefs,
  SeverityEnum,
  SharedAiFields,
  SlugSchema,
  TemplateBlock,
} from "./shared";

/**
 * Failure Modes — content-level schema.
 *
 * MISMATCHES WITH docs/schema-failure-modes.md (reported, not "fixed"):
 *  - docs describe `warningSigns: { early, mid, late }`; content uses three
 *    flat arrays: `earlyWarningSigns`, `midWarningSigns`, `lateWarningSigns`.
 *    We model what's actually there.
 *  - `relatedFailureModes` is not present on entries; intra-category links
 *    are expressed via `oftenLeadsTo` and `oftenCausedBy` instead.
 *  - `frequency` includes `"common in AI work"` which is not in the docs enum.
 *  - Slug uses `the-friendly-rewrite` (docs prefer stripping `the-` but also
 *    say preserve established slugs — so we preserve).
 */

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

    // Narrative arc
    starts: z.string().min(1),
    feelsReasonableBecause: z.string().min(1),
    escalates: z.string().min(1),
    ends: z.string().min(1),

    // Warning signs: FLAT arrays (matches actual content, not nested per docs)
    earlyWarningSigns: z.array(z.string()).min(1),
    midWarningSigns: z.array(z.string()).min(1),
    lateWarningSigns: z.array(z.string()).min(1),

    whyItHappens: z.array(z.string()).min(1),
    immediateActions: z.array(z.string()).min(1),
    structuralFixes: z.array(z.string()).min(1),
    whatNotToDo: z.array(z.string()).optional(),

    recoveryDifficulty: z.string().min(1), // docs: easy|medium|medium-hard|hard|very hard (widened)

    // AI
    ...SharedAiFields.shape,

    // Intra- and cross-category relations
    oftenLeadsTo: RefArray.optional(),
    oftenCausedBy: RefArray.optional(),
    ...RelatedRefs.shape,

    // Field notes
    commonQuote: z.string().optional(),
    whoSaysThis: z.string().optional(),
    counterMove: z.string().optional(),
    falsePositive: z.string().optional(),

    patternConfidence: PatternConfidenceSchema,
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
