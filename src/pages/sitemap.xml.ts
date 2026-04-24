import type { APIRoute } from "astro";
import { listEntries } from "@/lib/load";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { ensureValidated } from "@/lib/validate";

/**
 * /sitemap.xml — static sitemap emitted at build time.
 *
 * Enumerates every route the static build produces:
 *   · homepage
 *   · 4 category landing pages
 *   · every entry detail page across FM / TD / RF / EP
 *
 * Uses the same loaders that drive the detail routes
 * (`getStaticPaths`) so the sitemap can't drift from the actual
 * built routes — if a new category or entry lands, it lands in the
 * sitemap automatically.
 *
 * Search engines and Cloudflare Pages both respect this path by
 * convention. No sitemap index / pagination needed at 40-60 entries
 * per category; the whole site fits comfortably below the 50k-URL
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

  // Category landings.
  for (const code of CATEGORY_ORDER) {
    urls.push({
      loc: `${origin}/${CATEGORIES[code].route}`,
      changefreq: "weekly",
      priority: "0.9",
    });
  }

  // Every entry across the four categories.
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
