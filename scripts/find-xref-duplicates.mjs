#!/usr/bin/env node
/**
 * scripts/find-xref-duplicates.mjs
 *
 * Editorial review helper. Answers two questions about the pending
 * cross-reference inventory produced by `normalize-xrefs.mjs`:
 *
 *   1. Does any PENDING slug plausibly refer to an ALREADY-AUTHORED
 *      entry, just with different naming? (→ re-route: edit the
 *      referencing entries to point at the real slug, drop the
 *      pending)
 *
 *   2. Do any PENDING slugs plausibly refer to the SAME concept as
 *      each other, just with different naming? (→ consolidate: pick
 *      one canonical slug, point everything at it)
 *
 * Read-only. Does NOT modify content. Prints a markdown report to
 * stdout; redirect into `docs/pending-xrefs-review.md` if you want
 * to file it.
 *
 * Similarity uses two lightweight signals on dash-split token sets:
 *
 *   · Jaccard ≥ 0.5   — slugs share most of their word stems
 *   · Containment     — smaller slug's tokens are a full subset of
 *                        the larger slug's tokens (e.g.
 *                        "weak-governance" ⊂ "weak-governance-structures")
 *
 * Only pairs with ≥2 shared tokens qualify, so "rag-vs-fine-tuning"
 * and "rag-architecture-choices" both sharing just "rag" don't match.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CONTENT_ROOT = "content";

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

function* walkJson(root) {
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walkJson(p);
    else if (p.endsWith(".json")) yield p;
  }
}

function tokens(slug) {
  return new Set(slug.split("-").filter((t) => t.length > 0));
}

function jaccard(a, b) {
  const inter = [...a].filter((t) => b.has(t)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function contains(a, b) {
  // is `a` a full subset of `b`?
  for (const t of a) if (!b.has(t)) return false;
  return true;
}

// -----------------------------------------------------------------
// Load content
// -----------------------------------------------------------------
const authored = { FM: new Set(), TD: new Set(), RF: new Set(), EP: new Set() };
const pending  = { FM: new Set(), TD: new Set(), RF: new Set(), EP: new Set() };
// For pending refs, remember where each was seen (for citation)
const pendingSources = { FM: new Map(), TD: new Map(), RF: new Map(), EP: new Map() };

for (const file of walkJson(CONTENT_ROOT)) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(data.entries)) continue;
  const catCode = data.category?.code;
  for (const e of data.entries) {
    if (e.slug && catCode && authored[catCode]) authored[catCode].add(e.slug);
  }
}

for (const file of walkJson(CONTENT_ROOT)) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(data.entries)) continue;
  for (const entry of data.entries) {
    for (const field of Object.keys(entry)) {
      if (!XREF_FIELDS.has(field)) continue;
      const arr = entry[field];
      if (!Array.isArray(arr)) continue;
      const target = CAT_BY_FIELD[field];
      if (!target) continue;
      for (const ref of arr) {
        if (authored[target].has(ref)) continue;
        pending[target].add(ref);
        const m = pendingSources[target];
        if (!m.has(ref)) m.set(ref, []);
        m.get(ref).push(`${entry.slug} · ${field}`);
      }
    }
  }
}

// -----------------------------------------------------------------
// (1) Pending → Authored near-matches (possible re-routes)
// -----------------------------------------------------------------
console.log("# Cross-reference review");
console.log("");
console.log("> Read-only report from `scripts/find-xref-duplicates.mjs`. Two");
console.log("> questions answered: which pending slugs plausibly re-route to");
console.log("> an existing entry, and which pending slugs look like dupes of");
console.log("> each other. Jaccard ≥ 0.5 or token-set containment on");
console.log("> dash-split tokens, ≥2 shared tokens.");
console.log("");

console.log("## 1 · Pending → Authored  (plausible re-routes)");
console.log("");
console.log("A pending slug whose tokens overlap heavily with an already-");
console.log("authored entry. Consider editing the referencing entries to");
console.log("point at the authored slug instead of keeping the pending.");
console.log("");

let reroutes = 0;
for (const cat of ["FM", "TD", "RF", "EP"]) {
  const A = [...authored[cat]];
  const P = [...pending[cat]].sort();
  const hits = [];
  for (const p of P) {
    const pt = tokens(p);
    for (const a of A) {
      const at = tokens(a);
      const inter = [...pt].filter((t) => at.has(t)).length;
      if (inter < 2) continue;
      const j = jaccard(pt, at);
      const cont = contains(pt, at) || contains(at, pt);
      if (j >= 0.5 || cont) {
        hits.push({ pending: p, authored: a, jaccard: j, contained: cont });
      }
    }
  }
  if (hits.length === 0) continue;
  console.log(`### ${cat} · ${CATEGORY_NAMES[cat]}  (${hits.length})`);
  console.log("");
  // Sort: containment-hits first (strongest signal), then by jaccard desc
  hits.sort((a, b) => (b.contained ? 1 : 0) - (a.contained ? 1 : 0) || b.jaccard - a.jaccard);
  for (const h of hits) {
    const srcs = pendingSources[cat].get(h.pending) ?? [];
    console.log(
      `- pending **\`${h.pending}\`** ↔ authored **\`${h.authored}\`**  ` +
        `· jaccard ${h.jaccard.toFixed(2)}${h.contained ? " · **subset**" : ""}` +
        `  · referenced ${srcs.length}×`,
    );
    for (const s of srcs.slice(0, 3)) console.log(`  - from \`${s}\``);
    if (srcs.length > 3) console.log(`  - …and ${srcs.length - 3} more`);
    reroutes++;
  }
  console.log("");
}
if (reroutes === 0) {
  console.log("_No plausible re-routes found._");
  console.log("");
}

// -----------------------------------------------------------------
// (2) Pending ↔ Pending near-matches (possible dupes)
// -----------------------------------------------------------------
console.log("## 2 · Pending ↔ Pending  (plausible dupes)");
console.log("");
console.log("Pairs of pending slugs that plausibly describe the same concept.");
console.log("Consider picking one canonical slug and rewriting the other's");
console.log("inbound references to use it.");
console.log("");

let dupes = 0;
for (const cat of ["FM", "TD", "RF", "EP"]) {
  const P = [...pending[cat]].sort();
  const hits = [];
  for (let i = 0; i < P.length; i++) {
    const p1 = P[i];
    const t1 = tokens(p1);
    for (let j = i + 1; j < P.length; j++) {
      const p2 = P[j];
      const t2 = tokens(p2);
      const inter = [...t1].filter((t) => t2.has(t)).length;
      if (inter < 2) continue;
      const jc = jaccard(t1, t2);
      const cont = contains(t1, t2) || contains(t2, t1);
      if (jc >= 0.5 || cont) {
        hits.push({ a: p1, b: p2, jaccard: jc, contained: cont });
      }
    }
  }
  if (hits.length === 0) continue;
  console.log(`### ${cat} · ${CATEGORY_NAMES[cat]}  (${hits.length})`);
  console.log("");
  hits.sort((x, y) => (y.contained ? 1 : 0) - (x.contained ? 1 : 0) || y.jaccard - x.jaccard);
  for (const h of hits) {
    const ca = (pendingSources[cat].get(h.a) ?? []).length;
    const cb = (pendingSources[cat].get(h.b) ?? []).length;
    console.log(
      `- **\`${h.a}\`** (${ca}×) ↔ **\`${h.b}\`** (${cb}×) ` +
        `· jaccard ${h.jaccard.toFixed(2)}${h.contained ? " · **subset**" : ""}`,
    );
    dupes++;
  }
  console.log("");
}
if (dupes === 0) {
  console.log("_No plausible pending dupes found._");
  console.log("");
}

console.log("---");
console.log("");
console.log(`**Summary:** ${reroutes} possible re-routes, ${dupes} possible pending dupes.`);
