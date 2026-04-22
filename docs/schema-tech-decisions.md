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

* what decision is actually being made
* what the real trade-off is
* when each option fits naturally
* what hidden costs appear later
* what bad reasoning commonly drives the wrong choice
* what adjacent decisions or failure modes it connects to

The reader should come away with better judgment, not just a preferred answer.

---

## Top-Level JSON Convention

Tech Decisions should follow the shared top-level structure from `docs/content-schema.md`.

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

---

## Category/Subcategory Values

Recommended Tech Decisions subcategories:

* `architecture`
* `data`
* `delivery`
* `platform`
* `process`
* `ai`

These should be listed in:

```json
"category": {
  "categories": ["architecture", "data", "delivery", "platform", "process", "ai"]
}
```

Each entry’s `category` value must match one of these.

If the category list expands later, do so intentionally.

---

## Entry Schema Overview

Each Tech Decision entry should use this structure:

```json
{
  "slug": "",
  "title": "",
  "decision": "",
  "category": "",
  "summary": "",
  "coreTradeoff": "",
  "whyThisDecisionExists": "",
  "optionA": {
    "name": "",
    "summary": "",
    "bestWhen": [],
    "strengths": [],
    "costs": [],
    "failureModes": [],
    "realWorldFits": []
  },
  "optionB": {
    "name": "",
    "summary": "",
    "bestWhen": [],
    "strengths": [],
    "costs": [],
    "failureModes": [],
    "realWorldFits": []
  },
  "hiddenVariables": [],
  "commonMistakes": [],
  "falseSignals": [],
  "secondOrderEffects": [],
  "decisionHeuristics": [],
  "questionsToAsk": [],
  "aiCanHelpWith": [],
  "aiCanMakeWorseBy": [],
  "aiSpecificNotes": "",
  "relatedFailureModes": [],
  "relatedRedFlags": [],
  "relatedTechDecisions": [],
  "relatedPlaybooks": [],
  "patternConfidence": "high"
}
```

This is the preferred schema for the live site.

---

## Required Fields

These fields should be required for every Tech Decision entry:

* `slug`
* `title`
* `decision`
* `category`
* `summary`
* `coreTradeoff`
* `optionA`
* `optionB`
* `questionsToAsk`
* `patternConfidence`

### Why these are required

Because without them, the entry cannot reliably answer:

* what the decision is
* what is being traded off
* what the two poles are
* how a reader should evaluate the choice

---

## Optional but Strongly Recommended Fields

These fields may be optional technically, but should usually exist in strong entries:

* `whyThisDecisionExists`
* `hiddenVariables`
* `commonMistakes`
* `falseSignals`
* `secondOrderEffects`
* `decisionHeuristics`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiSpecificNotes`
* all `related*` fields

A weak entry may omit some of these.
A high-quality entry should include most of them.

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

Human-readable display title.

Usually matches the decision pair.

Example:

```json
"title": "Build vs Buy"
```

---

### `decision`

A short plain-language statement of the actual choice being made.

This should be clearer than the title when needed.

Example:

```json
"decision": "Should we build this capability ourselves or adopt an existing product/service?"
```

This helps the entry stay grounded in the real decision instead of only the label.

---

### `category`

Tech Decisions subcategory.

Must match an allowed subcategory value.

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

### `coreTradeoff`

A short statement of the main tension.

This is one of the most important fields in the schema.

Examples:

```json
"coreTradeoff": "Speed and simplicity now versus autonomy and operational separation later."
```

```json
"coreTradeoff": "Control and custom fit versus focus and external dependency."
```

This should render prominently on the entry page.

---

### `whyThisDecisionExists`

Explains why teams face this decision in the first place.

This should help the reader understand:

* what pressures create the choice
* why the decision keeps recurring
* why it is easy to misframe

Example:

```json
"whyThisDecisionExists": "Teams hit this decision when scale, ownership, and delivery friction start to strain the existing structure, but future growth is still uncertain."
```

---

## Option Objects

Each entry should define two structured option objects:

* `optionA`
* `optionB`

These are not “good vs bad.”
They are two poles of a trade-off.

### Preferred shape

```json
{
  "name": "",
  "summary": "",
  "bestWhen": [],
  "strengths": [],
  "costs": [],
  "failureModes": [],
  "realWorldFits": []
}
```

### Field meanings

#### `name`

Display name of the option.

Example:

```json
"name": "Build"
```

#### `summary`

Short description of what this option means in practice.

#### `bestWhen`

List of conditions where this option is a natural fit.

This should answer:

* when does this option make sense without forcing it?

#### `strengths`

What this option does well.

#### `costs`

Real costs, not weak caveats.
These can include:

* organizational cost
* delivery cost
* operational cost
* skill cost
* long-term maintenance burden

#### `failureModes`

What this option tends to look like when misapplied.
These can be entry-specific phrases or references to broader patterns.

#### `realWorldFits`

Examples of environments or conditions where this option naturally fits.

This field is strongly recommended.
It helps avoid abstract comparison.

Example:

```json
"realWorldFits": [
  "small product team with tight feedback loops",
  "early-stage product with uncertain boundaries",
  "domain where speed of change matters more than independent deployment"
]
```

---

## `hiddenVariables`

A list of variables that change the answer materially but are often ignored.

Examples:

* team maturity
* operational discipline
* regulatory pressure
* change frequency
* domain complexity
* integration surface
* cost of migration

Example:

```json
"hiddenVariables": [
  "team size and ownership stability",
  "operational maturity",
  "how often boundaries actually change",
  "ability to absorb migration cost"
]
```

This field is very important because it prevents rigid, ideology-driven reading.

---

## `commonMistakes`

A list of bad reasoning patterns teams fall into when making this decision.

These are not generic mistakes.
They should be specific to the decision.

Examples:

* choosing for prestige
* choosing because a competitor did it
* choosing based on one local pain while ignoring second-order effects
* treating scale assumptions as already real

---

## `falseSignals`

A list of misleading signals that often make one option look attractive when it may not be.

Examples:

* current frustration mistaken for structural proof
* number of services mistaken for maturity
* vendor polish mistaken for long-term fit
* local speed mistaken for system-wide success

This field is especially useful and should be included often.

---

## `secondOrderEffects`

A list of downstream consequences that appear later.

This should make the reader think beyond the immediate decision.

Examples:

* review overhead
* coordination cost
* debugging complexity
* platform dependency
* migration lock-in
* onboarding burden
* contract drift

This field should usually render as a dedicated section.

---

## `decisionHeuristics`

A list of compact practical heuristics.

These are not rules.
They are directional aids.

Examples:

* “Prefer the option that keeps common changes local.”
* “Do not optimize for autonomy you cannot operationally sustain.”
* “If only one team needs it, shared infrastructure is probably too early.”

These are highly useful for readers and strongly recommended.

---

## `questionsToAsk`

A list of questions the reader should ask before choosing.

This field is required because it turns the entry into a usable decision tool.

Examples:

```json
"questionsToAsk": [
  "What problem are we actually solving?",
  "Which option keeps common changes easier in our current team shape?",
  "What operational burden can we really sustain?",
  "What happens if our assumptions are wrong in 12 months?"
]
```

This field should render prominently.

---

## AI Fields

Tech Decisions should often include AI impact because AI changes:

* implementation speed
* evaluation cost
* build-vs-buy dynamics
* review burden
* abstraction temptation
* architecture confidence

### `aiCanHelpWith`

Array of ways AI use can improve the decision process or implementation.

### `aiCanMakeWorseBy`

Array of ways AI can distort the decision or make the wrong option easier to choose.

### `aiSpecificNotes`

A short synthesis explaining how AI changes this decision in a meaningful way.

Do not add generic AI commentary.
Only include it where it materially changes the decision surface.

---

## Cross-Reference Fields

Use shared slug-based arrays:

* `relatedFailureModes`
* `relatedRedFlags`
* `relatedTechDecisions`
* `relatedPlaybooks`

These should contain slugs wherever possible.

Example:

```json
"relatedFailureModes": ["friendly-rewrite", "dependency-fog"]
```

Cross-links should be meaningful, not inflated.

Examples:

* `build-vs-buy` may link to failure modes about platform overreach or ownership drift
* `monolith-vs-microservices` may link to red flags about change fan-out or unclear ownership
* `rewrite-vs-refactor` may link to a playbook like `run-a-phased-migration`

---

## `patternConfidence`

Use shared allowed values:

* `high`
* `medium`
* `low`

Meaning:
editorial confidence that the structure of this decision is durable and useful across many real contexts.

Most core trade-off entries will likely be `high`.
More emerging or AI-specific entries may be `medium`.

---

## Rendering Expectations

The Tech Decisions UI should support comparison.

### A good entry page should make these sections obvious:

* title
* summary
* core trade-off
* option A vs option B
* hidden variables
* common mistakes / false signals
* second-order effects
* questions to ask
* related entries
* AI effect

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

Option A and Option B should feel structurally parallel.
The user should be able to compare them easily.

---

## Validation Expectations

At minimum, validate that:

* every entry has a unique slug
* `category` uses an allowed subcategory
* `optionA` and `optionB` both exist
* `questionsToAsk` is present and non-empty
* `patternConfidence` uses an allowed value
* all `related*` slugs resolve correctly

Recommended additional validation:

* `optionA.name` and `optionB.name` must both be non-empty
* `coreTradeoff` must be non-empty
* `summary` should be concise, not essay-length

---

## Example Minimal Valid Entry

```json
{
  "slug": "build-vs-buy",
  "title": "Build vs Buy",
  "decision": "Should we build this capability ourselves or use an external product/service?",
  "category": "platform",
  "summary": "Usually a control-versus-focus decision, not an engineering pride decision.",
  "coreTradeoff": "Control and custom fit versus speed, focus, and external dependency.",
  "optionA": {
    "name": "Build",
    "summary": "Create and maintain the capability internally.",
    "bestWhen": ["the capability is strategically differentiating"],
    "strengths": ["full control"],
    "costs": ["long-term ownership burden"],
    "failureModes": ["building undifferentiated plumbing forever"],
    "realWorldFits": ["core product capability with durable strategic value"]
  },
  "optionB": {
    "name": "Buy",
    "summary": "Adopt a third-party product or service.",
    "bestWhen": ["the capability is necessary but not differentiating"],
    "strengths": ["faster time to capability"],
    "costs": ["vendor dependence"],
    "failureModes": ["outsourcing a core differentiator"],
    "realWorldFits": ["commodity capability with mature external options"]
  },
  "questionsToAsk": [
    "Is this actually core to our differentiation?",
    "Can we sustain long-term ownership if we build?"
  ],
  "patternConfidence": "high"
}
```

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

