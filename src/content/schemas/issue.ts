import { z } from "zod";

/**
 * Issue / edition metadata schema.
 *
 * Backs `content/issues.json` — a single, lightweight metadata file
 * for the public release-notes layer at `/issues`.
 *
 * Membership is NOT defined here. An entry belongs to an issue iff
 * its own `edition` field equals `"edition-NN"` for that issue. This
 * file only carries human-readable metadata (title / date / summary)
 * for issues that exist in the data, so the archive page and the
 * detail headers have something to render beyond the bare number.
 *
 * Design rules:
 *   · An issue can exist in the data WITHOUT being listed here
 *     (lib/issues.ts will derive it from `edition` values and render
 *     a metadata-less issue page). Listing here is purely additive.
 *   · An issue can be listed here even if no entries reference it
 *     yet (useful for sketching a future issue's metadata before
 *     authoring entries — but we do NOT publish such issues until
 *     they actually have entries; see `listAllIssues` in
 *     `src/lib/issues.ts` for the gating rule).
 *   · `number` matches the trailing digits of `edition` ("01" for
 *     `edition: "edition-01"`).
 */
export const IssueMetaSchema = z.object({
  /**
   * Zero-padded two-digit issue number, e.g. "01", "02", "12".
   * Forms the public URL: `/issues/01`. The `edition` field on
   * entries uses the form `edition-${number}`.
   */
  number: z
    .string()
    .regex(
      /^\d{2,}$/,
      "issue number must be a zero-padded integer string (e.g. 01, 02, 12)",
    ),
  /** Optional editorial title shown in archive listings + detail header. */
  title: z.string().min(1).optional(),
  /**
   * ISO-8601 calendar date (YYYY-MM-DD). Optional. When present,
   * shown in archive listings and in the issue detail header.
   */
  releaseDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "releaseDate must be ISO-8601 (YYYY-MM-DD)",
    )
    .optional(),
  /**
   * One- or two-sentence summary shown in archive listings + detail
   * header. Editorial voice; no marketing copy.
   */
  summary: z.string().min(1).optional(),
});

export type IssueMeta = z.infer<typeof IssueMetaSchema>;

export const IssueMetaFileSchema = z.object({
  issues: z.array(IssueMetaSchema),
});

export type IssueMetaFile = z.infer<typeof IssueMetaFileSchema>;
