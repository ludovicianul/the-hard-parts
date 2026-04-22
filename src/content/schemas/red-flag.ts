import { z } from "zod";
import {
  PatternConfidenceSchema,
  RefArray,
  SeverityEnum,
  SlugSchema,
  StringOrStringArray,
  TemplateBlock,
} from "./shared";

/**
 * Red Flags — content-level schema.
 *
 * MAJOR MISMATCHES WITH docs/schema-red-flags.md:
 *  - Docs use `category` / `categories`. Content uses `layer` / `layers`
 *    PLUS a second axis `signalType` / `signalTypes`.
 *  - Allowed `layers` in content: code|team|process|leadership|ai.
 *    Docs add `architecture` and `operations` — absent in current content.
 *  - Different field names:
 *      docs `signal` -> content `whatYouNotice`
 *      docs `usuallyIndicates` -> content `whatItUsuallyIndicates`
 *      docs `whatToInspectNext` -> content `whatToCheckNext`
 *      docs `ifIgnored` -> content `likelyConsequences`
 *      docs `examplePhrases` -> content `exampleSignals`
 *      docs `oftenConfusedWith` / `counterSignals` -> content `falseFriends`
 *      docs `aiCanHelpWith` / `aiCanMakeWorseBy` / `aiSpecificNotes` ->
 *        content `aiAmplifies` / `aiMasks` / `aiSpecificVariant`
 *  - Content adds: decisionHeuristic, commonContexts, notNecessarilyAProblemWhen,
 *    leadingIndicators, diagnosticQuestions, commonRootCauses, antiPatterns,
 *    ownerMostLikelyToNotice, ownerBestPlacedToAct, timeHorizon.
 *
 * We model what's actually in the files; we do not invent or rename.
 */

export const RedFlagEntrySchema = z
  .object({
    slug: SlugSchema,
    title: z.string().min(1),
    layer: z.string().min(1),       // validated against category.layers
    signalType: z.string().min(1),  // validated against category.signalTypes

    summary: z.string().min(1),
    decisionHeuristic: z.string().optional(),

    whatYouNotice: z.string().min(1),
    whyItMatters: z.string().min(1),
    whatItUsuallyIndicates: z.array(z.string()).min(1),
    notNecessarilyAProblemWhen: z.array(z.string()).optional(),
    commonContexts: z.array(z.string()).optional(),

    severity: SeverityEnum,
    frequency: z.string().min(1),     // content uses values outside the docs enum in places
    detectability: z.string().min(1), // easy|moderate|hard|deceptive (permissive)

    leadingIndicators: z.array(z.string()).optional(),
    diagnosticQuestions: z.array(z.string()).optional(),
    whatToCheckNext: z.array(z.string()).min(1),
    commonRootCauses: z.array(z.string()).optional(),
    likelyConsequences: z.array(z.string()).min(1),
    antiPatterns: z.array(z.string()).optional(),
    falseFriends: z.array(z.string()).optional(),

    // Content uses arrays sometimes; docs-ish fields would be strings.
    ownerMostLikelyToNotice: StringOrStringArray.optional(),
    ownerBestPlacedToAct: StringOrStringArray.optional(),
    timeHorizon: z.string().optional(),

    // Content uses plain strings for these; keep permissive.
    aiAmplifies: StringOrStringArray.optional(),
    aiMasks: StringOrStringArray.optional(),
    aiSpecificVariant: z.string().optional(),

    relatedFailureModes: RefArray.optional(),
    relatedTechDecisions: RefArray.optional(),
    relatedPlaybooks: RefArray.optional(),
    relatedRedFlags: RefArray.optional(),

    exampleSignals: z.array(z.string()).optional(),

    patternConfidence: PatternConfidenceSchema,
  })
  .passthrough();

export type RedFlagEntry = z.infer<typeof RedFlagEntrySchema>;

export const RedFlagFileSchema = z.object({
  category: z.object({
    code: z.literal("RF"),
    name: z.string().min(1),
    summary: z.string().min(1),
    layers: z.array(z.string()).min(1),
    signalTypes: z.array(z.string()).min(1),
  }),
  template: TemplateBlock.optional(),
  entries: z.array(RedFlagEntrySchema).min(1),
});

export type RedFlagFile = z.infer<typeof RedFlagFileSchema>;
