# Cross-reference review

> Read-only report from `scripts/find-xref-duplicates.mjs`. Two
> questions answered: which pending slugs plausibly re-route to
> an existing entry, and which pending slugs look like dupes of
> each other. Jaccard ≥ 0.5 or token-set containment on
> dash-split tokens, ≥2 shared tokens.

## 1 · Pending → Authored  (plausible re-routes)

A pending slug whose tokens overlap heavily with an already-
authored entry. Consider editing the referencing entries to
point at the authored slug instead of keeping the pending.

### TD · Tech Decisions  (1)

- pending **`fine-tuning-vs-prompting`** ↔ authored **`rag-vs-fine-tuning`**  · jaccard 0.60  · referenced 2×
  - from `benchmark-mirage · relatedTechDecisions`
  - from `rag-without-ground-truth · relatedTechDecisions`

### RF · Red Flags  (1)

- pending **`sources-are-cited-but-not-trusted`** ↔ authored **`metrics-are-visible-but-not-trusted`**  · jaccard 0.50  · referenced 1×
  - from `rag-vs-fine-tuning · relatedRedFlags`

## 2 · Pending ↔ Pending  (plausible dupes)

Pairs of pending slugs that plausibly describe the same concept.
Consider picking one canonical slug and rewriting the other's
inbound references to use it.

### FM · Failure Modes  (1)

- **`weak-evaluation-discipline`** (1×) ↔ **`weak-operational-discipline`** (1×) · jaccard 0.50

### EP · Engineering Playbook  (2)

- **`version-prompts-and-evaluations`** (2×) ↔ **`version-prompts-and-workflows`** (1×) · jaccard 0.60
- **`make-contracts-explicit`** (1×) ↔ **`make-interruptions-explicit`** (1×) · jaccard 0.50

---

**Summary:** 2 possible re-routes, 3 possible pending dupes.
