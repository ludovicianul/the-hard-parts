import { z } from "zod";
import {
  PatternConfidenceSchema,
  RefArray,
  SlugSchema,
  TemplateBlock,
} from "./shared";

/**
 * Tech Decisions — content-level schema.
 *
 * MAJOR MISMATCHES WITH docs/schema-tech-decisions.md:
 *  - Docs use `category` / `categories`. Content uses `family` / `families`.
 *  - Docs' allowed subcategories: architecture|data|delivery|platform|process|ai.
 *    Content uses: architecture|product-delivery|team-operations|quality-delivery|ai-systems.
 *  - Docs describe fields: `decision`, `coreTradeoff`, `whyThisDecisionExists`,
 *    `hiddenVariables`, `commonMistakes`, `falseSignals`, `secondOrderEffects`,
 *    `decisionHeuristics`, `aiCanHelpWith`/`aiCanMakeWorseBy`/`aiSpecificNotes`.
 *    Content uses parallel but differently-named fields:
 *      decisionQuestion, decisionHeuristic (singular), whatThisIsReallyAbout,
 *      notActuallyAbout, whyItFeelsHard, keyFactors, evidenceNeeded,
 *      defaultBias, reversibility, whenToRevisit, commonBadReasons,
 *      antiPatterns, goodSignalsForA, goodSignalsForB, costBearer,
 *      timeHorizonNotes, aiAmplifies, aiReduces, aiSpecificWarning,
 *      oftenLeadsToFailureModes, adjacentDecisions, severityIfWrong, audiences.
 *  - Docs' `optionA/B` has `failureModes` (plural). Content has
 *    `failureModeWhenMisused` (singular) and adds `hiddenCosts`.
 *  - `relatedTechDecisions` is not used; `adjacentDecisions` plays that role.
 *
 * We model what's actually in the files; we do not invent or rename.
 */

export const TechDecisionOptionSchema = z
  .object({
    name: z.string().min(1),
    bestWhen: z.array(z.string()).optional(),
    realWorldFits: z.array(z.string()).optional(),
    strengths: z.array(z.string()).optional(),
    costs: z.array(z.string()).optional(),
    hiddenCosts: z.array(z.string()).optional(),
    failureModeWhenMisused: z.string().optional(),
    // kept permissive in case an entry uses the docs' plural form
    failureModes: z.array(z.string()).optional(),
  })
  .passthrough();

export const TechDecisionEntrySchema = z
  .object({
    slug: SlugSchema,
    title: z.string().min(1),
    family: z.string().min(1), // validated against category.families

    decisionQuestion: z.string().optional(),
    summary: z.string().min(1),
    decisionHeuristic: z.string().optional(),

    whatThisIsReallyAbout: z.string().optional(),
    notActuallyAbout: z.string().optional(),
    whyItFeelsHard: z.string().optional(),

    optionA: TechDecisionOptionSchema,
    optionB: TechDecisionOptionSchema,

    keyFactors: z.array(z.string()).optional(),
    questionsToAsk: z.array(z.string()).min(1),
    evidenceNeeded: z.array(z.string()).optional(),
    defaultBias: z.string().optional(),
    reversibility: z.string().optional(),

    /**
     * In content: array of trigger strings.
     * Docs do not specify this field. Accept array; tolerate legacy string.
     */
    whenToRevisit: z.union([z.string(), z.array(z.string())]).optional(),

    commonBadReasons: z.array(z.string()).optional(),
    antiPatterns: z.array(z.string()).optional(),
    goodSignalsForA: z.array(z.string()).optional(),
    goodSignalsForB: z.array(z.string()).optional(),

    /**
     * In content: { optionA: string[], optionB: string[] }.
     * Keep permissive: also allow plain string or string[].
     */
    costBearer: z
      .union([
        z.string(),
        z.array(z.string()),
        z
          .object({
            optionA: z.union([z.string(), z.array(z.string())]).optional(),
            optionB: z.union([z.string(), z.array(z.string())]).optional(),
          })
          .passthrough(),
      ])
      .optional(),

    /**
     * In content: { optionA: string, optionB: string }.
     * Keep permissive like costBearer.
     */
    timeHorizonNotes: z
      .union([
        z.string(),
        z
          .object({
            optionA: z.union([z.string(), z.array(z.string())]).optional(),
            optionB: z.union([z.string(), z.array(z.string())]).optional(),
          })
          .passthrough(),
      ])
      .optional(),

    // AI (content-specific names).
    // In content these are single strings. Docs use array-ish fields elsewhere.
    // Accept either string or string[].
    aiAmplifies: z.union([z.string(), z.array(z.string())]).optional(),
    aiReduces: z.union([z.string(), z.array(z.string())]).optional(),
    aiSpecificWarning: z.string().optional(),

    // Cross-refs (content-specific names)
    oftenLeadsToFailureModes: RefArray.optional(),
    relatedRedFlags: RefArray.optional(),
    relatedPlaybooks: RefArray.optional(),
    adjacentDecisions: RefArray.optional(),

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
    families: z.array(z.string()).min(1),
  }),
  template: TemplateBlock.optional(),
  entries: z.array(TechDecisionEntrySchema).min(1),
});

export type TechDecisionFile = z.infer<typeof TechDecisionFileSchema>;
