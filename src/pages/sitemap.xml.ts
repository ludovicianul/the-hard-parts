import type { APIRoute } from "astro";
import { listEntries } from "@/lib/load";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { listAllIssues } from "@/lib/issues";
import { ensureValidated } from "@/lib/validate";

/**
 * /sitemap.xml — static sitemap emitted at build time.
 *
 * Enumerates every route the static build produces:
 *   · homepage
 *   · About + Search
 *   · 4 category landing pages + every entry detail page
 *   · /issues archive + every /issues/[issue] release-notes page
 *
 * Uses the same loaders that drive the detail routes
 * (`getStaticPaths`) so the sitemap can't drift from the actual
 * built routes — if a new category, entry, or issue lands, it lands
 * in the sitemap automatically.
 *
 * `listEntries()` already filters out `issueStatus: "removed"`
 * entries, so retired entries are absent from the sitemap as well
 * as from the canonical site (their canonical detail page is not
 * generated; see `lib/load.ts`). Issue release-notes pages still
 * surface those retirements as plain-text rows, but those rows
 * have no individual URLs.
 *
 * Search engines and Cloudflare Pages both respect this path by
 * convention. No sitemap index / pagination needed at 150+ entries
 * total; the whole site fits comfortably below the 50k-URL
 * per-sitemap cap.
 */
export const GET: APIRoute = ({ site }) => {
  ensureValidated();

  if (!site) {
    throw new Error("Astro `site` must be set for sitemap generation. See astro.config.mjs.");
  }
  const origin = site.toString().replace(/\/$/, "");

  type Url = { loc: string; changefreq?: string; priority?: string };
  const urls: Url[] = [];

  // Homepage — front door, highest priority.
  urls.push({ loc: `${origin}/`, changefreq: "weekly", priority: "1.0" });

  // Supporting pages (About / Method + Search).
  urls.push({ loc: `${origin}/about`,  changefreq: "monthly", priority: "0.5" });
  urls.push({ loc: `${origin}/search`, changefreq: "monthly", priority: "0.5" });

  // Issues archive — public release-notes index. Sits at "weekly"
  // so a crawler picks up new issues quickly when they ship; rated
  // below category landings since it is editorial-meta, not the
  // primary catalog surface.
  urls.push({ loc: `${origin}/issues`, changefreq: "weekly", priority: "0.6" });

  // Category landings.
  for (const code of CATEGORY_ORDER) {
    urls.push({
      loc: `${origin}/${CATEGORIES[code].route}`,
      changefreq: "weekly",
      priority: "0.9",
    });
  }

  // Every entry across the four categories. `listEntries()` already
  // filters out `issueStatus: "removed"` entries — they have no
  // canonical detail page, and so they don't belong here.
  for (const code of CATEGORY_ORDER) {
    const entries = listEntries(code);
    for (const e of entries) {
      urls.push({
        loc: `${origin}/${CATEGORIES[code].route}/${e.slug}`,
        changefreq: "monthly",
        priority: "0.8",
      });
    }
  }

  // Every published issue's release-notes page. `listAllIssues()`
  // returns issues that actually have at least one entry, ordered
  // newest first — empty issues sketched in `content/issues.json`
  // are deliberately excluded (we don't publish empty release notes).
  for (const issue of listAllIssues()) {
    urls.push({
      loc: `${origin}${issue.href}`,
      changefreq: "monthly",
      priority: "0.5",
    });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${u.loc}</loc>\n` +
          (u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>\n` : "") +
          (u.priority ? `    <priority>${u.priority}</priority>\n` : "") +
          `  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
