/**
 * src/pages/og/[...path].png.ts
 *
 * Build-time OG image generator for all entry detail pages.
 * Produces one 1200×630 PNG per entry at /og/<category>/<slug>.png
 * and one per essay at /og/essays/<slug>.png.
 *
 * Visual language mirrors the default card (og-default.svg):
 *   · Black nameplate rail on the left (380px)
 *   · Warm paper (#f7f4eb) on the right
 *   · Yellow accent (#ffd60a) for category code and accent rule
 *   · Site name + category label on the left rail
 *   · Entry title (large serif) + summary on the right face
 *
 * No runtime server required — Astro calls getStaticPaths() at build
 * time and renders all PNGs into dist/og/. BaseLayout then points
 * og:image at /og/<path>.png for each entry page.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";
import { loadFailureModes, loadTechDecisions, loadRedFlags, loadPlaybooks } from "@/lib/load";
import { listFieldNotes } from "@/lib/field-notes";

// ── colour tokens matching site CSS variables ─────────────────────
const C = {
  black:    "#000000",
  paper:    "#f7f4eb",
  yellow:   "#ffd60a",
  ink:      "#0d0d10",
  inkSoft:  "#54545a",
  inkFaint: "#9b9b9f",
  fmWash:   "#fff3f3",
  tdWash:   "#f3f6ff",
  rfWash:   "#fff9f0",
  epWash:   "#f3fff6",
  fmAccent: "#e03131",
  tdAccent: "#2563eb",
  rfAccent: "#d97706",
  epAccent: "#16a34a",
} as const;

// ── category metadata ─────────────────────────────────────────────
type CatCode = "FM" | "TD" | "RF" | "EP";

const CAT_META: Record<CatCode, { label: string; accent: string; wash: string; route: string }> = {
  FM: { label: "Failure Modes",       accent: C.fmAccent, wash: C.fmWash, route: "failure-modes" },
  TD: { label: "Tech Decisions",      accent: C.tdAccent, wash: C.tdWash, route: "tech-decisions" },
  RF: { label: "Red Flags",           accent: C.rfAccent, wash: C.rfWash, route: "red-flags" },
  EP: { label: "Engineering Playbook",accent: C.epAccent, wash: C.epWash, route: "engineering-playbook" },
};

// ── helpers ───────────────────────────────────────────────────────
/** Wrap text at word boundaries to fit within maxWidth chars per line. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ── SVG template ──────────────────────────────────────────────────
function buildSvg(opts: {
  categoryCode: string;
  categoryLabel: string;
  accentColor: string;
  title: string;
  summary: string;
  isEssay?: boolean;
}): string {
  const { categoryCode, categoryLabel, accentColor, title, summary, isEssay } = opts;

  // Wrap title — large text, ~22 chars per line at font-size 68
  const titleLines = wrapText(escXml(title), 22);
  // Cap at 3 lines to stay within bounds
  const titleCapped = titleLines.slice(0, 3);
  const titleLineHeight = 82;
  const titleStartY = titleCapped.length === 1 ? 280 : titleCapped.length === 2 ? 240 : 200;

  const titleSvg = titleCapped
    .map((line, i) => `<text x="436" y="${titleStartY + i * titleLineHeight}"
      fill="${C.ink}"
      font-family="Georgia, Times, serif"
      font-weight="700" font-size="68" letter-spacing="-1">${line}</text>`)
    .join("\n");

  // Wrap summary — smaller text, ~52 chars per line
  const summaryLines = wrapText(escXml(summary ?? ""), 52).slice(0, 2);
  const summaryStartY = titleStartY + titleCapped.length * titleLineHeight + 36;
  const summarySvg = summaryLines
    .map((line, i) => `<text x="436" y="${summaryStartY + i * 32}"
      fill="${C.inkSoft}"
      font-family="Georgia, Times, serif"
      font-style="italic" font-size="22">${line}</text>`)
    .join("\n");

  // Accent rule Y — below summary block
  const ruleY = summaryStartY + summaryLines.length * 32 + 24;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Warm paper base -->
  <rect width="1200" height="630" fill="${C.paper}"/>

  <!-- Left black nameplate rail -->
  <rect x="0" y="0" width="380" height="630" fill="${C.black}"/>

  <!-- Yellow logo mark -->
  <rect x="56" y="56" width="36" height="36" fill="${C.yellow}"/>

  <!-- Wordmark -->
  <text x="56" y="184"
    fill="${C.yellow}"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-weight="900" font-size="54" letter-spacing="-1">THE HARD</text>
  <text x="56" y="242"
    fill="${C.yellow}"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-weight="900" font-size="54" letter-spacing="-1">PARTS</text>

  <!-- Subtitle -->
  <text x="56" y="284"
    fill="${C.paper}"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-weight="700" font-size="13" letter-spacing="3">ENGINEERING REFERENCE</text>

  <!-- Category code pill on rail -->
  <rect x="56" y="360" width="268" height="44" fill="${accentColor}"/>
  <text x="76" y="390"
    fill="${C.paper}"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-weight="900" font-size="16" letter-spacing="3">${escXml(isEssay ? "ESSAY" : categoryCode + " · " + categoryLabel.toUpperCase())}</text>

  <!-- Domain pinned to bottom of rail -->
  <text x="56" y="586"
    fill="${C.paper}" opacity="0.6"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-weight="500" font-size="13">thehardparts.dev</text>

  <!-- Right face: title -->
  ${titleSvg}

  <!-- Summary -->
  ${summarySvg}

  <!-- Yellow accent rule -->
  <rect x="436" y="${ruleY}" width="80" height="6" fill="${C.yellow}"/>
</svg>`;
}

// ── static paths ──────────────────────────────────────────────────
export const getStaticPaths: GetStaticPaths = () => {
  const paths: Array<{ params: { path: string }; props: Record<string, unknown> }> = [];

  // FM
  for (const e of loadFailureModes().entries) {
    paths.push({
      params: { path: `failure-modes/${e.slug}` },
      props: { categoryCode: "FM", title: e.title, summary: e.summary ?? "" },
    });
  }
  // TD
  for (const e of loadTechDecisions().entries) {
    paths.push({
      params: { path: `tech-decisions/${e.slug}` },
      props: { categoryCode: "TD", title: e.title, summary: e.summary ?? "" },
    });
  }
  // RF
  for (const e of loadRedFlags().entries) {
    paths.push({
      params: { path: `red-flags/${e.slug}` },
      props: { categoryCode: "RF", title: e.title, summary: e.summary ?? "" },
    });
  }
  // EP
  for (const e of loadPlaybooks().entries) {
    paths.push({
      params: { path: `engineering-playbook/${e.slug}` },
      props: { categoryCode: "EP", title: e.title, summary: e.summary ?? "" },
    });
  }
  // Essays
  for (const e of listFieldNotes()) {
    paths.push({
      params: { path: `essays/${e.slug}` },
      props: { categoryCode: "ESSAY", title: e.title, summary: e.summary ?? "" },
    });
  }

  return paths;
};

// ── route handler ─────────────────────────────────────────────────
export const GET: APIRoute = async ({ props }) => {
  const { categoryCode, title, summary } = props as {
    categoryCode: string;
    title: string;
    summary: string;
  };

  const isEssay = categoryCode === "ESSAY";
  const meta = isEssay ? null : CAT_META[categoryCode as CatCode];
  const accentColor = meta?.accent ?? C.yellow;
  const categoryLabel = meta?.label ?? "Essay";

  const svg = buildSvg({
    categoryCode,
    categoryLabel,
    accentColor,
    title,
    summary,
    isEssay,
  });

  const png = await sharp(Buffer.from(svg), { density: 144 })
    .resize(1200, 630, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
