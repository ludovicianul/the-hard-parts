#!/usr/bin/env node
/**
 * Standalone content validator.
 * Runs the same checks as the build does, but as a script, so you can run
 * `npm run validate` without triggering a full Astro build.
 *
 * Exit codes:
 *   0 — no error-severity issues (warnings allowed)
 *   1 — at least one error-severity issue
 */
import { runValidation, summarizeIssues } from "../src/lib/validate";

const issues = runValidation();
const errors = issues.filter((i) => i.severity === "error");
const warns = issues.filter((i) => i.severity === "warn");

for (const i of errors) {
  console.error(`ERROR [${i.kind}] ${i.message}`);
}
for (const i of warns) {
  console.warn(`warn  [${i.kind}] ${i.message}`);
}

console.log("");
console.log(summarizeIssues(issues));

if (errors.length > 0) {
  process.exit(1);
}
