# Schema — Tech Decisions

## Purpose

This document defines the category-specific content schema for **Tech Decisions**.

It should be read together with:

* `docs/content-schema.md`
* `docs/product-brief.md`

This file explains:

* what a Tech Decision entry is
* what fields it should contain
* what each field means
* which fields are required vs optional
* how the content should render in the UI

The goal of this schema is to keep Tech Decisions:

* structured
* comparable
* honest
* context-sensitive
* easy to browse and evaluate

---

## What a Tech Decision Entry Is

A Tech Decision entry is a structured trade-off reference.

It is **not**:

* a recommendation article
* a best-practice post
* a binary winner/loser comparison
* a long essay about one technology

A Tech Decision entry should help the user understand:

* what decision is actually being asked
* what the decision is really about underneath the surface framing
* what two concrete poles represent the trade-off
* when each option fits naturally
* what hidden costs and bad reasoning patterns show up
* how the decision connects to failure modes, red flags, and playbooks

The reader should come away with better judgment, not just a preferred answer.

---

## Top-Level JSON Convention

Tech Decisions follow the site-wide top-level structure from `docs/content-schema.md`.

Expected top-level shape:

```json
{
  "category": {
    "code": "TD",
    "name": "Tech Decisions",
    "summary": "Structured trade-off references for common engineering decisions.",
    "categories": []
  },
  "template": {
    "fields": []
  },
  "entries": []
}
```

### Category code

Must be:

```json
"code": "TD"
```

### Naming

The top-level block uses **`category.categories`** — not `families`.
The entry-level field is **`category`** — not `family`.
This matches the naming used by the other site categories.

---

## Category / Subcategory Values

Canonical Tech Decisions subcategories:

* `architecture`
* `product-delivery`
* `team-operations`
* `quality-delivery`
* `ai-systems`

These are listed in:

```json
"category": {
  "categories": [
    "architecture",
    "product-delivery",
    "team-operations",
    "quality-delivery",
    "ai-systems"
  ]
}
```

Each entry’s `category` value must match one of these.

These are intentionally different from the Failure Modes subcategories. Tech Decisions group by *the axis of the decision* (architecture shape, delivery model, team model, quality posture, AI systems posture), not by the kind of pain. If the category list expands later, expand it intentionally.

---

## Entry Schema Overview

Each Tech Decision entry uses this structure:

```json
{
  "slug": "",
  "title": "",
  "decisionQuestion": "",
  "category": "",
  "summary": "",

  "decisionHeuristic": "",
  "whatThisIsReallyAbout": "",
  "notActuallyAbout": "",
  "whyItFeelsHard": "",

  "optionA": {
    "name": "",
    "bestWhen": [],
    "strengths": [],
    "costs": [],
    "hiddenCosts": [],
    "failureModesWhenMisused": [],
    "realWorldFits": []
  },
  "optionB": {
    "name": "",
    "bestWhen": [],
    "strengths": [],
    "costs": [],
    "hiddenCosts": [],
    "failureModesWhenMisused": [],
    "realWorldFits": []
  },

  "keyFactors": [],
  "questionsToAsk": [],
  "evidenceNeeded": [],
  "defaultBias": "",
  "reversibility": "",
  "whenToRevisit": [],

  "commonBadReasons": [],
  "antiPatterns": [],
  "goodSignalsForA": [],
  "goodSignalsForB": [],

  "costBearer": {
    "optionA": [],
    "optionB": []
  },
  "timeHorizonNotes": {
    "optionA": "",
    "optionB": ""
  },

  "aiCanHelpWith": [],
  "aiCanMakeWorseBy": [],
  "aiSpecificNotes": "",

  "oftenLeadsToFailureModes": [],
  "adjacentDecisions": [],
  "relatedRedFlags": [],
  "relatedPlaybooks": [],

  "frequency": "",
  "severityIfWrong": "",
  "audiences": [],

  "patternConfidence": "high"
}
```

This is the canonical schema for the live site.

---

## Required Fields

These fields are required for every Tech Decision entry:

* `slug`
* `title`
* `decisionQuestion`
* `category`
* `summary`
* `optionA`
* `optionB`
* `questionsToAsk`
* `patternConfidence`

### Why these are required

Because without them the entry cannot reliably answer:

* what decision is actually being asked
* what the two poles are
* how a reader should evaluate the choice

---

## Optional but Strongly Recommended Fields

These fields are technically optional but should usually exist in strong entries:

* `decisionHeuristic`
* `whatThisIsReallyAbout`
* `notActuallyAbout`
* `whyItFeelsHard`
* `keyFactors`
* `evidenceNeeded`
* `defaultBias`
* `reversibility`
* `whenToRevisit`
* `commonBadReasons`
* `antiPatterns`
* `goodSignalsForA`
* `goodSignalsForB`
* `costBearer`
* `timeHorizonNotes`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiSpecificNotes`
* `oftenLeadsToFailureModes`
* `adjacentDecisions`
* `relatedRedFlags`
* `relatedPlaybooks`
* `frequency`
* `severityIfWrong`
* `audiences`

A weak entry may omit some of these.
A high-quality entry includes most of them.

---

## Field-by-Field Definitions

### `slug`

Canonical route identifier.

Example:

```json
"slug": "build-vs-buy"
```

Must follow global slug rules.

---

### `title`

Human-readable display title. Usually matches the trade-off pair.

Example:

```json
"title": "Build vs Buy"
```

---

### `decisionQuestion`

A plain-language statement of the actual choice being made, framed as a question.

This keeps the entry grounded in the real decision instead of the label.

Example:

```json
"decisionQuestion": "Should we build this capability ourselves or adopt an existing product/service?"
```

---

### `category`

Tech Decisions subcategory.

Must match one of the canonical subcategories (see above).

Example:

```json
"category": "architecture"
```

---

### `summary`

A concise one- to two-sentence editorial summary.

This should quickly tell the reader:

* what the decision really is
* what tends to be misunderstood about it

Example:

```json
"summary": "Usually a team-shape and operational-maturity decision disguised as an architecture ideology debate."
```

---

### `decisionHeuristic`

A single short directional heuristic that summarises how to think about the decision. One sentence. Not a rule.

Example:

```json
"decisionHeuristic": "Prefer the option that keeps common changes local, unless independent scaling needs are real and sustained."
```

This is **singular** on purpose (`decisionHeuristic`, not `decisionHeuristics`): the entry picks one high-leverage heuristic and lets the body carry the nuance.

---

### `whatThisIsReallyAbout`

A short reframing that states the real underlying question, especially when the surface framing is misleading.

Example:

```json
"whatThisIsReallyAbout": "Who should own the capability long term, and whether it is strategically differentiating."
```

---

### `notActuallyAbout`

A short statement of what the decision is *not* really about, even though it often gets framed that way.

Example:

```json
"notActuallyAbout": "Engineering pride, resume-driven development, or ideology about internal capability."
```

Used together, `whatThisIsReallyAbout` and `notActuallyAbout` keep the decision honest.

---

### `whyItFeelsHard`

A short statement explaining the emotional, organizational, or technical logic that makes the decision genuinely hard — not just "it depends".

Example:

```json
"whyItFeelsHard": "Both options have real strengths and real long-term costs that only show up on a different timescale."
```

---

## Option Objects (`optionA`, `optionB`)

Each entry defines two structured option objects.

These are **not** good vs bad. They are two poles of a trade-off.

### Canonical shape

```json
{
  "name": "",
  "bestWhen": [],
  "strengths": [],
  "costs": [],
  "hiddenCosts": [],
  "failureModesWhenMisused": [],
  "realWorldFits": []
}
```

The schema is **strict** — no additional keys. This keeps the UI parallel and comparison meaningful.

### Field meanings

#### `name`

Display name of the option.

Example:

```json
"name": "Build"
```

#### `bestWhen`

List of conditions where this option is a natural fit.

Answers: when does this option make sense without forcing it?

#### `strengths`

What this option does well.

#### `costs`

Real costs, not weak caveats. Includes organizational, delivery, operational, skill, and long-term maintenance costs.

#### `hiddenCosts`

Second-order costs that are easy to miss at decision time but become visible later.

Example:

```json
"hiddenCosts": [
  "long-term ownership burden of undifferentiated capability",
  "gravity toward internal platform expansion"
]
```

#### `failureModesWhenMisused`

Plural array. What this option tends to look like when misapplied.

Each item may be:

* a Failure Mode slug (preferred where a named mode exists), or
* a short descriptive phrase (where no named mode fits)

Example:

```json
"failureModesWhenMisused": [
  "platform-before-product",
  "building undifferentiated plumbing for years"
]
```

This is plural on purpose — one option can have multiple characteristic failure shapes.

#### `realWorldFits`

Concrete environments or conditions where this option naturally fits.

This field is strongly recommended. It prevents abstract comparison.

Example:

```json
"realWorldFits": [
  "core product capability with durable strategic value",
  "domain where internal control is genuinely differentiating"
]
```

---

## Decision Support Fields

### `keyFactors`

The small number of factors that actually drive the decision once emotion is stripped out.

Example:

```json
"keyFactors": [
  "is the capability strategically differentiating?",
  "can we sustain long-term ownership?",
  "how stable is the external market for this capability?"
]
```

### `questionsToAsk`

A list of questions the reader should ask before choosing. **Required.**

This turns the entry into a usable decision tool.

Example:

```json
"questionsToAsk": [
  "What problem are we actually solving?",
  "Which option keeps common changes easier in our current team shape?",
  "What operational burden can we really sustain?",
  "What happens if our assumptions are wrong in 12 months?"
]
```

### `evidenceNeeded`

What evidence a team should gather before committing. Prevents intuition-only decisions.

Example:

```json
"evidenceNeeded": [
  "realistic 12-month load profile",
  "honest assessment of ops headcount and on-call capacity",
  "maturity of external vendors in this space"
]
```

### `defaultBias`

One short sentence naming the direction a team should lean in absence of strong signal.

Example:

```json
"defaultBias": "Prefer Buy until the capability is clearly differentiating and sustainable to own."
```

### `reversibility`

A short, honest statement about how reversible the decision is.

Example:

```json
"reversibility": "Reversible but expensive after 12+ months of accumulated integration."
```

### `whenToRevisit`

An **array** of triggers that should cause the team to re-open the decision.

Example:

```json
"whenToRevisit": [
  "vendor changes pricing or licensing model materially",
  "the capability becomes a differentiation lever",
  "integration cost crosses a threshold that justifies owning"
]
```

Always an array — not a string, not a prose paragraph.

---

## Diagnostic Signal Fields

### `commonBadReasons`

Bad reasoning patterns teams fall into when making this specific decision.

Example:

```json
"commonBadReasons": [
  "choosing for prestige",
  "treating scale assumptions as already real",
  "reacting to one frustrating incident rather than structural pattern"
]
```

### `antiPatterns`

Shapes the decision tends to take when it goes wrong.

Example:

```json
"antiPatterns": [
  "half-built internal platform that neither owns nor integrates well",
  "vendor contract driving the roadmap"
]
```

### `goodSignalsForA` / `goodSignalsForB`

Signals that point toward one option rather than the other. These make the decision more legible instead of more ideological.

Example:

```json
"goodSignalsForA": [
  "long-lived strategic capability",
  "team has durable ops capacity"
],
"goodSignalsForB": [
  "commodity capability",
  "team is small and focus matters more than control"
]
```

---

## Structured Comparison Objects

These are two first-class **structured A/B comparison carriers**. They are not free-form strings and not generic arrays.

### `costBearer`

Who bears the cost of each option. Used for operational and organizational cost attribution.

Shape:

```json
"costBearer": {
  "optionA": ["team A bears X"],
  "optionB": ["team B bears Y"]
}
```

* `optionA` — array of roles/teams/functions that absorb the cost when Option A is chosen
* `optionB` — array of roles/teams/functions that absorb the cost when Option B is chosen

Both arrays are required when `costBearer` is present. No extra keys allowed.

### `timeHorizonNotes`

Where each option wins or loses over time.

Shape:

```json
"timeHorizonNotes": {
  "optionA": "Usually wins early through speed and lower overhead.",
  "optionB": "Wins later only if boundaries, teams, and platform maturity are genuinely ready."
}
```

* `optionA` — non-empty string
* `optionB` — non-empty string

Both strings are required when `timeHorizonNotes` is present. No extra keys allowed.

These two fields keep comparison structured and parallel. They are not to be loosened into generic strings.

---

## AI Fields

Tech Decisions often include AI impact because AI changes:

* implementation speed
* evaluation cost
* build-vs-buy dynamics
* review burden
* abstraction temptation
* architecture confidence

AI fields use the **site-wide canonical names** shared with Failure Modes, Red Flags, and Engineering Playbook:

### `aiCanHelpWith`

Array of ways AI can improve the decision process or the implementation of either option.

### `aiCanMakeWorseBy`

Array of ways AI can distort the decision or make the wrong option feel easier.

### `aiSpecificNotes`

A short synthesis string explaining how AI changes this decision surface in a meaningful way.

Do not include generic AI commentary. Include it only where AI materially changes the decision.

The earlier content-era names `aiReduces`, `aiAmplifies`, `aiSpecificWarning` are retired. New entries must use the canonical names above.

---

## Cross-Reference Fields

Tech Decisions carry causal and lateral references using **directional, intent-named** fields where the relationship is non-neutral:

### `oftenLeadsToFailureModes`

Array of Failure Mode slugs that this decision, when misframed or misapplied, commonly leads to.

Example:

```json
"oftenLeadsToFailureModes": ["friendly-rewrite", "dependency-fog"]
```

### `adjacentDecisions`

Array of slugs of other Tech Decisions that are conceptually adjacent and often confused, entangled, or co-decided. This is the Tech-Decision-to-Tech-Decision lateral link. There is no separate `relatedTechDecisions` field.

Example:

```json
"adjacentDecisions": ["modular-monolith-vs-distributed-services", "shared-database-vs-service-owned-data"]
```

### `relatedRedFlags`

Array of Red Flag slugs that commonly appear around this decision.

### `relatedPlaybooks`

Array of Engineering Playbook slugs that help execute or recover from this decision.

Cross-links should be meaningful, not inflated.

---

## Meta Fields

### `frequency`

Optional short label for how frequently this decision shows up in real organizations.

### `severityIfWrong`

Optional short label for how damaging a wrong choice tends to be.

### `audiences`

Optional array of roles for whom this entry is most directly useful.

Example:

```json
"audiences": ["architects", "staff engineers", "engineering managers", "platform teams"]
```

---

## `patternConfidence`

Allowed values:

* `low`
* `medium`
* `medium-high`
* `high`

Meaning: editorial confidence that the structure of this decision is durable and useful across many real contexts.

`medium-high` is a deliberate notch for entries that are well-evidenced but not yet fully stable patterns. It is not a general-purpose hedge; prefer `medium` or `high` when either genuinely applies.

---

## Rendering Expectations

The Tech Decisions UI emphasises comparison.

### A good entry page should make these sections obvious:

* title + decision question
* summary
* decision heuristic + what this is really about
* option A vs option B (parallel layout)
* key factors, questions to ask, evidence needed
* cost bearer + time horizon (structured comparison blocks)
* common bad reasons / anti-patterns / good signals
* AI effect
* related entries

### Important rendering principle

This category should feel:

* comparative
* analytical
* calm
* structured

Not:

* overly narrative
* blog-like
* winner/loser
* gimmicky

### UI implication

Option A and Option B should feel structurally parallel. The reader should be able to compare them easily.

---

## Validation Expectations

At minimum, validate that:

* every entry has a unique slug
* `category` uses one of the canonical subcategories
* `optionA` and `optionB` both exist with valid shapes
* option objects do not contain keys outside the canonical set
* `questionsToAsk` is present and non-empty
* `patternConfidence` is one of `low | medium | medium-high | high`
* `costBearer`, when present, has both `optionA` and `optionB` arrays
* `timeHorizonNotes`, when present, has both `optionA` and `optionB` non-empty strings
* `whenToRevisit`, when present, is an array
* AI fields use the canonical names (`aiCanHelpWith`, `aiCanMakeWorseBy`, `aiSpecificNotes`); the legacy names are errors
* all `related*` and `oftenLeadsToFailureModes` / `adjacentDecisions` slugs resolve where slug-based references are used

Recommended additional validation:

* `optionA.name` and `optionB.name` must both be non-empty
* `summary` should be concise, not essay-length
* `decisionQuestion` should end with a question mark

---

## Quality Standard

A strong Tech Decision entry should make the user feel:

* this is clearer than a blog post
* this respects context
* this does not pretend one answer always wins
* this helps me ask better questions
* this shows me where teams fool themselves

## One-Sentence Rule

**A Tech Decision entry should help the reader reason through a trade-off, not recruit them into a side.**
