import { z } from "zod";
import {
  EditionSchema,
  IssueStatusSchema,
  PatternConfidenceSchema,
  RelatedRefs,
  SharedAiFields,
  SlugSchema,
  TemplateBlock,
} from "./shared";

/**
 * Engineering Playbook — content-level schema.
 *
 * MATCHES docs/schema-engineering-playbook.md closely. One note:
 *  - Content is split across 5 files by subcategory
 *    (engineering-playbook-{ai,architecture,delivery,operations,team}.json),
 *    each carrying the full top-level `{category, template, entries}` block.
 *    The loader merges them into one logical collection for routing.
 */

export const PlaybookStepSchema = z
  .object({
    step: z.number().int().positive(),
    title: z.string().min(1),
    purpose: z.string().min(1),
    actions: z.array(z.string()).min(1),
    outputs: z.array(z.string()).min(1),
  })
  .passthrough();

export const PlaybookEntrySchema = z
  .object({
    slug: SlugSchema,
    title: z.string().min(1),
    situation: z.string().min(1),
    category: z.string().min(1), // subcategory
    summary: z.string().min(1),
    goal: z.string().min(1),
    useWhen: z.array(z.string()).min(1),
    doNotUseWhen: z.array(z.string()).optional(),
    whyThisMatters: z.string().min(1),
    whatGoodLooksLike: z.array(z.string()).min(1),
    inputs: z.array(z.string()).optional(),
    rolesInvolved: z.array(z.string()).min(1),
    primaryOwner: z.string().min(1),
    estimatedTimeHorizon: z.string().optional(),
    difficulty: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    steps: z.array(PlaybookStepSchema).min(1),
    decisionPoints: z.array(z.string()).optional(),
    commonMistakes: z.array(z.string()).min(1),
    warningSignsYouAreDoingItWrong: z.array(z.string()).optional(),
    artifactsToProduce: z.array(z.string()).optional(),
    successSignals: z.array(z.string()).min(1),
    followUpActions: z.array(z.string()).optional(),
    metricsOrSignals: z.array(z.string()).optional(),
    ...SharedAiFields.shape,
    ...RelatedRefs.shape,
    examplePromptsOrQuestions: z.array(z.string()).optional(),
    patternConfidence: PatternConfidenceSchema,

    /* Edition / issue tracking — see shared.ts for full semantics. */
    edition: EditionSchema,
    issueStatus: IssueStatusSchema.optional(),
  })
  .passthrough();

export type PlaybookEntry = z.infer<typeof PlaybookEntrySchema>;

export const PlaybookFileSchema = z.object({
  category: z.object({
    code: z.literal("EP"),
    name: z.string().min(1),
    summary: z.string().min(1),
    categories: z.array(z.string()).min(1),
  }),
  template: TemplateBlock.optional(),
  entries: z.array(PlaybookEntrySchema).min(1),
});

export type PlaybookFile = z.infer<typeof PlaybookFileSchema>;
