/**
 * Canonical ordered scales for the four "weight" attributes surfaced on
 * entry cards and the detail metarail: severity, frequency, recovery,
 * pattern confidence.
 *
 * Keeping these ladders in exactly ONE place means the bar-visuals on the
 * FM landing page "reading guide" cards, the bars on the detail MetaRail,
 * and any future component that needs a "position out of N" indicator are
 * all guaranteed to agree on the number of notches and their ordering.
 *
 * IMPORTANT: keep these arrays in sync with the Zod enums in
 * `src/content/schemas/shared.ts`. Severity + frequency + confidence are
 * enums; `recoveryDifficulty` is a loose string in the schema but has a
 * documented canonical ladder (easy → very hard) which we enforce here.
 */

export const SEVERITY_SCALE = [
  "low",
  "medium",
  "medium-high",
  "high",
  "critical",
] as const;

/**
 * Five-step ordered frequency scale. The previous `increasing` value was
 * removed from this ladder because it is not a position on a rare →
 * universal axis — it is a *trend*, a statement about the direction the
 * pattern is moving. Treating it as a ladder step collapsed two
 * orthogonal ideas ("how common" and "which way it's trending") into
 * one and produced a broken bar visual ("more than universal?").
 *
 * Content may still carry `frequency: "increasing"` (it is accepted by
 * the site-wide `FrequencyEnum`), and consumers should render it as a
 * distinct trend-arrow badge — see `isTrend()` and components that
 * render frequency (`MetaRail`, FM landing reading guide).
 */
export const FREQUENCY_SCALE = [
  "rare",
  "occasional",
  "common",
  "very common",
  "universal",
] as const;

/**
 * Frequency values that are *not* a position on FREQUENCY_SCALE but a
 * separate trend indicator. Kept as a list so future trend-style values
 * (e.g. "decreasing") can be added in one place.
 */
export const FREQUENCY_TRENDS = ["increasing"] as const;
export type FrequencyTrend = (typeof FREQUENCY_TRENDS)[number];

/** True if a frequency value is a trend arrow, not a ladder position. */
export function isFrequencyTrend(value: string): value is FrequencyTrend {
  return (FREQUENCY_TRENDS as readonly string[]).includes(value);
}

export const RECOVERY_SCALE = [
  "easy",
  "medium",
  "medium-hard",
  "hard",
  "very hard",
] as const;

export const CONFIDENCE_SCALE = [
  "low",
  "medium",
  "medium-high",
  "high",
] as const;

export type SeverityLevel   = (typeof SEVERITY_SCALE)[number];
export type FrequencyLevel  = (typeof FREQUENCY_SCALE)[number];
export type RecoveryLevel   = (typeof RECOVERY_SCALE)[number];
export type ConfidenceLevel = (typeof CONFIDENCE_SCALE)[number];

/**
 * Find the 1-indexed position of `value` inside `scale`. Returns the
 * position of the last element when `value` is not found, so a bar
 * visual never renders empty — a missing/mistyped value still reads
 * as "unknown but present" rather than disappearing. Callers that
 * need strictness should check `scale.includes(value)` first.
 */
export function scalePosition(
  scale: readonly string[],
  value: string,
): number {
  const i = scale.indexOf(value);
  return i < 0 ? 0 : i + 1;
}

/**
 * Compute `{ total, filled }` bar counts for a value against a scale.
 * Use from components that render N bars with K highlighted.
 */
export function barCounts(
  scale: readonly string[],
  value: string,
): { total: number; filled: number } {
  return {
    total: scale.length,
    filled: scalePosition(scale, value),
  };
}
