import type { APIRoute } from "astro";
import { listEntries } from "@/lib/load";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/categories";
import { formatRefCode } from "@/lib/resolve";
import { ensureValidated } from "@/lib/validate";

/**
 * /search-index.json - build-time static search index.
 *
 * Emits a single JSON array with one row per authored entry across
 * FM / TD / RF / EP. The /search page fetches this file once on
 * load and filters it client-side. No backend, no runtime service,
 * no dependency - fits the site's static-first Cloudflare Pages
 * Free deployment model from docs/deployment-target.md.
 *
 * Row shape is flat so the client JS can render directly without
 * reshaping. Total size stays well under 200 KB even at full
 * catalog density.
 */

const prettify = (s: string): string =>
  s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const GET: APIRoute = () => {
  ensureValidated();

  type Row = {
    code: "FM" | "TD" | "RF" | "EP";
    slug: string;
    href: string;
    title: string;
    summary: string;
    refNum: string;
    subcategory: string;
    severity: string;
  };

  const rows: Row[] = [];

  for (const code of CATEGORY_ORDER) {
    const entries = listEntries(code);
    const total = entries.length;
    entries.forEach((e, i) => {
      const { refNum } = formatRefCode(code, i, total);
      // Subcategory field differs per category: FM/TD/EP use
      // `category`, RF uses `layer`.
      const sub =
        (e as { category?: string }).category ??
        (e as { layer?: string }).layer ??
        "";
      // Severity-style field for card weight. FM/RF use `severity`,
      // TD uses `severityIfWrong`, EP uses `difficulty` (aligned to
      // the severity ramp via the shared helpers). All default to
      // "medium" so the results grid never renders a blank card.
      const sev =
        (e as { severity?: string }).severity ??
        (e as { severityIfWrong?: string }).severityIfWrong ??
        (e as { difficulty?: string }).difficulty ??
        "medium";

      rows.push({
        code,
        slug: e.slug,
        href: `/${CATEGORIES[code].route}/${e.slug}`,
        title: e.title,
        summary: e.summary,
        refNum,
        subcategory: prettify(sub),
        severity: sev,
      });
    });
  }

  return new Response(JSON.stringify(rows), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
