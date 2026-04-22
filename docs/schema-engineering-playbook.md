# Schema — Engineering Playbook

## Purpose

This document defines the category-specific content schema for **Engineering Playbook**.

It should be read together with:

* `docs/content-schema.md`
* `docs/product-brief.md`

This file explains:

* what an Engineering Playbook entry is
* what fields it should contain
* what each field means
* which fields are required vs optional
* how the content should render in the UI

The goal of this schema is to keep Engineering Playbook entries:

* practical
* structured
* reusable
* operationally credible
* useful in real engineering situations

---

## What an Engineering Playbook Entry Is

An Engineering Playbook entry is a structured guide for a **recurring engineering situation**.

It is **not**:

* a blog post
* a motivational leadership article
* a generic checklist
* a company-specific SOP pretending to be universal
* a pure theory page

A Playbook entry should help the user answer:

* what situation am I actually in?
* when does this playbook apply?
* what does good look like here?
* what should I do first?
* what roles matter?
* what mistakes are common?
* what artifacts should exist?
* how do I know it is working?
* how does AI change the situation?

This category is about **practical execution under real constraints**.

---

## Top-Level JSON Convention

Engineering Playbook should follow the shared top-level structure from `docs/content-schema.md`.

Expected top-level shape:

```json
{
  "category": {
    "code": "EP",
    "name": "Engineering Playbook",
    "summary": "Practical playbooks for recurring engineering situations — delivery, architecture, operations, teamwork, and AI adoption.",
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
"code": "EP"
```

---

## Category/Subcategory Values

Recommended Engineering Playbook subcategories:

* `delivery`
* `team`
* `architecture`
* `operations`
* `ai`

These should be listed in:

```json
"category": {
  "categories": ["delivery", "team", "architecture", "operations", "ai"]
}
```

Each entry’s `category` value must match one of these.

---

## Entry Schema Overview

Each Engineering Playbook entry should use this structure:

```json
{
  "slug": "",
  "title": "",
  "situation": "",
  "category": "",
  "summary": "",
  "goal": "",
  "useWhen": [],
  "doNotUseWhen": [],
  "whyThisMatters": "",
  "whatGoodLooksLike": [],
  "inputs": [],
  "rolesInvolved": [],
  "primaryOwner": "",
  "estimatedTimeHorizon": "",
  "difficulty": "",
  "prerequisites": [],
  "steps": [
    {
      "step": 1,
      "title": "",
      "purpose": "",
      "actions": [],
      "outputs": []
    }
  ],
  "decisionPoints": [],
  "commonMistakes": [],
  "warningSignsYouAreDoingItWrong": [],
  "artifactsToProduce": [],
  "successSignals": [],
  "followUpActions": [],
  "metricsOrSignals": [],
  "aiCanHelpWith": [],
  "aiCanMakeWorseBy": [],
  "aiSpecificNotes": "",
  "relatedFailureModes": [],
  "relatedRedFlags": [],
  "relatedTechDecisions": [],
  "relatedPlaybooks": [],
  "examplePromptsOrQuestions": [],
  "patternConfidence": "high"
}
```

This is the preferred schema for the live site.

---

## Required Fields

These fields should be required for every Engineering Playbook entry:

* `slug`
* `title`
* `situation`
* `category`
* `summary`
* `goal`
* `useWhen`
* `whyThisMatters`
* `whatGoodLooksLike`
* `rolesInvolved`
* `primaryOwner`
* `steps`
* `commonMistakes`
* `successSignals`
* `patternConfidence`

### Why these are required

Because without them, the entry cannot reliably answer:

* what situation this playbook solves
* who it is for
* what action path it suggests
* what good looks like
* how success should be recognized

---

## Optional but Strongly Recommended Fields

These fields may be optional technically, but strong entries should usually include them:

* `doNotUseWhen`
* `inputs`
* `estimatedTimeHorizon`
* `difficulty`
* `prerequisites`
* `decisionPoints`
* `warningSignsYouAreDoingItWrong`
* `artifactsToProduce`
* `followUpActions`
* `metricsOrSignals`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiSpecificNotes`
* all `related*` fields
* `examplePromptsOrQuestions`

These fields make the playbook operational rather than generic.

---

## Field-by-Field Definitions

### `slug`

Canonical route identifier.

Example:

```json
"slug": "run-a-phased-migration"
```

Must follow global slug rules.

---

### `title`

Human-readable display title.

This should usually be action-oriented.

Examples:

```json
"title": "Run a phased migration"
```

```json
"title": "Improve release confidence"
```

---

### `situation`

A plain-language statement of the recurring engineering situation.

This should be one of the clearest fields in the entry.
It answers:

* what situation is this playbook for?

Example:

```json
"situation": "You need to replace or move a live system without stopping delivery."
```

This field should render high on the detail page.

---

### `category`

Engineering Playbook subcategory.

Must match an allowed subcategory value.

Example:

```json
"category": "delivery"
```

---

### `summary`

A concise editorial summary of the playbook.

This should explain:

* what this playbook helps do
* how it frames the situation

Example:

```json
"summary": "Move from old to new in controlled slices, where each slice has explicit ownership, cutover criteria, rollback, and retirement of the old path."
```

---

### `goal`

A short statement of the operational goal.

This should answer:

* what is the playbook trying to achieve?

Example:

```json
"goal": "Reduce migration risk by replacing behavior incrementally instead of betting everything on one cutover."
```

---

## `useWhen`

A list of conditions where the playbook applies.

This field is required.

These should be concrete and recognizable, not vague.

Example:

```json
"useWhen": [
  "a legacy system must be replaced or decomposed",
  "a monolith capability is moving into a new service or platform",
  "the existing system is painful but still business-critical"
]
```

This field helps users decide whether they are in the right playbook.

---

## `doNotUseWhen`

A list of cases where this playbook does not fit, or where using it would be misleading.

This is strongly recommended.

This field prevents over-application.

Examples:

* the system is too undefined
* the problem is actually organizational, not technical
* the team is using the playbook to avoid a harder real decision

---

## `whyThisMatters`

A short explanation of why the situation deserves serious attention.

This should answer:

* why does this matter beyond local discomfort?
* what cost, risk, or leverage does this situation create?

Example:

```json
"whyThisMatters": "Most migrations fail because ambition outruns displacement. A phased migration keeps the team focused on moving real behavior, not just producing new code."
```

---

## `whatGoodLooksLike`

A list of concrete outcome conditions that indicate healthy execution.

This field is required.

It should describe observable qualities of success.

Examples:

* the migration is divided into business-meaningful slices
* the team can explain what was retired, not just built
* ownership is explicit
* signals are reviewed regularly

This should render prominently.

---

## `inputs`

A list of things needed to apply the playbook well.

Examples:

* current system map
* dependency inventory
* incident history
* release data
* stakeholder expectations
* existing runbooks

This field is especially useful for operational and architecture playbooks.

---

## `rolesInvolved`

A list of roles that matter in this playbook.

This field is required.

Examples:

* tech lead
* architect
* engineering manager
* product owner
* service owner
* SRE
* QA or quality lead

This should help users understand whether they are the owner, contributor, or stakeholder.

---

## `primaryOwner`

The role most responsible for driving the playbook.

Examples:

```json
"primaryOwner": "tech lead"
```

```json
"primaryOwner": "engineering manager"
```

This field is very useful and should be present in all entries.

---

## `estimatedTimeHorizon`

A short duration estimate for how this playbook usually unfolds.

Examples:

* `hours to days`
* `days to weeks`
* `weeks to months`
* `multi-sprint to multi-quarter`

This should not be over-precise.
Its purpose is expectation-setting.

---

## `difficulty`

A coarse editorial difficulty estimate.

Preferred allowed values:

* `low`
* `medium`
* `medium-high`
* `high`

This expresses how difficult the playbook is to execute well in normal engineering environments.

---

## `prerequisites`

A list of conditions that should exist before the playbook can work well.

Examples:

* shared problem framing
* clear owner exists
* minimum observability exists
* authority exists to make trade-offs
* basic evidence is available

This is especially useful for preventing premature or performative use.

---

## `steps`

A structured ordered list of execution steps.

This field is required.

Preferred object shape:

```json
{
  "step": 1,
  "title": "",
  "purpose": "",
  "actions": [],
  "outputs": []
}
```

### Step field meanings

#### `step`

Numeric order of the step.

#### `title`

Concise name of the step.

#### `purpose`

Why this step exists.
This prevents the playbook from becoming a checklist without reasoning.

#### `actions`

Concrete actions to take.
These should be direct and operational.

#### `outputs`

Artifacts, decisions, or outcomes created by the step.

### Step guidance

A good playbook step should help the reader do real work, not just reflect abstractly.

---

## `decisionPoints`

A list of moments where judgment or trade-offs matter.

Examples:

* what is the first slice?
* who must approve the trade-off?
* what signal is enough to continue?
* what is authoritative versus supporting?

This field is strongly recommended.
It distinguishes a real playbook from a mechanical checklist.

---

## `commonMistakes`

A list of mistakes teams often make while trying to execute this playbook.

This field is required.

These should be playbook-specific.

Examples:

* doing too much at once
* confusing motion with progress
* over-documenting and under-practicing
* softening hard trade-offs
* routing all work back through the same hero

---

## `warningSignsYouAreDoingItWrong`

A list of signals that the playbook is being misapplied or drifting.

This field is strongly recommended.

Examples:

* the same blockers persist after the reset
* docs improved but behavior did not
* ownership is declared but not visible
* the team still cannot explain what changed

This is a very useful field because it helps users self-correct in motion.

---

## `artifactsToProduce`

A list of outputs or artifacts the playbook should create.

Examples:

* migration slice map
* decision log
* runbook
* rollback guide
* handover scope map
* evaluation scorecard

This field is especially valuable in operational, delivery, and AI evaluation playbooks.

---

## `successSignals`

A list of observable signs the playbook is working.

This field is required.

Examples:

* common changes become more local
* the team routes incidents more clearly
* users can verify answers against trusted evidence
* recurring interrupt categories decline

This should help the reader know when they are improving rather than just producing output.

---

## `followUpActions`

A list of actions that should happen after the immediate playbook completes.

Examples:

* promote recurring issues into architecture work
* update onboarding or runbooks
* review again after one month
* repeat on the next hotspot or dependency class

This helps the site feel like a connected system, not isolated fixes.

---

## `metricsOrSignals`

A list of measurements or indicators that can help track progress.

Examples:

* change failure rate
* time to detect issue
* number of effective maintainers
* repeat incident count
* review override rate
* task success rate

This field should be practical, not vanity metrics.

---

## AI Fields

Engineering Playbook often benefits from strong AI treatment because AI changes:

* review behavior
* delivery speed
* migration work
* documentation quality
* evaluation systems
* operational drift
* workflow design

### `aiCanHelpWith`

Array of ways AI may help execute the playbook.

### `aiCanMakeWorseBy`

Array of ways AI can distort, accelerate, or weaken the situation.

### `aiSpecificNotes`

A short synthesis of how AI changes this playbook in practice.

Do not force AI commentary into every entry.
Include it when AI materially changes execution, risk, or observability.

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

Cross-links should be meaningful and useful.

Examples:

* `run-a-phased-migration` may link to the failure mode `friendly-rewrite`
* `improve-release-confidence` may link to red flags about luck-based deployment confidence
* `evaluate-an-ai-feature-against-real-tasks` may link to the tech decision `synthetic-evaluation-vs-real-world-evaluation`

---

## `examplePromptsOrQuestions`

A list of useful framing questions or prompts related to the playbook.

This field is strongly recommended.

It can help readers:

* ask better questions in real meetings
* inspect the situation more clearly
* use the playbook in discussions and planning

Examples:

```json
"examplePromptsOrQuestions": [
  "What is the smallest slice that removes real legacy responsibility?",
  "What hidden behaviors would break users if we forgot them?",
  "What exact signal would tell us to stop or roll back?"
]
```

---

## `patternConfidence`

Use shared allowed values:

* `high`
* `medium`
* `low`

Meaning:
editorial confidence that this playbook is a stable, useful, repeatable pattern for real engineering work.

Most well-established engineering playbooks will likely be `high`.
Some newer AI playbooks may be `medium`.

---

## Rendering Expectations

The Engineering Playbook UI should emphasize structure and execution.

### A good entry page should make these sections obvious:

* title
* situation
* summary
* goal
* when to use / when not to use
* what good looks like
* roles involved / primary owner
* step-by-step execution
* decision points
* common mistakes
* success signals
* artifacts / metrics
* related entries
* AI effects

### Important rendering principle

This category should feel:

* practical
* procedural
* serious
* calm
* reusable

Not:

* inspirational
* fluffy
* too narrative
* vague and principle-only

### UI implication

A Playbook detail page should feel like something a technical person could actually use in a planning session, review, incident follow-up, migration discussion, or team reset.

It should support:

* scan-first reading
* step-by-step execution
* quick identification of owner, signals, and outputs

---

## Validation Expectations

At minimum, validate that:

* every entry has a unique slug
* `category` uses an allowed subcategory
* `steps` exists and is non-empty
* every step object includes `step`, `title`, `purpose`, `actions`, and `outputs`
* `rolesInvolved` is present and non-empty
* `primaryOwner` is present
* `successSignals` is present and non-empty
* `patternConfidence` uses an allowed value
* all `related*` slugs resolve correctly

Recommended additional validation:

* `goal` must be non-empty
* `summary` should be concise, not essay-length
* `useWhen` should contain concrete situations, not vague motivations
* `commonMistakes` should not be empty in strong entries

---

## Example Minimal Valid Entry

```json
{
  "slug": "run-a-phased-migration",
  "title": "Run a phased migration",
  "situation": "You need to replace or move a live system without stopping delivery.",
  "category": "delivery",
  "summary": "Move from old to new in controlled slices, where each slice has explicit ownership, cutover criteria, rollback, and retirement of the old path.",
  "goal": "Reduce migration risk by replacing behavior incrementally instead of betting everything on one cutover.",
  "useWhen": [
    "a legacy system must be replaced or decomposed"
  ],
  "whyThisMatters": "Most migrations fail because ambition outruns displacement.",
  "whatGoodLooksLike": [
    "the migration is divided into business-meaningful slices"
  ],
  "rolesInvolved": [
    "tech lead",
    "architect",
    "service owner"
  ],
  "primaryOwner": "tech lead",
  "steps": [
    {
      "step": 1,
      "title": "Define the migration unit",
      "purpose": "Turn the migration into slices that move real behavior.",
      "actions": [
        "map the current system by business capability"
      ],
      "outputs": [
        "migration slice map"
      ]
    }
  ],
  "commonMistakes": [
    "making the slice too technical"
  ],
  "successSignals": [
    "specific legacy paths are retired on a steady cadence"
  ],
  "patternConfidence": "high"
}
```

---

## Quality Standard

A strong Engineering Playbook entry should make the user feel:

* this is usable in real work
* this understands how engineering situations unfold in practice
* this gives me a path, not just advice
* this respects constraints and trade-offs
* this is operationally credible

## One-Sentence Rule

**An Engineering Playbook entry should help a reader move from a recurring engineering situation to a structured, credible path of action.**

