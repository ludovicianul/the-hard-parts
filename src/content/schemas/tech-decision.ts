import { z } from "zod";
import {
  FrequencyEnum,
  PatternConfidenceSchema,
  RefArray,
  SeverityEnum,
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
 *  - Meta enums are intentionally strict:
 *      `frequency`        uses the site-wide FrequencyEnum.
 *      `severityIfWrong`  uses the site-wide SeverityEnum.
 *    Do not widen these to `z.string()`; if content needs a new value,
 *    promote it in `shared.ts` deliberately and update all four categories.
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

/**
 * `easilyConfusedWith` (TD) — structured list of nearby decisions a
 * reader might mistake this one for, each with a one-line distinction.
 *
 * Distinct from `adjacentDecisions` (a flat slug list meaning "also
 * worth looking at when you're in this neighborhood") and from
 * `notActuallyAbout` (a single framing negation). This field answers
 * "I thought I was making decision X — am I sure?" by naming the
 * sibling decisions and how THIS one differs.
 *
 * Each item is `{ decision, distinction }`:
 *  - `decision`: a TD slug where a named decision exists, OR a short
 *    human label (e.g. "a framework-choice decision") for adjacent
 *    decisions that aren't themselves entries. The resolver returns
 *    a `TD-XX · Title` link for real slugs and the raw phrase for
 *    free labels — same polymorphism as FM's `easilyConfusedWith`.
 *  - `distinction`: one concise sentence naming the specific difference.
 */
export const TechDecisionEasilyConfusedWithSchema = z
  .object({
    decision: z.string().min(1),
    distinction: z.string().min(1),
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
    /**
     * Pattern-specific false confidence that AI creates in THIS
     * decision. Distinct from `aiCanMakeWorseBy` (mechanisms list)
     * and `aiSpecificNotes` (editorial synthesis): this names the
     * specific illusion of correctness, coverage, or progress AI
     * produces in the shape of this particular decision. Rendered
     * as a red callout band between the two AI-effect lists and the
     * blue synthesis. Same role as FM's `aiFalseConfidence`.
     */
    aiFalseConfidence: z.string().optional(),
    aiSpecificNotes: z.string().optional(),

    // Cross-refs
    oftenLeadsToFailureModes: RefArray.optional(),
    adjacentDecisions: RefArray.optional(),
    /**
     * Recognition-boundary cross-refs: decisions this one is often
     * MISTAKEN FOR, each with a one-line distinction. Distinct from
     * `adjacentDecisions` (neutral neighborhood) and `notActuallyAbout`
     * (single-sentence negation). See `TechDecisionEasilyConfusedWithSchema`
     * above for the item shape.
     */
    easilyConfusedWith: z.array(TechDecisionEasilyConfusedWithSchema).optional(),
    relatedRedFlags: RefArray.optional(),
    relatedPlaybooks: RefArray.optional(),

    // Meta (strict enums — see docstring)
    frequency: FrequencyEnum.optional(),
    severityIfWrong: SeverityEnum.optional(),
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
