# Schema — Failure Modes

## Purpose

This document defines the category-specific content schema for **Failure Modes**.

It should be read together with:

* `docs/content-schema.md`
* `docs/product-brief.md`

This file explains:

* what a Failure Mode entry is
* what fields it should contain
* what each field means
* which fields are required vs optional
* how the content should render in the UI

The goal of this schema is to keep Failure Modes:

* recognizable
* structured
* interconnected
* diagnostically useful
* serious without becoming academic

---

## What a Failure Mode Entry Is

A Failure Mode entry is a structured description of a **recurring way software work goes wrong**.

It is **not**:

* a one-off postmortem
* a vague anti-pattern list item
* a pure opinion essay
* a generic warning sign without escalation logic
* a playbook

A Failure Mode entry should help the reader answer:

* what pattern am I looking at?
* how does it usually begin?
* why does it feel reasonable at first?
* how does it escalate?
* what signals show up early, mid, and late?
* what usually causes it?
* what helps teams escape it?
* what other patterns does it connect to?
* how does AI distort or intensify it?

This category is about **named system failure patterns**, not isolated bugs or grievances.

---

## Top-Level JSON Convention

Failure Modes should follow the shared top-level structure from `docs/content-schema.md`.

Expected top-level shape:

```json
{
  "category": {
    "code": "FM",
    "name": "Failure Modes",
    "summary": "Named patterns that quietly sink software projects, systems, and teams.",
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
"code": "FM"
```

---

## Category/Subcategory Values

Recommended Failure Modes subcategories:

* `planning`
* `people`
* `technical`
* `process`
* `leadership`
* `ai`

These should be listed in:

```json
"category": {
  "categories": ["planning", "people", "technical", "process", "leadership", "ai"]
}
```

Each entry’s `category` value must match one of these.

---

## Entry Schema Overview

Each Failure Mode entry should use this structure:

```json
{
  "slug": "",
  "title": "",
  "alternativeNames": [],
  "category": "",
  "summary": "",
  "whoNoticesFirst": [],
  "mistakenFor": "",
  "severity": "",
  "frequency": "",
  "lifecycleStages": [],
  "whatItIs": "",
  "bestMomentToIntervene": "",
  "blastRadius": [],
  "oftenMistakenAs": "",
  "starts": "",
  "feelsReasonableBecause": "",
  "escalates": "",
  "ends": "",
  "warningSigns": {
    "early": [],
    "mid": [],
    "late": []
  },
  "whyItHappens": [],
  "immediateActions": [],
  "structuralFixes": [],
  "whatNotToDo": [],
  "recoveryDifficulty": "",
  "aiCanHelpWith": [],
  "aiCanMakeWorseBy": [],
  "aiSpecificNotes": "",
  "oftenLeadsTo": [],
  "oftenCausedBy": [],
  "relatedFailureModes": [],
  "relatedRedFlags": [],
  "relatedTechDecisions": [],
  "relatedPlaybooks": [],
  "commonQuote": "",
  "whoSaysThis": "",
  "counterMove": "",
  "falsePositive": "",
  "patternConfidence": "high"
}
```

This is the preferred schema for the live site.

---

## Required Fields

These fields should be required for every Failure Mode entry:

* `slug`
* `title`
* `category`
* `summary`
* `severity`
* `frequency`
* `lifecycleStages`
* `whatItIs`
* `starts`
* `feelsReasonableBecause`
* `escalates`
* `ends`
* `warningSigns`
* `whyItHappens`
* `immediateActions`
* `structuralFixes`
* `recoveryDifficulty`
* `patternConfidence`

### Why these are required

Because without them, the entry cannot reliably answer:

* what the pattern is
* why it starts
* how it escalates
* what signs appear
* what to do about it

---

## Optional but Strongly Recommended Fields

These fields may be optional technically, but strong entries should usually include them:

* `alternativeNames`
* `whoNoticesFirst`
* `mistakenFor`
* `bestMomentToIntervene`
* `blastRadius`
* `oftenMistakenAs`
* `whatNotToDo`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiSpecificNotes`
* `oftenLeadsTo`
* `oftenCausedBy`
* all `related*` fields
* `commonQuote`
* `whoSaysThis`
* `counterMove`
* `falsePositive`

These fields make the entry richer, more memorable, and more useful in real conversation.

---

## Field-by-Field Definitions

### `slug`

Canonical route identifier.

Example:

```json
"slug": "friendly-rewrite"
```

Must follow global slug rules.

Note: if legacy content already uses slugs like `the-friendly-rewrite`, preserve them if they are already established. Do not churn slugs casually.

---

### `title`

Human-readable display title.

Examples:

```json
"title": "The Friendly Rewrite"
```

```json
"title": "The Hero Trap"
```

This should be memorable and recognizable.

---

### `alternativeNames`

A list of common alternate names for the same pattern.

Examples:

```json
"alternativeNames": [
  "the big bang rewrite",
  "v2 syndrome",
  "the clean slate trap"
]
```

This is especially useful for discoverability and recognition.

---

### `category`

Failure Modes subcategory.

Must match an allowed subcategory value.

Example:

```json
"category": "planning"
```

---

### `summary`

A concise one- to two-sentence summary of the failure mode.

This should quickly answer:

* what is the pattern?
* why does it matter?

Example:

```json
"summary": "A rewrite framed as cleanup becomes a long-running replacement with no stable landing zone."
```

---

### `whoNoticesFirst`

A list of roles who usually spot the pattern earliest.

Examples:

* `tech lead`
* `architect`
* `engineering manager`
* `support lead`
* `senior engineer`

This field helps the reader see where early perception often begins.

---

### `mistakenFor`

The healthy or acceptable thing this pattern is often confused with.

Examples:

* good engineering hygiene
* strong ownership
* inclusive culture
* healthy urgency
* strategic investment

This is highly useful because many failure modes begin disguised as virtue.

---

### `severity`

Editorial severity of the failure mode.

Preferred allowed values:

* `low`
* `medium`
* `high`
* `critical`

### Meaning

This expresses how damaging the pattern tends to be if allowed to develop.

---

### `frequency`

How commonly the failure mode appears in software organizations.

Preferred allowed values:

* `rare`
* `occasional`
* `common`
* `very common`
* `universal`
* `increasing`

### Meaning

This is editorial frequency, not telemetry.

---

### `lifecycleStages`

A list of phases where the pattern most commonly appears or becomes visible.

Preferred allowed values:

* `strategy`
* `planning`
* `build`
* `delivery`
* `release`
* `operate`
* `postmortem`

Example:

```json
"lifecycleStages": ["planning", "build"]
```

This field helps position the pattern in the lifecycle of work.

---

## Snapshot / Orientation Fields

These fields help the reader identify the pattern quickly.

### `whatItIs`

A plain-language statement of what the pattern actually is.

This should be one of the clearest fields in the entry.

### `bestMomentToIntervene`

A short statement of when intervention is most effective.

Example:

```json
"bestMomentToIntervene": "before the rewrite becomes the default answer"
```

### `blastRadius`

A list of affected zones.

Examples:

* `code`
* `delivery`
* `team`
* `operations`
* `product`
* `business`
* `trust`

### `oftenMistakenAs`

A short phrase describing the socially acceptable interpretation of the same pattern.

This can overlap with `mistakenFor`, but if both are present:

* `mistakenFor` = label-level shorthand
* `oftenMistakenAs` = richer narrative phrasing

---

## Narrative Progression Fields

These fields are central to Failure Modes and should appear in this sequence conceptually.

### `starts`

How the pattern usually begins.

### `feelsReasonableBecause`

Why smart people allow it to continue at first.

This is one of the most important fields in the schema.
It should explain the emotional, organizational, or technical logic that makes the pattern persuasive.

### `escalates`

How the pattern grows or gets worse.

### `ends`

What the late-stage expression of the pattern looks like.

These four fields together should make the mode feel like a recognizable system trajectory, not a static label.

---

## `warningSigns`

A structured object of visible signals by stage.

Preferred shape:

```json
"warningSigns": {
  "early": [],
  "mid": [],
  "late": []
}
```

### Rules

* all three arrays should exist in strong entries
* items should be concrete and recognizable
* these should feel like real team language, real planning signals, or real operational symptoms

Example:

```json
"warningSigns": {
  "early": [
    "We should rebuild this properly.",
    "Nobody can name the first slice to migrate."
  ],
  "mid": [
    "Two systems run in parallel for months."
  ],
  "late": [
    "Nobody can define done in plain language."
  ]
}
```

This should render prominently and support quick scanning.

---

## `whyItHappens`

A list of root causes or enabling conditions.

This should answer:

* why does this pattern keep appearing?

Examples:

* pain in the current system is real
* migration strategy is weak
* capability and trust concentrate naturally
* proxy metrics become targets

This field should prefer structural causes over moralizing language.

---

## Escape / Recovery Fields

These fields define how teams respond.

### `immediateActions`

A list of actions that should happen soon after recognition.

These should be concrete and tactical.

### `structuralFixes`

A list of deeper, repeatable corrections that reduce recurrence.

These should be more durable than the immediate actions.

### `whatNotToDo`

A list of tempting but weak or harmful responses.

This field is strongly recommended.

### `recoveryDifficulty`

Editorial difficulty of escaping the pattern once active.

Preferred allowed values:

* `easy`
* `medium`
* `medium-hard`
* `hard`
* `very hard`

This field is useful for expectation-setting and comparative severity.

---

## AI Fields

Failure Modes often benefit from strong AI treatment because AI can:

* accelerate a pattern
* hide a pattern behind polished artifacts
* reduce toil in diagnosing a pattern
* create false confidence in weak systems

### `aiCanHelpWith`

Array of ways AI may help inspect, surface, or reduce the failure mode.

### `aiCanMakeWorseBy`

Array of ways AI can amplify, mask, or accelerate the failure mode.

### `aiSpecificNotes`

A short synthesis explaining how AI changes this pattern specifically.

Do not force AI commentary into every entry, but include it where AI materially changes the pattern.

---

## Relationship Fields

Failure Modes should feel interconnected.

### `oftenLeadsTo`

A list of other failure modes this one commonly causes or amplifies.

### `oftenCausedBy`

A list of modes or conditions that commonly produce this one.

These can contain failure mode slugs where possible.

### Shared cross-category fields

Use:

* `relatedFailureModes`
* `relatedRedFlags`
* `relatedTechDecisions`
* `relatedPlaybooks`

These should contain slug references wherever possible.

Example:

```json
"relatedFailureModes": ["dependency-fog", "ownership-drift"]
```

Cross-links should be meaningful, not inflated.

---

## Memorability / Field Notes Fields

These fields are optional but very strong for editorial quality.

### `commonQuote`

A phrase people often say when this pattern is active.

### `whoSaysThis`

The role that typically says the quote.

### `counterMove`

A short memorable corrective move.

### `falsePositive`

A note explaining what nearby healthy behavior might superficially resemble this mode, so the entry does not become absolutist.

These fields make Failure Modes more vivid and recognizable.

---

## `patternConfidence`

Use shared allowed values:

* `high`
* `medium`
* `low`

Meaning:
editorial confidence that this failure pattern is recognizable, stable, and useful enough to stand as a named entry.

Most core Failure Modes will likely be `high`.
Some newer AI-specific modes may be `medium`.

---

## Rendering Expectations

The Failure Modes UI should emphasize recognition, progression, and system effects.

### A good entry page should make these sections obvious:

* title
* summary
* snapshot / orientation block
* story arc
* warning signs by stage
* why it happens
* how teams escape
* AI effects
* relationships to other patterns
* memorable field note / quote where available

### Important rendering principle

This category should feel:

* editorial
* structured
* diagnostic
* hard-won
* serious

Not:

* fluffy
* moralizing
* generic anti-pattern list content
* abstract theory without operational consequence

### UI implication

A Failure Mode page should help the reader move from:

* recognition
* to explanation
* to intervention
* to related patterns

This category should feel like the backbone of the whole site.

---

## Validation Expectations

At minimum, validate that:

* every entry has a unique slug
* `category` uses an allowed subcategory
* `severity`, `frequency`, and `recoveryDifficulty` use allowed values
* `lifecycleStages` contains allowed values only
* `warningSigns.early`, `warningSigns.mid`, and `warningSigns.late` exist in strong entries
* required fields are present and non-empty
* all `related*` slugs resolve correctly where slug-based references are used
* `patternConfidence` uses an allowed value

Recommended additional validation:

* `summary` should be concise, not essay-length
* `starts`, `feelsReasonableBecause`, `escalates`, and `ends` should all be present in strong entries
* `immediateActions` and `structuralFixes` should not be empty
* `title` should be memorable and distinct from the `summary`

---

## Example Minimal Valid Entry

```json
{
  "slug": "friendly-rewrite",
  "title": "The Friendly Rewrite",
  "category": "planning",
  "summary": "A rewrite framed as cleanup becomes a long-running replacement with no stable landing zone.",
  "severity": "high",
  "frequency": "very common",
  "lifecycleStages": ["planning", "build"],
  "whatItIs": "A full or near-full rewrite justified by pain in the current system, but without a disciplined migration strategy.",
  "starts": "The current system is painful and starting over feels rational.",
  "feelsReasonableBecause": "The mess is real and a rewrite promises clarity, speed, and fewer compromises.",
  "escalates": "Parallel systems appear and scope expands before parity is reached.",
  "ends": "The team maintains two worlds while trust and delivery both weaken.",
  "warningSigns": {
    "early": [
      "We should rebuild this properly."
    ],
    "mid": [
      "Two systems run in parallel for months."
    ],
    "late": [
      "Nobody can define done in plain language."
    ]
  },
  "whyItHappens": [
    "pain in the current system is real",
    "migration strategy is weak"
  ],
  "immediateActions": [
    "define the first migration slice"
  ],
  "structuralFixes": [
    "use strangler migration patterns"
  ],
  "recoveryDifficulty": "hard",
  "patternConfidence": "high"
}
```

---

## Quality Standard

A strong Failure Mode entry should make the user feel:

* I have seen this before
* now I can name it clearly
* I understand why smart people fall into it
* I can see how it gets worse
* I know what to inspect or do next

## One-Sentence Rule

**A Failure Mode entry should turn a familiar but fuzzy engineering failure pattern into something named, structured, and actionable.**

