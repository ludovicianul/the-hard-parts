# Schema — Red Flags

## Purpose

This document defines the category-specific content schema for **Red Flags**.

It should be read together with:

* `docs/content-schema.md`
* `docs/product-brief.md`

This file explains:

* what a Red Flag entry is
* what fields it should contain
* what each field means
* which fields are required vs optional
* how the content should render in the UI

The goal of this schema is to keep Red Flags:

* sharp
* scannable
* early-warning oriented
* structurally consistent
* useful as a diagnosis aid rather than generic commentary

---

## What a Red Flag Entry Is

A Red Flag entry is a structured warning signal.

It is **not**:

* a full failure mode
* a generic best-practice reminder
* a vague concern with no observable signal
* a postmortem

A Red Flag entry should help the user answer:

* what signal is visible?
* what might it indicate underneath?
* how serious is it?
* what is it commonly confused with?
* what tends to happen if it is ignored?
* what should be inspected next?
* how does AI distort or intensify this signal?

A Red Flag is about **early recognition**, not full explanation of the whole system failure.

---

## Top-Level JSON Convention

Red Flags should follow the shared top-level structure from `docs/content-schema.md`.

Expected top-level shape:

```json
{
  "category": {
    "code": "RF",
    "name": "Red Flags",
    "summary": "Structured early warning signals across code, teams, process, leadership, and AI-enabled workflows.",
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
"code": "RF"
```

---

## Category/Subcategory Values

Recommended Red Flag subcategories:

* `code`
* `architecture`
* `team`
* `process`
* `leadership`
* `operations`
* `ai`

These should be listed in:

```json
"category": {
  "categories": ["code", "architecture", "team", "process", "leadership", "operations", "ai"]
}
```

Each entry’s `category` value must match one of these.

---

## Entry Schema Overview

Each Red Flag entry should use this structure:

```json
{
  "slug": "",
  "title": "",
  "category": "",
  "summary": "",
  "signal": "",
  "whyItMatters": "",
  "severity": "",
  "frequency": "",
  "detectability": "",
  "showsUpAs": [],
  "usuallyIndicates": [],
  "oftenConfusedWith": [],
  "whatToInspectNext": [],
  "ifIgnored": [],
  "counterSignals": [],
  "commonBadResponses": [],
  "examplePhrases": [],
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

These fields should be required for every Red Flag entry:

* `slug`
* `title`
* `category`
* `summary`
* `signal`
* `whyItMatters`
* `severity`
* `frequency`
* `detectability`
* `showsUpAs`
* `usuallyIndicates`
* `whatToInspectNext`
* `ifIgnored`
* `patternConfidence`

### Why these are required

Without them, the entry cannot reliably answer:

* what the warning signal is
* how visible/common it is
* why it should be taken seriously
* what it likely points to
* what a reader should do next

---

## Optional but Strongly Recommended Fields

These fields may be optional technically, but strong entries should usually include them:

* `oftenConfusedWith`
* `counterSignals`
* `commonBadResponses`
* `examplePhrases`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiSpecificNotes`
* all `related*` fields

These fields make entries much more diagnostic and practically useful.

---

## Field-by-Field Definitions

### `slug`

Canonical route identifier.

Example:

```json
"slug": "ownership-is-claimed-but-not-visible"
```

Must follow global slug rules.

---

### `title`

Human-readable display title.

This should be crisp and signal-like.

Examples:

```json
"title": "Ownership is claimed but not visible"
```

```json
"title": "Generated code is merged without deep review"
```

---

### `category`

Red Flag subcategory.

Must match an allowed subcategory value.

Example:

```json
"category": "team"
```

---

### `summary`

A concise one- to two-sentence editorial summary.

This should quickly explain why the signal matters.

Example:

```json
"summary": "A team says a system is owned, but responsibility is not visible in routing, decisions, or maintenance. This often signals accountability drift rather than healthy shared ownership."
```

---

### `signal`

A plain-language statement of the actual warning signal.

This is one of the most important fields in the schema.
It should describe the signal in observable terms.

Example:

```json
"signal": "People keep asking the same person what to do, even in areas that are supposedly team-owned."
```

This field should render prominently near the top of the page.

---

### `whyItMatters`

A short explanation of why this signal deserves attention.

This should answer:

* why is this not just a harmless annoyance?
* what kind of system weakness does it suggest?

Example:

```json
"whyItMatters": "Because repeated routing to one person often means the system is less resilient, less documented, and less transferable than it appears."
```

---

### `severity`

Editorial severity of the signal.

Preferred allowed values:

* `low`
* `medium`
* `high`
* `critical`

### Meaning

This expresses how dangerous the signal tends to be **if it is real and persistent**, not how dramatic it sounds.

---

### `frequency`

How commonly this signal appears in real software environments.

Preferred allowed values:

* `rare`
* `uncommon`
* `common`
* `very common`
* `universal`
* `increasing`

### Meaning

This is editorial frequency, not telemetry.

---

### `detectability`

How easy the signal is to notice before the underlying issue becomes serious.

Preferred allowed values:

* `easy`
* `moderate`
* `hard`
* `deceptive`

### Meaning

* `easy` → obvious to many observers
* `moderate` → visible if someone is paying attention
* `hard` → subtle until damage accumulates
* `deceptive` → often looks healthy or normal on the surface

This field is important because some red flags are visible but misread.

---

## `showsUpAs`

A list of concrete ways the signal tends to appear.

This should be observable and specific.

Examples:

```json
"showsUpAs": [
  "The same engineer is pulled into most incidents.",
  "PRs touching one subsystem wait for a specific reviewer.",
  "People avoid changing the area unless a certain person is available."
]
```

This field should help the reader recognize the flag in the wild.

---

## `usuallyIndicates`

A list of likely underlying issues the red flag points to.

This is a diagnostic field, not a certainty field.

Examples:

* ownership ambiguity
* knowledge concentration
* weak boundaries
* poor observability
* hidden coordination cost
* brittle release process

This field should use phrases that are meaningful and inspectable.

---

## `oftenConfusedWith`

A list of things this signal is commonly mistaken for.

This is one of the most useful fields and should be included often.

Examples:

* healthy collaboration
* fast-moving startup culture
* strong engineering standards
* harmless temporary chaos
* good initiative

This field helps users avoid normalizing the signal incorrectly.

---

## `whatToInspectNext`

A list of concrete follow-up inspections or questions.

This field is required because Red Flags should not just identify problems — they should guide diagnosis.

Examples:

```json
"whatToInspectNext": [
  "Who actually owns incidents, roadmap, and docs for this area?",
  "How many people can safely modify this subsystem?",
  "What happens when the usual expert is unavailable?"
]
```

This should render as a highly actionable section.

---

## `ifIgnored`

A list of likely downstream consequences.

This should answer:

* what does this signal tend to lead to if left alone?

Examples:

* delivery slowdown
* brittle ownership
* repeated rework
* false confidence
* incident amplification
* quiet trust decay

This field should connect the signal to future failure without fully becoming a Failure Mode entry.

---

## `counterSignals`

A list of signals that can help the reader distinguish healthy situations from unhealthy ones.

This field is very valuable.
It answers:

* what would make this situation look less dangerous?
* what evidence would soften the concern?

Examples:

* clear documented ownership exists
* rotation and backup ownership are visible
* multiple engineers regularly change the system safely
* escalation paths are explicit and working

This keeps Red Flags from becoming too absolutist.

---

## `commonBadResponses`

A list of weak reactions teams often have to this red flag.

Examples:

* normalize it
* hide it with process language
* treat it as temporary forever
* add more reporting without changing structure
* overreact with blanket rules instead of diagnosis

This field is strongly recommended.

---

## `examplePhrases`

A list of phrases, status language, or recurring statements that often accompany the flag.

This makes entries feel recognizable and memorable.

Examples:

```json
"examplePhrases": [
  "Ask Alex, they know that part.",
  "We just need a bit more alignment.",
  "It’s owned by the team."
]
```

This is especially useful for team, leadership, process, and AI-related red flags.

---

## AI Fields

Red Flags often benefit from strong AI treatment because AI can:

* amplify warning signals
* hide warning signals behind polished output
* make some issues harder to detect
* make some inspections easier

### `aiCanHelpWith`

Array of ways AI may help surface or inspect the signal.

### `aiCanMakeWorseBy`

Array of ways AI can amplify, hide, or accelerate the signal.

### `aiSpecificNotes`

A short synthesis explaining how AI changes this red flag in practice.

Examples:

* AI makes weak architecture look productive for longer
* AI can surface duplicated logic or owner concentration faster
* AI can raise output while lowering review depth, making detection harder

Do not force AI commentary into every entry.
But include it whenever AI materially changes how the signal behaves.

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
"relatedFailureModes": ["hero-trap", "ownership-drift"]
```

Cross-links should be meaningful and diagnostic.

Examples:

* a red flag about weak ownership may link to failure modes about hero dependence or ownership drift
* a red flag about review quality may link to an AI playbook on code review
* a red flag about contract ambiguity may link to a decision like REST vs GraphQL or backward compatibility choices

---

## `patternConfidence`

Use shared allowed values:

* `high`
* `medium`
* `low`

Meaning:
editorial confidence that this signal is recognizable, useful, and stable enough to stand as a structured warning pattern.

Most broad and repeated red flags will likely be `high`.
More emerging AI-specific signals may be `medium`.

---

## Rendering Expectations

The Red Flags UI should emphasize recognition and diagnosis.

### A good entry page should make these sections obvious:

* title
* summary
* signal
* why it matters
* severity / frequency / detectability
* how it shows up
* what it usually indicates
* what to inspect next
* what happens if ignored
* related entries
* AI effects

### Important rendering principle

This category should feel:

* sharp
* alert
* structured
* diagnostic
* fast to scan

Not:

* essay-like
* overly narrative
* alarmist without evidence
* motivational

### UI implication

A Red Flag page should make it easy to move from:

* visible signal
* to likely interpretation
* to next inspection step

This is a **warning system**, not a long-form article format.

---

## Validation Expectations

At minimum, validate that:

* every entry has a unique slug
* `category` uses an allowed subcategory
* `severity`, `frequency`, and `detectability` use allowed values
* `showsUpAs`, `usuallyIndicates`, `whatToInspectNext`, and `ifIgnored` are present and non-empty
* all `related*` slugs resolve correctly
* `patternConfidence` uses an allowed value

Recommended additional validation:

* `signal` must be non-empty
* `summary` should be concise, not essay-length
* `whatToInspectNext` should contain actionable items, not vague principles

---

## Example Minimal Valid Entry

```json
{
  "slug": "ownership-is-claimed-but-not-visible",
  "title": "Ownership is claimed but not visible",
  "category": "team",
  "summary": "A system is said to be owned, but responsibility is not visible in routing, maintenance, or decisions.",
  "signal": "People keep asking the same person or guessing who owns the area.",
  "whyItMatters": "Because hidden or fuzzy ownership slows response, weakens accountability, and increases fragility.",
  "severity": "high",
  "frequency": "common",
  "detectability": "moderate",
  "showsUpAs": [
    "Incidents bounce between teams before action starts.",
    "PRs wait for informal approval from one familiar person."
  ],
  "usuallyIndicates": [
    "ownership drift",
    "knowledge concentration",
    "boundary ambiguity"
  ],
  "whatToInspectNext": [
    "Who owns incidents, roadmap, and docs for this area?",
    "What happens when the informal owner is unavailable?"
  ],
  "ifIgnored": [
    "slower delivery",
    "more brittle response",
    "quiet accountability decay"
  ],
  "patternConfidence": "high"
}
```

---

## Quality Standard

A strong Red Flag entry should make the user feel:

* I have seen this before
* this is more precise than a vague concern
* now I know what to inspect next
* this helps me talk about the issue earlier and better

## One-Sentence Rule

**A Red Flag entry should make a weak signal legible early enough that a team can investigate before it hardens into a failure mode.**

