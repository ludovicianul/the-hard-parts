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
  "looksHealthyBecause": [],
  "easilyConfusedWith": [
    { "pattern": "", "distinction": "" }
  ],
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
  "firstMove": "",
  "hardTradeoff": "",
  "recoveryTrap": "",
  "recoveryDifficulty": "",
  "aiCanHelpWith": [],
  "aiCanMakeWorseBy": [],
  "aiFalseConfidence": "",
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
* `looksHealthyBecause`
* `easilyConfusedWith`
* `whatNotToDo`
* `firstMove`
* `hardTradeoff`
* `recoveryTrap`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiFalseConfidence`
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

### Slug article rule

Failure Mode **titles** may include leading articles like “The”.
Failure Mode **slugs** must omit leading articles.

Correct:

```json
"title": "The Friendly Rewrite",
"slug":  "friendly-rewrite"
```

Not correct:

```json
"title": "The Friendly Rewrite",
"slug":  "the-friendly-rewrite"
```

This rule is applied consistently across the Failure Modes catalog so that slugs stay clean, comparable, and easy to reference from other categories.

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

The enum accepts **two kinds of values** — five ordered ladder positions, plus one trend flag. They are mutually exclusive per entry.

#### Ladder positions (ordered, rare → universal)

* `rare`
* `occasional`
* `common`
* `very common`
* `universal`

These are positions on a how-often-does-this-show-up axis. The UI renders them as a 5-step bar ladder on the FM landing reading-guide card and on every detail page's MetaRail cell.

#### Trend flag

* `increasing`

This is **not a point on the ladder** — it flags a pattern whose prevalence is rising (typically AI-era content). Rendering: a trend chevron (↗) replaces the bar ladder in the MetaRail cell, and the FM landing reading-guide surfaces it as a separate sub-row explainer. Using the same visual for "how common" and "which way it's moving" was tried and rejected — it collapsed two orthogonal ideas into one ambiguous ladder.

> The previous schema included `uncommon` as a ladder position. It was removed because nothing in the content used it and the gap between `rare` and `occasional` was already small enough to not need a third notch. Do not reintroduce it.

### Meaning

This is editorial frequency, not telemetry.

### Enum discipline

`frequency` is intentionally a **closed enum**, not a freeform label.

Do not introduce contextual variants such as `"common in AI work"`, `"common in platform teams"`, or `"common under deadline pressure"`. Nuance about context belongs in other fields:

* AI-era specificity → `category: "ai"`, `aiCanHelpWith`, `aiCanMakeWorseBy`, `aiSpecificNotes`
* Lifecycle specificity → `lifecycleStages`
* Audience specificity → narrative fields (`starts`, `feelsReasonableBecause`, etc.)

Keeping this enum narrow is what makes cross-entry comparison and filtering meaningful.

The canonical lists live in `src/lib/attribute-scales.ts` (`FREQUENCY_SCALE` for ladder, `FREQUENCY_TRENDS` for trend values) and the Zod enum in `src/content/schemas/shared.ts` (`FrequencyEnum`). Keep these three in lockstep when extending.

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

### `looksHealthyBecause`

Array of concrete, **external** tells that make the pattern read as responsible, mature, or healthy to people outside the team.

Where other recognition fields handle:

* `mistakenFor` — the short label the pattern is mistaken for
* `oftenMistakenAs` — a slightly richer socially-acceptable phrasing
* `feelsReasonableBecause` — the **internal** logic that makes the pattern feel rational from inside the team

`looksHealthyBecause` is the **external, scannable** axis: the visible signals that make observers endorse or tolerate the pattern. This is what makes many failure modes survive social review — leadership sees these tells and nods.

Example:

```json
"looksHealthyBecause": [
  "architecture diagrams look modern and clean",
  "the team quotes SOLID, DDD, or hexagonal architecture",
  "pull requests look disciplined and well-reviewed"
]
```

Strong entries include 2–5 items. Items should be short, recognizable, and observable from outside the team.

### Rendering

A compact boxed list rendered directly below the AT-A-GLANCE identity panel on the detail page, titled **"Why it looks healthy"**. The content is intended as part of recognition, not diagnosis.

---

### `easilyConfusedWith`

An array of structured items that help the reader distinguish this pattern from nearby patterns.

Each item has two fields:

* `pattern` — the nearby pattern. Preferably a Failure Mode slug where a named mode exists; otherwise a short human phrase (e.g. `"regular refactoring work"`).
* `distinction` — one concise sentence naming the specific difference.

Example:

```json
"easilyConfusedWith": [
  {
    "pattern": "migration-debt",
    "distinction": "Migration debt is about unfinished prior moves. The friendly rewrite is a new move whose endpoint was never defined."
  },
  {
    "pattern": "regular refactoring work",
    "distinction": "Refactoring preserves behavior and scope. The friendly rewrite expands scope while the old system stays live."
  }
]
```

### Rules

* Keep it short — 2 to 4 items.
* Distinctions should be one sentence, not a paragraph.
* This field is **not** a generic "related" link — use `relatedFailureModes`, `oftenLeadsTo`, or `oftenCausedBy` for those.
* `easilyConfusedWith` is specifically about the **recognition boundary**: telling adjacent patterns apart.

### Rendering

Renders at the top of the Relationships section as a dedicated sub-panel titled **"Easy to confuse with"**, with each row showing the pattern name in a framed cell and the distinction in a short serif line. Sits above the cross-reference grid.

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

### `firstMove`

A single sentence naming the **very first** specific action a team should take when they recognize the pattern.

Sharper than `immediateActions[0]`: that list describes several things to do soon; `firstMove` names the one move that earns the right to do the rest.

Example:

```json
"firstMove": "name the rewrite as a rewrite in writing, and stop framing it as cleanup."
```

### `hardTradeoff`

A single sentence naming the **unavoidable hard choice** recovery will force.

Recovery from a real failure mode is rarely free. This field names the cost honestly, so intervention isn't sold as a magic fix.

Example:

```json
"hardTradeoff": "accept that some of the new system will be thrown away, or accept that the old system will outlive the migration."
```

### `recoveryTrap`

A single sentence naming the **common, plausible-looking recovery move that actually makes things worse**.

This is different from `whatNotToDo` (a list of weak responses). `recoveryTrap` is specifically the trap: the move that looks like a recovery but deepens the pattern.

Example:

```json
"recoveryTrap": "launching a second rewrite to fix the first rewrite."
```

### Rendering

`firstMove`, `hardTradeoff`, and `recoveryTrap` render together as a 3-cell **Intervention strip** at the top of the "What to do" section on the detail page, above the existing `immediateActions` / `structuralFixes` / `whatNotToDo` columns. The strip exists to make the response section feel like intervention guidance, not generic advice.

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

### `aiFalseConfidence`

A short (one- to two-sentence) statement of the **specific false confidence** AI creates in this particular failure mode.

Distinct from the sibling AI fields:

* `aiCanMakeWorseBy` — a list of mechanisms AI uses to amplify the pattern
* `aiSpecificNotes` — the editorial synthesis / takeaway
* `aiFalseConfidence` — the specific **illusion of correctness, coverage, or progress** AI produces in the shape of this pattern

This field exists to keep AI commentary **specific per entry**, not generic. Every AI-aware failure mode produces a particular kind of false confidence (generated code that looks reviewed, generated docs that look like knowledge transfer, generated tickets that look like throughput, etc.). Naming it here keeps the AI section honest.

Example:

```json
"aiFalseConfidence": "Generated replacement code looks reviewed because it compiles and passes shallow tests, creating the illusion that behavior has been validated."
```

### Rendering

Renders as a **red callout band** in the AI section, between the two AI-effect boxed lists (`aiCanHelpWith` / `aiCanMakeWorseBy`) and the blue `aiSpecificNotes` synthesis. The red treatment reads as a pattern-specific warning; the blue synthesis below reads as the editorial summary. Both render only when populated.

### `aiSpecificNotes`

A short synthesis explaining how AI changes this pattern specifically.

Do not force AI commentary into every entry, but include it where AI materially changes the pattern.

---

## Relationship Fields

Failure Modes should feel interconnected, and Failure Modes express their relationships with **more precision** than a generic "related" field.

### Canonical FM-to-FM relationship fields

Failure Modes use two first-class, directional relationship fields:

#### `oftenLeadsTo`

A list of other failure modes this one commonly **causes, enables, or amplifies**.

This is a causal, forward-facing link.

Example:

```json
"oftenLeadsTo": ["dependency-fog", "ownership-drift", "invisible-deadline"]
```

#### `oftenCausedBy`

A list of failure modes, conditions, or organizational dynamics that commonly **produce** this one.

This is a causal, backward-facing link.

Example:

```json
"oftenCausedBy": ["weak governance structures", "hero-trap"]
```

Entries may contain either:

* a Failure Mode slug (preferred where a named mode exists), or
* a short descriptive phrase (acceptable where the cause is not itself a named mode)

`oftenLeadsTo` and `oftenCausedBy` are **first-class** Failure Modes relationship fields. They must not be collapsed into a generic `relatedFailureModes` field.

### `relatedFailureModes` (optional, neutral fallback)

Optional. Use only when the link to another Failure Mode is genuinely **neutral / non-causal** — that is, when the two modes are conceptually adjacent but neither causes the other.

If the link is causal in either direction, prefer `oftenLeadsTo` or `oftenCausedBy`. Do not duplicate slugs across `oftenLeadsTo` / `oftenCausedBy` and `relatedFailureModes`.

### Shared cross-category fields

Use:

* `relatedRedFlags`
* `relatedTechDecisions`
* `relatedPlaybooks`

These should contain slug references wherever possible.

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

