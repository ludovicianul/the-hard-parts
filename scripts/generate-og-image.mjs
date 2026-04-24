#!/usr/bin/env node
/**
 * generate-og-image.mjs — one-shot SVG → PNG converter for the
 * default Open Graph card.
 *
 * Why a committed PNG (not runtime SVG):
 *   Facebook, Twitter/X, LinkedIn, and Slack all require raster images
 *   for link previews (PNG or JPG). SVG is not accepted as og:image by
 *   any of the major platforms in 2025. So we author the editorial
 *   card in SVG (human-editable) and rasterize it once at build-time
 *   to `/public/og-default.png` (the stable URL platforms actually
 *   fetch).
 *
 * Why a script, not a runtime pipeline:
 *   The site is static-first / Cloudflare-Pages-Free-friendly. Running
 *   sharp during every request is exactly the runtime dependency we
 *   are avoiding. This script runs locally (or in CI) and commits the
 *   PNG as a static asset. Cloudflare Pages serves it as-is.
 *
 * Dependency note:
 *   `sharp` is already installed transitively via Astro's image
 *   pipeline, so this script adds no new top-level dependency.
 *
 * Usage:
 *   npm run og
 * which is defined in package.json as:
 *   node scripts/generate-og-image.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "public/og-default.svg");
const OUT = resolve(ROOT, "public/og-default.png");

// Target card size — the Open Graph 1200×630 spec that Facebook,
// Twitter (summary_large_image), LinkedIn, and Slack all render at
// the same aspect ratio. Density 2 gives us a crisp raster without
// doubling the asset dimensions.
const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  const svg = await readFile(SRC);

  const png = await sharp(svg, { density: 288 })
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await writeFile(OUT, png);

  const kb = (png.length / 1024).toFixed(1);
  console.log(`Wrote ${OUT} (${WIDTH}×${HEIGHT}, ${kb} KB)`);
}

main().catch((err) => {
  console.error("Failed to generate OG PNG:", err);
  process.exit(1);
});
