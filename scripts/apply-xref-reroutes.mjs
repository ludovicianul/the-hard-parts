#!/usr/bin/env node
/**
 * scripts/apply-xref-reroutes.mjs
 *
 * One-off editorial maintenance script. Rewrites every cross-reference
 * in `content/**\/*.json` that matches a key in the `REROUTES` table
 * below to the corresponding canonical slug.
 *
 * Two kinds of entries live in the table:
 *
 *   · PENDING → AUTHORED — a pending slug plausibly referred to an
 *     already-authored entry with different naming. The referencing
 *     entries now point at the real slug.
 *
 *   · PENDING → PENDING — two (or three) pending slugs described the
 *     same concept. All inbound references are consolidated onto one
 *     canonical pending slug so only one future entry needs authoring.
 *
 * Source for the rewrite list: `scripts/find-xref-duplicates.mjs` +
 * explicit editorial approval. See that script's markdown report for
 * the match evidence behind each pair.
 *
 * Idempotent: running twice is a no-op the second time. Deduplicates
 * per-array so a rewrite that collides with an existing value in the
 * same array collapses instead of producing a duplicate.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
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

/**
 * slug → canonical slug. Every source key was matched against its
 * canonical target by `find-xref-duplicates.mjs`; user-approved list.
 */
const REROUTES = {
  // --- EP · pending → authored -------------------------------------
  "upgrade-review-for-ai-assisted-work": "upgrade-code-review-for-ai-assisted-work",
  "design-safe-rollout":                 "design-a-safe-rollout-path",
  "define-ai-safe-zones-and-red-zones":  "define-safe-ai-development-zones",
  "review-module-boundaries":            "review-service-boundaries",
  "evaluate-service-boundaries":         "review-service-boundaries",

  // --- RF · pending → authored -------------------------------------
  "critical-knowledge-exists-only-in-chats-and-memory":
    "critical-knowledge-lives-in-chat-and-memory",
  "nobody-can-explain-what-done-means":
    "teams-cannot-explain-what-done-means",

  // --- TD · pending → authored (user-approved) --------------------
  "managed-model-vs-self-hosted":          "model-api-vs-self-hosted-model",
  "self-hosted-vs-managed-infrastructure": "model-api-vs-self-hosted-model",
  "event-driven-vs-request-response":      "sync-vs-event-driven",

  // --- RF · pending → pending (consolidation) ---------------------
  //  "-vs-" wins over "-versus-" to match the site convention.
  "nobody-can-say-what-is-fixed-versus-flexible":
    "nobody-can-say-what-is-fixed-vs-flexible",

  // --- EP · pending → pending (consolidation) ---------------------
  //  "build-a-task-grounded-evaluation-harness" wins: it has the most
  //  inbound references (2×) and matches the site's `*-a-*` editorial
  //  voice (build-a-grounded-rag-system, run-a-phased-migration, etc.).
  "build-task-grounded-evaluation-harness": "build-a-task-grounded-evaluation-harness",
  "build-grounded-evaluation-harness":      "build-a-task-grounded-evaluation-harness",

  //  "validate-internal-platform-demand" wins: "internal" is a
  //  meaningful distinction (platform built for our own engineers),
  //  and the shorter form would lose the qualifier.
  "validate-platform-demand": "validate-internal-platform-demand",
};

function* walkJson(root) {
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walkJson(p);
    else if (p.endsWith(".json")) yield p;
  }
}

// -----------------------------------------------------------------
// Rewrite pass
// -----------------------------------------------------------------
const changes = [];       // { file, entrySlug, field, before, after }
const dedupedIn = new Set(); // entrySlug·field where a dedup happened

for (const file of walkJson(CONTENT_ROOT)) {
  const text = readFileSync(file, "utf8");
  const data = JSON.parse(text);
  if (!Array.isArray(data.entries)) continue;
  let dirty = false;

  for (const entry of data.entries) {
    for (const field of Object.keys(entry)) {
      if (!XREF_FIELDS.has(field)) continue;
      const arr = entry[field];
      if (!Array.isArray(arr)) continue;

      const sizeBefore = arr.length;
      const seen = new Set();
      const next = [];
      for (const v of arr) {
        const mapped = Object.prototype.hasOwnProperty.call(REROUTES, v)
          ? REROUTES[v]
          : v;
        if (mapped !== v) {
          changes.push({ file, entrySlug: entry.slug, field, before: v, after: mapped });
          dirty = true;
        }
        if (seen.has(mapped)) {
          dedupedIn.add(`${entry.slug}·${field}`);
          continue;
        }
        seen.add(mapped);
        next.push(mapped);
      }
      if (next.length !== sizeBefore) dirty = true;
      entry[field] = next;
    }
  }

  if (dirty) writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// -----------------------------------------------------------------
// Report
// -----------------------------------------------------------------
console.log(`Applied ${changes.length} rewrites across ${new Set(changes.map(c => c.file)).size} file(s).`);
if (dedupedIn.size > 0) {
  console.log(`Collapsed duplicate refs after rewrite in ${dedupedIn.size} array(s):`);
  for (const k of [...dedupedIn].sort()) console.log("  · " + k);
}
console.log("");

// Group changes by (before → after) for a clean summary
const byPair = new Map();
for (const c of changes) {
  const key = `${c.before} → ${c.after}`;
  if (!byPair.has(key)) byPair.set(key, 0);
  byPair.set(key, byPair.get(key) + 1);
}
console.log("Rewrite breakdown:");
for (const [pair, count] of [...byPair.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(3)} × ${pair}`);
}
