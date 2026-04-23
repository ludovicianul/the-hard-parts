#!/usr/bin/env node
/**
 * scripts/normalize-xrefs.mjs
 *
 * One-off editorial maintenance script.
 *
 *   1. Walks every `content/**\/*.json` file.
 *   2. For each entry, normalizes the values inside known cross-
 *      reference arrays (`relatedFailureModes`, `oftenLeadsTo`, etc.)
 *      to kebab-case slugs. Free-text placeholders like
 *      "nobody can explain what done means" become
 *      "nobody-can-explain-what-done-means".
 *   3. Rewrites the JSON in place, preserving 2-space indent and a
 *      trailing newline (matches existing content style).
 *   4. Prints, at the end, every cross-ref slug that does NOT resolve
 *      to an existing entry in its target category — the full
 *      inventory of "pending editorial" work.
 *
 * Idempotent: running twice is a no-op the second time.
 *
 * Does NOT touch any field outside the known cross-ref list. Other
 * `string[]` fields (aiCanHelpWith, warningSigns.early, etc.) remain
 * free-text because they're editorial content, not references.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CONTENT_ROOT = "content";

// Every field in any schema whose values are supposed to resolve to
// slugs in another (or the same) category. Keep in lockstep with the
// category-schema docs under `docs/schema-*.md` and the types in
// `src/content/schemas/`.
const XREF_FIELDS = new Set([
  "relatedFailureModes",
  "relatedTechDecisions",
  "relatedPlaybooks",
  "relatedRedFlags",
  "oftenLeadsTo",
  "oftenCausedBy",
  "adjacentDecisions",
  "oftenLeadsToFailureModes",
]);

// Category-code inference from the file path, so we can report which
// category each pending ref ultimately belongs to.
const CAT_BY_FIELD = {
  relatedFailureModes: "FM",
  oftenLeadsTo: "FM",
  oftenCausedBy: "FM",
  oftenLeadsToFailureModes: "FM",
  relatedTechDecisions: "TD",
  adjacentDecisions: "TD",
  relatedRedFlags: "RF",
  relatedPlaybooks: "EP",
};

const CATEGORY_NAMES = {
  FM: "Failure Modes",
  TD: "Tech Decisions",
  RF: "Red Flags",
  EP: "Engineering Playbook",
};

/** Produce a kebab-case slug from any string. Idempotent. */
function kebab(s) {
  return String(s)
    .toLowerCase()
    // Strip apostrophes / quotes so "don't" → "dont", not "don-t"
    .replace(/['’"]/g, "")
    // Any run of non-alphanumerics becomes a single dash
    .replace(/[^a-z0-9]+/g, "-")
    // Collapse repeated dashes (paranoia; regex above should prevent)
    .replace(/-+/g, "-")
    // Trim
    .replace(/^-|-$/g, "");
}

/** Walk a directory recursively; yield .json file paths. */
function* walkJson(root) {
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walkJson(p);
    else if (p.endsWith(".json")) yield p;
  }
}

// -----------------------------------------------------------------
// Pass 1 — load everything, collect existing slug inventory per cat
// -----------------------------------------------------------------
const perCatSlugs = { FM: new Set(), TD: new Set(), RF: new Set(), EP: new Set() };

const docs = [];
for (const file of walkJson(CONTENT_ROOT)) {
  const text = readFileSync(file, "utf8");
  const data = JSON.parse(text);
  if (!Array.isArray(data.entries)) continue;
  const catCode = data.category?.code; // e.g. "FM"
  for (const e of data.entries) {
    if (e.slug && catCode && perCatSlugs[catCode]) {
      perCatSlugs[catCode].add(e.slug);
    }
  }
  docs.push({ file, data });
}

// -----------------------------------------------------------------
// Pass 2 — normalize xref values, record what changed, write back
// -----------------------------------------------------------------
const changes = []; // { file, entrySlug, field, before, after }

for (const { file, data } of docs) {
  if (!Array.isArray(data.entries)) continue;
  let dirty = false;
  for (const entry of data.entries) {
    for (const field of Object.keys(entry)) {
      if (!XREF_FIELDS.has(field)) continue;
      const arr = entry[field];
      if (!Array.isArray(arr)) continue;
      const next = arr.map((v) => {
        const s = typeof v === "string" ? v : String(v);
        const k = kebab(s);
        if (k !== s) {
          changes.push({ file, entrySlug: entry.slug, field, before: s, after: k });
          dirty = true;
        }
        return k;
      });
      entry[field] = next;
    }
  }
  if (dirty) {
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
}

console.log(`Normalized ${changes.length} cross-reference values across ${new Set(changes.map(c => c.file)).size} files.`);

// -----------------------------------------------------------------
// Pass 3 — resolve every xref against its target category and list
// the ones that DON'T exist yet. These are the pending refs.
// -----------------------------------------------------------------
// Reload post-normalization so pending list reflects the new shape.
const pendingByCat = { FM: new Map(), TD: new Map(), RF: new Map(), EP: new Map() };

for (const { file, data } of docs) {
  if (!Array.isArray(data.entries)) continue;
  for (const entry of data.entries) {
    for (const field of Object.keys(entry)) {
      if (!XREF_FIELDS.has(field)) continue;
      const arr = entry[field];
      if (!Array.isArray(arr)) continue;
      const targetCat = CAT_BY_FIELD[field];
      if (!targetCat) continue;
      const known = perCatSlugs[targetCat];
      for (const ref of arr) {
        if (known.has(ref)) continue;
        // Record which source entries reference this pending slug.
        const m = pendingByCat[targetCat];
        if (!m.has(ref)) m.set(ref, []);
        m.get(ref).push(`${entry.slug} · ${field}`);
      }
    }
  }
}

console.log("");
console.log("=== Pending cross-references (slugs not yet authored) ===");
console.log("");
let total = 0;
for (const cat of ["FM", "TD", "RF", "EP"]) {
  const map = pendingByCat[cat];
  if (map.size === 0) {
    console.log(`── ${cat} (${CATEGORY_NAMES[cat]}) · 0 pending`);
    continue;
  }
  console.log(`── ${cat} (${CATEGORY_NAMES[cat]}) · ${map.size} pending`);
  // Sort by how many inbound references each pending slug has (popular first)
  const rows = [...map.entries()]
    .map(([slug, refs]) => ({ slug, count: refs.length, refs }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
  for (const { slug, count, refs } of rows) {
    total++;
    console.log(`   ${String(count).padStart(3)} × ${slug}`);
    // First 3 inbound sources, then truncate
    for (const r of refs.slice(0, 3)) console.log(`       ↳ ${r}`);
    if (refs.length > 3) console.log(`       ↳ …and ${refs.length - 3} more`);
  }
  console.log("");
}
console.log(`── TOTAL pending unique slugs: ${total}`);
