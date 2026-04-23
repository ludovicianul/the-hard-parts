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

Red Flags follow the site-wide top-level structure from `docs/content-schema.md`, with **two classification axes** instead of one.

Expected top-level shape:

```json
{
  "category": {
    "code": "RF",
    "name": "Red Flags",
    "summary": "Structured early warning signals across code, teams, process, leadership, and AI-enabled workflows.",
    "layers": [],
    "signalTypes": []
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

### Why two axes

Red Flags classify on two different, independent questions:

* **`layer`** — *where* the signal appears in the organization or system
* **`signalType`** — *what kind* of signal it is

Both axes are canonical. Neither is collapsed into a single generic `category`. Entries have exactly one `layer` and exactly one `signalType`.

---

## Classification Axes

### `layers` (primary axis — where the signal appears)

Canonical Red Flag layers:

* `code`
* `team`
* `process`
* `leadership`
* `ai`

These are listed in:

```json
"category": {
  "layers": ["code", "team", "process", "leadership", "ai"]
}
```

Each entry’s `layer` value must match one of these.

These are intentionally fewer than an exhaustive org taxonomy. They reflect where Red Flags actually land in the current content. If we gather enough entries in a new layer (for example `architecture` or `operations`), the layer set can expand — intentionally, not aspirationally.

### `signalTypes` (secondary axis — what kind of signal it is)

Canonical Red Flag signal types:

* `structural`
* `behavioral`
* `delivery`
* `communication`
* `architectural`
* `operational`
* `ai-quality`

These are listed in:

```json
"category": {
  "signalTypes": [
    "structural",
    "behavioral",
    "delivery",
    "communication",
    "architectural",
    "operational",
    "ai-quality"
  ]
}
```

Each entry’s `signalType` value must match one of these.

Meaning:

* `structural` — shape of the system or the organisation
* `behavioral` — how people, teams, or systems act
* `delivery` — how work flows to production
* `communication` — how information flows (or fails to)
* `architectural` — boundaries, interfaces, coupling
* `operational` — runtime health, incidents, on-call
* `ai-quality` — signals specific to AI-assisted or AI-driven workflows

---

## Entry Schema Overview

Each Red Flag entry uses this structure:

```json
{
  "slug": "",
  "title": "",
  "layer": "",
  "signalType": "",
  "summary": "",
  "decisionHeuristic": "",

  "whatYouNotice": "",
  "whyItMatters": "",
  "whatItUsuallyIndicates": [],
  "notNecessarilyAProblemWhen": [],
  "commonContexts": [],

  "severity": "",
  "frequency": "",
  "detectability": "",

  "leadingIndicators": [],
  "diagnosticQuestions": [],
  "whatToCheckNext": [],
  "commonRootCauses": [],
  "likelyConsequences": [],
  "antiPatterns": [],
  "falseFriends": [],

  "ownerMostLikelyToNotice": [],
  "ownerBestPlacedToAct": [],
  "timeHorizon": "",

  "aiAmplifies": [],
  "aiMasks": [],
  "aiSpecificNotes": "",

  "relatedFailureModes": [],
  "relatedTechDecisions": [],
  "relatedPlaybooks": [],
  "relatedRedFlags": [],

  "exampleSignals": [],
  "patternConfidence": "high"
}
```

This is the canonical schema for the live site.

---

## Required Fields

These fields are required for every Red Flag entry:

* `slug`
* `title`
* `layer`
* `signalType`
* `summary`
* `whatYouNotice`
* `whyItMatters`
* `whatItUsuallyIndicates`
* `severity`
* `frequency`
* `detectability`
* `whatToCheckNext`
* `likelyConsequences`
* `patternConfidence`

### Why these are required

Without them, the entry cannot reliably answer:

* what the warning signal is
* where and what kind of signal it is
* why it should be taken seriously
* what it likely points to
* what a reader should do next
* what happens if it is ignored

---

## Optional but Strongly Recommended Fields

These fields are technically optional but should usually exist in strong entries:

* `decisionHeuristic`
* `notNecessarilyAProblemWhen`
* `commonContexts`
* `leadingIndicators`
* `diagnosticQuestions`
* `commonRootCauses`
* `antiPatterns`
* `falseFriends`
* `ownerMostLikelyToNotice`
* `ownerBestPlacedToAct`
* `timeHorizon`
* `aiAmplifies`
* `aiMasks`
* `aiSpecificNotes`
* `exampleSignals`
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

Human-readable display title. Should be crisp and signal-like.

Examples:

```json
"title": "Ownership is claimed but not visible"
```

```json
"title": "Generated code is merged without deep review"
```

---

### `layer`

Primary axis — *where* the signal appears. Must be one of the canonical layers (see above).

Example:

```json
"layer": "team"
```

### `signalType`

Secondary axis — *what kind* of signal it is. Must be one of the canonical signal types (see above).

Example:

```json
"signalType": "behavioral"
```

---

### `summary`

A concise one- to two-sentence editorial summary. Explains why the signal matters.

Example:

```json
"summary": "A team says a system is owned, but responsibility is not visible in routing, decisions, or maintenance. This often signals accountability drift rather than healthy shared ownership."
```

---

### `decisionHeuristic`

A single short directional heuristic: how to think about this signal when it appears. One sentence. Not a rule.

Example:

```json
"decisionHeuristic": "Treat invisible ownership as unowned until something observable says otherwise."
```

---

### `whatYouNotice`

A plain-language statement of the observable warning signal — in real team language.

This is one of the most important fields. It should describe the signal in concrete, recognisable terms.

Example:

```json
"whatYouNotice": "People keep asking the same person what to do, even in areas that are supposedly team-owned."
```

This field renders prominently near the top of the page.

---

### `whyItMatters`

A short explanation of why this signal deserves attention: what kind of system weakness it implies.

Example:

```json
"whyItMatters": "Because repeated routing to one person often means the system is less resilient, less documented, and less transferable than it appears."
```

---

### `whatItUsuallyIndicates`

Array of likely underlying issues the signal points to. Diagnostic, not deterministic.

Example:

```json
"whatItUsuallyIndicates": [
  "ownership drift",
  "knowledge concentration",
  "boundary ambiguity"
]
```

### `notNecessarilyAProblemWhen`

Array of conditions under which the signal is not cause for concern. Keeps the entry honest and non-absolutist.

Example:

```json
"notNecessarilyAProblemWhen": [
  "the expert is temporarily onboarding others and that rotation is visible",
  "the area is genuinely niche and concentration is explicit"
]
```

### `commonContexts`

Array of environments where this signal commonly appears. Helps readers calibrate.

Example:

```json
"commonContexts": [
  "fast-growing teams where ownership lagged behind hiring",
  "platform areas without clear internal customer"
]
```

---

## Severity / Frequency / Detectability

### `severity`

Editorial severity of the signal if it is real and persistent.

Allowed values:

* `low`
* `medium`
* `medium-high`
* `high`
* `critical`

Meaning:

This expresses how dangerous the signal tends to be **if it is real and persistent**, not how dramatic it sounds.

`medium-high` is a deliberate notch for signals that are clearly more than medium but not yet high. It is not a general-purpose hedge; prefer `medium` or `high` when either genuinely applies.

### `frequency`

How commonly the signal appears in real software environments. Uses the site-wide canonical frequency enum.

The enum accepts **two kinds of values** — five ordered ladder positions, plus one trend flag. See `docs/schema-failure-modes.md#frequency` for the full rationale; the discipline is shared across every category that uses `FrequencyEnum`.

Ladder positions (ordered, rare → universal):

* `rare`
* `occasional`
* `common`
* `very common`
* `universal`

Trend flag (not a ladder position):

* `increasing` — flags patterns whose prevalence is rising. Rendered as a trend chevron (↗), not a bar ladder.

> `uncommon` has been removed from the enum. Do not reintroduce it.

### `detectability`

How easy the signal is to notice before the underlying issue becomes serious.

Canonical allowed values:

* `obvious`
* `visible-if-you-look`
* `subtle`
* `easy-to-normalize`

Meaning:

* `obvious` — noticed by most observers
* `visible-if-you-look` — visible if someone is paying attention
* `subtle` — present but easy to miss
* `easy-to-normalize` — looks normal/healthy on the surface and often gets rationalised away

`easy-to-normalize` is the hardest case and is important to preserve. Many damaging red flags are *seen* but not *registered*.

---

## Diagnostic Progression Fields

These fields give the entry an investigative shape, not just a warning.

### `leadingIndicators`

Array of earlier / weaker signs that often precede the red flag itself.

### `diagnosticQuestions`

Array of questions to ask when the signal is suspected. These should be inspectable, not rhetorical.

### `whatToCheckNext`

**Required.** Array of concrete follow-up inspections. Turns the entry into a usable diagnostic tool.

Example:

```json
"whatToCheckNext": [
  "Who actually owns incidents, roadmap, and docs for this area?",
  "How many people can safely modify this subsystem?",
  "What happens when the usual expert is unavailable?"
]
```

### `commonRootCauses`

Array of the structural or organisational causes that tend to sit underneath this signal.

### `likelyConsequences`

**Required.** Array of downstream consequences if the signal is ignored. Connects the red flag to future failure without fully becoming a Failure Mode entry.

### `antiPatterns`

Array of weak / harmful reactions teams tend to have to this red flag (normalising it, adding reporting without structural change, overreacting with blanket rules, etc.).

### `falseFriends`

Array of things this signal is commonly mistaken for, and signs that could make the situation look less dangerous than it is. Combines *often confused with* + *counter-signals* into one honest field.

Example:

```json
"falseFriends": [
  "healthy collaboration",
  "strong engineering standards",
  "rotation and backup ownership are visible and working"
]
```

---

## Ownership / Timing Fields

### `ownerMostLikelyToNotice`

Array of roles who usually spot the signal earliest.

Example:

```json
"ownerMostLikelyToNotice": ["tech lead", "senior engineer", "support lead"]
```

Always an array — not a string, not a prose paragraph.

### `ownerBestPlacedToAct`

Array of roles best positioned to act on the signal. Distinct from `ownerMostLikelyToNotice` — the noticer is often not the fixer.

Example:

```json
"ownerBestPlacedToAct": ["engineering manager", "architect"]
```

Always an array.

### `timeHorizon`

A short string describing how quickly the signal needs attention (e.g. "weeks", "one quarter", "immediate").

---

## AI Fields

Red Flags often benefit from AI-specific treatment because AI can:

* amplify warning signals
* hide warning signals behind polished output
* make some issues harder to detect
* make some inspections easier

Red Flags keep their stronger, more specific AI effect names — `aiAmplifies` and `aiMasks` — instead of the cross-site `aiCanHelpWith` / `aiCanMakeWorseBy` pair, because the red-flag framing is specifically about **whether AI inflates the signal or hides it**. The synthesis field uses the site-wide canonical name.

### `aiAmplifies`

Array of ways AI makes this signal worse, faster, or more common.

Example:

```json
"aiAmplifies": [
  "generated code increases surface area faster than ownership can follow"
]
```

### `aiMasks`

Array of ways AI hides or flattens this signal (polished output, plausible reviews, apparent activity).

Example:

```json
"aiMasks": [
  "AI-assisted PRs look reviewed because comments are thorough, even when no human deeply engaged"
]
```

### `aiSpecificNotes`

A short synthesis string explaining how AI changes this red flag in practice.

Both `aiAmplifies` and `aiMasks` are **arrays only** — no scalar / array union. `aiSpecificNotes` is a string (matches the site-wide AI synthesis convention).

Do not force AI commentary into every entry. But include it whenever AI materially changes how the signal behaves.

---

## Cross-Reference Fields

Red Flags carry four slug-based cross-references:

* `relatedFailureModes`
* `relatedTechDecisions`
* `relatedPlaybooks`
* `relatedRedFlags`

These should contain slugs wherever possible.

Example:

```json
"relatedFailureModes": ["hero-trap", "ownership-drift"]
```

Cross-links should be meaningful and diagnostic, not inflated.

Examples:

* a red flag about weak ownership may link to failure modes about hero dependence or ownership drift
* a red flag about review quality may link to an AI playbook on code review
* a red flag about contract ambiguity may link to a decision like backward compatibility vs faster evolution

---

## `exampleSignals`

Array of phrases, status language, or recurring statements that often accompany the flag.

Example:

```json
"exampleSignals": [
  "Ask Alex, they know that part.",
  "We just need a bit more alignment.",
  "It’s owned by the team."
]
```

Especially useful for team, leadership, process, and AI-related red flags.

---

## `patternConfidence`

Allowed values:

* `low`
* `medium`
* `medium-high`
* `high`

Meaning: editorial confidence that this signal is recognisable, useful, and stable enough to stand as a structured warning pattern.

Most broad and repeated red flags will likely be `high`. More emerging AI-specific signals may be `medium` or `medium-high`.

---

## Rendering Expectations

The Red Flags UI emphasises recognition and diagnosis.

### A good entry page should make these sections obvious:

* title + layer + signal type
* summary + decision heuristic
* what you notice + why it matters
* severity / frequency / detectability
* what it usually indicates + not-necessarily-a-problem-when
* leading indicators + diagnostic questions + what to check next
* common root causes + likely consequences
* anti-patterns + false friends
* ownership (notice vs act) + time horizon
* AI effects (amplifies / masks / specific notes)
* example signals
* related entries

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
* `layer` is one of the canonical `category.layers`
* `signalType` is one of the canonical `category.signalTypes`
* `severity` is one of `low | medium | medium-high | high | critical`
* `frequency` is in the canonical FrequencyEnum
* `whatYouNotice`, `whatItUsuallyIndicates`, `whatToCheckNext`, `likelyConsequences` are present and non-empty
* `ownerMostLikelyToNotice` and `ownerBestPlacedToAct`, when present, are arrays
* `aiAmplifies` and `aiMasks`, when present, are arrays
* `aiSpecificNotes`, when present, is a string (legacy `aiSpecificVariant` is an error)
* `patternConfidence` is one of `low | medium | medium-high | high`
* all `related*` slugs resolve where slug-based references are used

Recommended additional validation:

* `whatYouNotice` must be non-empty
* `summary` should be concise, not essay-length
* `whatToCheckNext` should contain actionable items, not vague principles

---

## Quality Standard

A strong Red Flag entry should make the user feel:

* I have seen this before
* this is more precise than a vague concern
* now I know what to inspect next
* this helps me talk about the issue earlier and better

## One-Sentence Rule

**A Red Flag entry should make a weak signal legible early enough that a team can investigate before it hardens into a failure mode.**
