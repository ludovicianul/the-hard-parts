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

    // Warning signs: canonical nested { early, mid, late }
    warningSigns: WarningSignsSchema,

    whyItHappens: z.array(z.string()).min(1),
    immediateActions: z.array(z.string()).min(1),
    structuralFixes: z.array(z.string()).min(1),
    whatNotToDo: z.array(z.string()).optional(),

    recoveryDifficulty: z.string().min(1), // docs: easy|medium|medium-hard|hard|very hard

    // AI
    ...SharedAiFields.shape,

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
