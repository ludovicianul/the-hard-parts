import type { CategoryCode } from "@/content/schemas/shared";

/**
 * Canonical category metadata.
 *
 * This is the single place that knows about:
 *   - category code (FM/TD/RF/EP)
 *   - display name
 *   - public URL route (kebab-case, plural/explicit per docs/route-map.md)
 *   - on-disk content file paths
 *   - accent token (referenced by styles/tokens.css)
 *
 * Do NOT hardcode category-specific routes or paths anywhere else.
 */

export type CategoryDescriptor = {
  code: CategoryCode;
  /** Human-readable name shown in UI. */
  name: string;
  /** Public URL segment after the leading slash. */
  route: string;
  /** Display label short form (e.g. "FM"). Useful for eyebrows. */
  shortLabel: string;
  /**
   * Content files, relative to the repository root.
   * Engineering Playbook is split across five files per content-location.md.
   */
  files: string[];
  /** The key used inside `category.<k>` to list valid subcategory values. */
  subcategoryListKey: "categories" | "layers";
  /**
   * The entry-level key that holds the subcategory for a given entry
   * (differs by category in actual content).
   */
  subcategoryEntryKey: "category" | "layer";
  /** Name of the CSS variable that sets the accent for this category. */
  accentVar: `--accent-${string}`;
};

export const CATEGORIES: Record<CategoryCode, CategoryDescriptor> = {
  FM: {
    code: "FM",
    name: "Failure Modes",
    route: "failure-modes",
    shortLabel: "FM",
    files: ["content/failure-modes/failure-modes.json"],
    subcategoryListKey: "categories",
    subcategoryEntryKey: "category",
    accentVar: "--accent-fm",
  },
  TD: {
    code: "TD",
    name: "Tech Decisions",
    route: "tech-decisions",
    shortLabel: "TD",
    files: ["content/tech-decisions/tech-decisions.json"],
    subcategoryListKey: "categories",
    subcategoryEntryKey: "category",
    accentVar: "--accent-td",
  },
  RF: {
    code: "RF",
    name: "Red Flags",
    route: "red-flags",
    shortLabel: "RF",
    files: ["content/red-flags/red-flags.json"],
    subcategoryListKey: "layers",
    subcategoryEntryKey: "layer",
    accentVar: "--accent-rf",
  },
  EP: {
    code: "EP",
    name: "Engineering Playbook",
    route: "engineering-playbook",
    shortLabel: "EP",
    files: [
      "content/engineering-playbook/engineering-playbook-ai.json",
      "content/engineering-playbook/engineering-playbook-architecture.json",
      "content/engineering-playbook/engineering-playbook-delivery.json",
      "content/engineering-playbook/engineering-playbook-operations.json",
      "content/engineering-playbook/engineering-playbook-team.json",
    ],
    subcategoryListKey: "categories",
    subcategoryEntryKey: "category",
    accentVar: "--accent-ep",
  },
};

export const CATEGORY_ORDER: CategoryCode[] = ["FM", "TD", "RF", "EP"];

export function categoryByRoute(route: string): CategoryDescriptor | undefined {
  return Object.values(CATEGORIES).find((c) => c.route === route);
}

export function categoryByCode(code: CategoryCode): CategoryDescriptor {
  return CATEGORIES[code];
}

export function hrefForEntry(code: CategoryCode, slug: string): string {
  return `/${CATEGORIES[code].route}/${slug}`;
}
