import { z } from "zod";
import {
  PatternConfidenceSchema,
  RefArray,
  SlugSchema,
  TemplateBlock,
} from "./shared";

/**
 * Tech Decisions — canonical schema.
 *
 * Aligned with `docs/schema-tech-decisions.md`. Content, docs, and types all
 * agree on this shape. No compatibility layer.
 *
 * Canonical decisions (see docs for full rationale):
 *  - Top-level block uses `category.categories` (not `families`).
 *  - Entry subcategory field is `category` (not `family`).
 *  - Subcategories: architecture | product-delivery | team-operations |
 *    quality-delivery | ai-systems.
 *  - The richer content model is canonical. Fields like `whatThisIsReallyAbout`,
 *    `notActuallyAbout`, `whyItFeelsHard`, `keyFactors`, `evidenceNeeded`,
 *    `defaultBias`, `reversibility`, `whenToRevisit`, `commonBadReasons`,
 *    `antiPatterns`, `goodSignalsForA/B`, `costBearer`, `timeHorizonNotes`,
 *    `oftenLeadsToFailureModes`, `adjacentDecisions`, `severityIfWrong`,
 *    `audiences`, `frequency` are first-class.
 *  - `optionA` / `optionB` use `failureModesWhenMisused` (plural, array) and
 *    `hiddenCosts` (array). Option objects are strict — no extra keys.
 *  - `costBearer` is the strict comparison object `{ optionA: string[],
 *    optionB: string[] }`. `timeHorizonNotes` is `{ optionA: string,
 *    optionB: string }`.
 *  - `whenToRevisit` is `string[]` — no string fallback.
 *  - AI fields use the site-wide canonical names: `aiCanHelpWith` (array),
 *    `aiCanMakeWorseBy` (array), `aiSpecificNotes` (string).
 *  - `patternConfidence` allows: low | medium | medium-high | high.
 */

export const TechDecisionOptionSchema = z
  .object({
    name: z.string().min(1),
    bestWhen: z.array(z.string()).optional(),
    strengths: z.array(z.string()).optional(),
    costs: z.array(z.string()).optional(),
    hiddenCosts: z.array(z.string()).optional(),
    /**
     * Plural array. Carries one or more failure modes that manifest when the
     * option is misapplied. Can be an FM slug, a short phrase, or both.
     */
    failureModesWhenMisused: z.array(z.string()).optional(),
    realWorldFits: z.array(z.string()).optional(),
  })
  .strict();

/** Structured A/B comparison carrier: who bears the cost of each option. */
export const CostBearerSchema = z
  .object({
    optionA: z.array(z.string()).min(1),
    optionB: z.array(z.string()).min(1),
  })
  .strict();

/** Structured A/B comparison carrier: when each option wins over time. */
export const TimeHorizonNotesSchema = z
  .object({
    optionA: z.string().min(1),
    optionB: z.string().min(1),
  })
  .strict();

export const TechDecisionEntrySchema = z
  .object({
    // Identity
    slug: SlugSchema,
    title: z.string().min(1),
    decisionQuestion: z.string().min(1),
    category: z.string().min(1), // validated against category.categories
    summary: z.string().min(1),

    // Framing
    decisionHeuristic: z.string().optional(),
    whatThisIsReallyAbout: z.string().optional(),
    notActuallyAbout: z.string().optional(),
    whyItFeelsHard: z.string().optional(),

    // Options
    optionA: TechDecisionOptionSchema,
    optionB: TechDecisionOptionSchema,

    // Decision support
    keyFactors: z.array(z.string()).optional(),
    questionsToAsk: z.array(z.string()).min(1),
    evidenceNeeded: z.array(z.string()).optional(),
    defaultBias: z.string().optional(),
    reversibility: z.string().optional(),
    whenToRevisit: z.array(z.string()).optional(),

    // Diagnostic signals
    commonBadReasons: z.array(z.string()).optional(),
    antiPatterns: z.array(z.string()).optional(),
    goodSignalsForA: z.array(z.string()).optional(),
    goodSignalsForB: z.array(z.string()).optional(),

    // Structured A/B comparison objects
    costBearer: CostBearerSchema.optional(),
    timeHorizonNotes: TimeHorizonNotesSchema.optional(),

    // AI (site-wide canonical names)
    aiCanHelpWith: z.array(z.string()).optional(),
    aiCanMakeWorseBy: z.array(z.string()).optional(),
    aiSpecificNotes: z.string().optional(),

    // Cross-refs
    oftenLeadsToFailureModes: RefArray.optional(),
    adjacentDecisions: RefArray.optional(),
    relatedRedFlags: RefArray.optional(),
    relatedPlaybooks: RefArray.optional(),

    // Meta
    frequency: z.string().optional(),
    severityIfWrong: z.string().optional(),
    audiences: z.array(z.string()).optional(),

    patternConfidence: PatternConfidenceSchema,
  })
  .passthrough();

export type TechDecisionEntry = z.infer<typeof TechDecisionEntrySchema>;

export const TechDecisionFileSchema = z.object({
  category: z.object({
    code: z.literal("TD"),
    name: z.string().min(1),
    summary: z.string().min(1),
    categories: z.array(z.string()).min(1),
  }),
  template: TemplateBlock.optional(),
  entries: z.array(TechDecisionEntrySchema).min(1),
});

export type TechDecisionFile = z.infer<typeof TechDecisionFileSchema>;
