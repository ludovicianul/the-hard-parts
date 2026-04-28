import { z } from "zod";
import {
  EditionSchema,
  FrequencyEnum,
  IssueStatusSchema,
  PatternConfidenceSchema,
  RefArray,
  SeverityEnum,
  SlugSchema,
  TemplateBlock,
} from "./shared";

/**
 * Red Flags — canonical schema.
 *
 * Aligned with `docs/schema-red-flags.md`. Content, docs, and types all agree
 * on this shape. No compatibility layer.
 *
 * Canonical decisions (see docs for full rationale):
 *  - Red Flags use a TWO-axis classification:
 *      layer       = where the signal appears (code | team | process |
 *                     leadership | ai)
 *      signalType  = what kind of signal it is (structural | behavioral |
 *                     delivery | communication | architectural | operational |
 *                     ai-quality)
 *  - Richer RF-specific field names are canonical:
 *      whatYouNotice, whatItUsuallyIndicates, whatToCheckNext,
 *      likelyConsequences, exampleSignals, falseFriends.
 *  - Diagnostic fields preserved as first-class:
 *      decisionHeuristic, commonContexts, notNecessarilyAProblemWhen,
 *      leadingIndicators, diagnosticQuestions, commonRootCauses, antiPatterns,
 *      ownerMostLikelyToNotice, ownerBestPlacedToAct, timeHorizon.
 *  - Owner fields are arrays only. AI effect fields (aiAmplifies, aiMasks)
 *    are arrays only. AI synthesis field uses the site-wide canonical name
 *    `aiSpecificNotes` (string).
 *  - `severity` allows: low | medium | medium-high | high | critical.
 *  - `frequency` uses the site-wide canonical FrequencyEnum.
 */

export const RedFlagEntrySchema = z
  .object({
    // Identity + classification (two axes)
    slug: SlugSchema,
    title: z.string().min(1),
    layer: z.string().min(1),       // validated against category.layers
    signalType: z.string().min(1),  // validated against category.signalTypes

    // Summary + framing
    summary: z.string().min(1),
    decisionHeuristic: z.string().optional(),

    // Signal surface
    whatYouNotice: z.string().min(1),
    whyItMatters: z.string().min(1),
    whatItUsuallyIndicates: z.array(z.string()).min(1),
    notNecessarilyAProblemWhen: z.array(z.string()).optional(),
    commonContexts: z.array(z.string()).optional(),

    // Severity / frequency / detectability
    severity: SeverityEnum,
    frequency: FrequencyEnum,
    /**
     * Detectability is a tight vocabulary in content but differs from the
     * earlier docs list. Allowed values (content-canonical):
     *   obvious | visible-if-you-look | subtle | easy-to-normalize
     * Kept as a string here because the vocabulary is still settling; docs
     * define the canonical set, and Phase 2 may promote it to an enum.
     */
    detectability: z.string().min(1),

    // Diagnostic progression
    leadingIndicators: z.array(z.string()).optional(),
    diagnosticQuestions: z.array(z.string()).optional(),
    whatToCheckNext: z.array(z.string()).min(1),
    commonRootCauses: z.array(z.string()).optional(),
    likelyConsequences: z.array(z.string()).min(1),
    antiPatterns: z.array(z.string()).optional(),
    falseFriends: z.array(z.string()).optional(),

    // Ownership / timing (arrays only — no string/array union)
    ownerMostLikelyToNotice: z.array(z.string()).optional(),
    ownerBestPlacedToAct: z.array(z.string()).optional(),
    timeHorizon: z.string().optional(),

    // AI effects (arrays only; site-wide aiSpecificNotes)
    aiAmplifies: z.array(z.string()).optional(),
    aiMasks: z.array(z.string()).optional(),
    aiSpecificNotes: z.string().optional(),

    // Cross-refs
    relatedFailureModes: RefArray.optional(),
    relatedTechDecisions: RefArray.optional(),
    relatedPlaybooks: RefArray.optional(),
    relatedRedFlags: RefArray.optional(),

    // Memorability
    exampleSignals: z.array(z.string()).optional(),

    patternConfidence: PatternConfidenceSchema,

    /* Edition / issue tracking — see shared.ts for full semantics. */
    edition: EditionSchema,
    issueStatus: IssueStatusSchema.optional(),
  })
  .passthrough();

export type RedFlagEntry = z.infer<typeof RedFlagEntrySchema>;

export const RedFlagFileSchema = z.object({
  category: z.object({
    code: z.literal("RF"),
    name: z.string().min(1),
    summary: z.string().min(1),
    /** Primary axis: where the signal appears. */
    layers: z.array(z.string()).min(1),
    /** Secondary axis: what kind of signal it is. */
    signalTypes: z.array(z.string()).min(1),
  }),
  template: TemplateBlock.optional(),
  entries: z.array(RedFlagEntrySchema).min(1),
});

export type RedFlagFile = z.infer<typeof RedFlagFileSchema>;
