#!/usr/bin/env node
/**
 * scripts/add-edition-field.mjs
 *
 * One-shot maintenance script: stamp every entry inside the `entries`
 * array of every content JSON file under `content/` with an `edition`
 * field set to "edition-01".
 *
 * Why per-entry (not top-level):
 *   Each entry carries its own editorial provenance. Tagging the
 *   entry with the edition makes it possible to track which issue
 *   originally introduced an entry, surface "new in this edition"
 *   filters, or freeze entries to a historic edition during reflows
 *   — without coupling that metadata to the catalog wrapper.
 *
 * Earlier-run cleanup:
 *   A previous version of this script wrote `edition` at the TOP of
 *   each catalog file. That was the wrong placement; this run
 *   removes it from the wrapper if present, regardless of value.
 *
 * Idempotent:
 *   Running this twice does not duplicate or corrupt anything. An
 *   entry that already has `edition === "edition-01"` is left
 *   untouched. An entry with a different `edition` is updated and
 *   reported. The top-level `edition` is removed if present and not
 *   re-added.
 *
 * Formatting:
 *   Files are re-written with 2-space JSON indentation (matches the
 *   existing house style across all eight content files) and the
 *   trailing-newline state of the original is preserved. Files that
 *   require no semantic change are NOT rewritten — git diff stays
 *   clean across reruns.
 *
 * Per-entry key ordering:
 *   `edition` is inserted as the FIRST key of each entry so a
 *   reader skimming `entries[]` sees the issue tag before the slug.
 *   The remaining key order is preserved exactly.
 *
 * Schema safety:
 *   All four entry schemas in `src/content/schemas/` use `.passthrough()`,
 *   so this new key passes validation without any schema change.
 *
 * Usage:
 *   node scripts/add-edition-field.mjs
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const EDITION_VALUE = "edition-01";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const contentRoot = resolve(repoRoot, "content");

/**
 * Re-key an object so a given field appears first, preserving the
 * order of the remaining keys exactly.
 */
function withFieldFirst(obj, key, value) {
  const rest = { ...obj };
  delete rest[key];
  return { [key]: value, ...rest };
}

/**
 * Detect whether a UTF-8 source file ends in a single newline. We
 * preserve this so the rewrite produces a clean git diff (no spurious
 * "no newline at end of file" markers, no extra blank lines).
 */
function endsWithNewline(text) {
  return text.length > 0 && text[text.length - 1] === "\n";
}

/**
 * Walk a directory recursively and collect all .json file paths.
 * (Avoids depending on `fs.glob`, which is Node 22+ only.)
 */
async function collectJson(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) await collectJson(p, out);
    else if (e.isFile() && p.endsWith(".json")) out.push(p);
  }
  return out;
}

async function processFile(absPath) {
  const rel = relative(repoRoot, absPath);
  const original = await readFile(absPath, "utf8");
  const trailingNewline = endsWithNewline(original);

  let parsed;
  try {
    parsed = JSON.parse(original);
  } catch (err) {
    return { rel, status: "error", message: `parse failed: ${err.message}` };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { rel, status: "error", message: "not a JSON object at the root" };
  }

  let next = parsed;
  let touched = false;
  let topLevelRemoved = false;
  let entriesAdded = 0;
  let entriesUpdated = 0;
  let entriesUnchanged = 0;

  // 1) Remove the misplaced top-level `edition` left over from the
  //    earlier version of this script (or any prior tagging attempt).
  if (Object.prototype.hasOwnProperty.call(next, "edition")) {
    const { edition: _drop, ...rest } = next;
    next = rest;
    topLevelRemoved = true;
    touched = true;
  }

  // 2) Stamp each entry. Skip files that don't have an `entries` array.
  if (!Array.isArray(next.entries)) {
    if (touched) {
      // Only the top-level cleanup happened; still rewrite.
      let serialised = JSON.stringify(next, null, 2);
      if (trailingNewline) serialised += "\n";
      await writeFile(absPath, serialised, "utf8");
      return {
        rel,
        status: "cleaned",
        message: "removed stray top-level edition (no entries array to stamp)",
      };
    }
    return { rel, status: "skipped", message: "no entries array" };
  }

  const stampedEntries = next.entries.map((entry) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      // Unexpected shape — leave as-is.
      entriesUnchanged++;
      return entry;
    }
    const existing = entry.edition;
    if (existing === EDITION_VALUE) {
      // Edition already correct AND already first — count as unchanged.
      // (If it's correct but not first, we'll still re-key to first
      // position for visual consistency, which counts as updated.)
      const firstKey = Object.keys(entry)[0];
      if (firstKey === "edition") {
        entriesUnchanged++;
        return entry;
      }
      entriesUpdated++;
      touched = true;
      return withFieldFirst(entry, "edition", EDITION_VALUE);
    }
    if (existing === undefined) {
      entriesAdded++;
      touched = true;
      return withFieldFirst(entry, "edition", EDITION_VALUE);
    }
    entriesUpdated++;
    touched = true;
    return withFieldFirst(entry, "edition", EDITION_VALUE);
  });

  next = { ...next, entries: stampedEntries };

  if (!touched) {
    return {
      rel,
      status: "skipped",
      message: `all ${stampedEntries.length} entries already "${EDITION_VALUE}"`,
    };
  }

  let serialised = JSON.stringify(next, null, 2);
  if (trailingNewline) serialised += "\n";
  await writeFile(absPath, serialised, "utf8");

  const parts = [];
  if (topLevelRemoved) parts.push("removed top-level edition");
  if (entriesAdded > 0) parts.push(`added on ${entriesAdded} entries`);
  if (entriesUpdated > 0) parts.push(`updated on ${entriesUpdated} entries`);
  if (entriesUnchanged > 0) parts.push(`${entriesUnchanged} already current`);

  return {
    rel,
    status: entriesAdded > 0 ? "added" : entriesUpdated > 0 ? "updated" : "cleaned",
    message: parts.join(" · "),
  };
}

async function main() {
  const targets = await collectJson(contentRoot);
  if (targets.length === 0) {
    console.error(`No JSON files found under ${contentRoot}`);
    process.exit(1);
  }
  targets.sort();

  const counts = { added: 0, updated: 0, cleaned: 0, skipped: 0, errored: 0 };

  for (const t of targets) {
    const r = await processFile(t);
    const tag =
      r.status === "added"   ? "  ADD" :
      r.status === "updated" ? "  MOD" :
      r.status === "cleaned" ? "  CLN" :
      r.status === "skipped" ? "   ok" :
                               "  ERR";
    console.log(`${tag}  ${r.rel}  —  ${r.message}`);
    counts[r.status === "error" ? "errored" : r.status]++;
  }

  console.log("");
  console.log(
    `done · ${targets.length} file(s) · ` +
    `${counts.added} added · ` +
    `${counts.updated} updated · ` +
    `${counts.cleaned} cleaned · ` +
    `${counts.skipped} unchanged · ` +
    `${counts.errored} error(s)`,
  );

  if (counts.errored > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
