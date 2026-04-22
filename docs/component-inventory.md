# Component Inventory — nosilverbullet.dev

## Purpose

This document defines the expected reusable component families for nosilverbullet.dev.

It exists to help implementation stay:

* structured
* reusable
* category-aware
* consistent across the site
* resistant to page-by-page duplication

This is not a final component API spec.
It is a **component planning document**.

It answers:

* what component types the product likely needs
* which components should be shared
* which components may vary by category
* which components should not be reinvented repeatedly

---

## Core Principle

Components should be extracted based on **content structure and repeated UI behavior**, not just because something appears twice.

That means:

* share stable structural primitives
* allow category-specific sections where schema genuinely differs
* do not over-generalize too early
* do not duplicate core patterns across categories once they are proven reusable

The component system should support one coherent product with four content families.

---

## Component Layers

The component system should be thought of in five layers:

1. **App shell components**
2. **Navigation and routing components**
3. **Shared content presentation primitives**
4. **Category landing/index components**
5. **Category-specific detail components**

This separation helps avoid both over-abstraction and duplication.

---

## 1. App Shell Components

These support the overall product frame.

### `SiteShell`

Purpose:

* global page frame
* consistent outer spacing
* stable product-level structure

Should likely contain:

* main content container
* header/nav slot
* page content slot
* optional footer or meta area

### `SiteHeader`

Purpose:

* main site identity
* primary navigation
* stable top-level entry point

Should support:

* logo/title
* category navigation
* optional utility links

### `SiteFooter`

Optional for v1.
Purpose:

* low-emphasis supporting site links
* attribution / method / supporting navigation if needed

### `PageContainer`

Purpose:

* shared max-width and page rhythm wrapper
* reduce repeated layout code across page types

---

## 2. Navigation and Routing Components

These support movement through the reference system.

### `PrimaryNav`

Purpose:

* route between the four categories and core pages

### `Breadcrumbs`

Purpose:

* orient the user on detail pages
* reflect the route model clearly

Expected pattern:

* Home / Category / Entry Title

### `CategoryNav`

Optional.
Purpose:

* local category navigation or quick jumps within category pages

### `AnchorNav`

Optional, but useful for long detail pages.
Purpose:

* jump between major sections on detail pages

Use only if it improves long-form usability.

---

## 3. Shared Content Presentation Primitives

These are the most important shared components.

They should be reused wherever the same structural concept exists.

### `SectionHero`

Purpose:

* category page intro block
* possibly homepage category preview intro

Should support:

* eyebrow / code
* title
* summary
* optional metadata or counts

### `EntryCard`

Purpose:

* reusable browse/index card for one content entry

Should support:

* title
* summary
* category or subcategory marker
* compact metadata
* route target

May need variants per category.

### `EntryMetaRail`

Purpose:

* structured metadata block on detail pages

Useful for:

* severity
* frequency
* category
* owner
* stage
* confidence
* related quick facts

Should not be hardcoded to one category only.

### `SectionBlock`

Purpose:

* consistent wrapper for major detail-page sections

Should support:

* section label or code
* title
* body slot
* optional side label treatment

Useful for strong editorial/reference rhythm.

### `ListBlock`

Purpose:

* render structured arrays cleanly and consistently

Useful for:

* signals
* causes
* mistakes
* questions
* follow-up actions
* heuristics

### `NarrativeBlock`

Purpose:

* render paragraph-based narrative sections

Useful for:

* summaries
* story arcs
* explanation sections

### `RelatedEntriesBlock`

Purpose:

* show related content links across categories

Should support:

* category-aware rendering
* list of resolved references
* optional grouping by category

### `AiImpactBlock`

Purpose:

* render AI-specific fields consistently where they exist

Should support:

* positive leverage
* negative distortion
* synthesis note

### `TagOrLabelStrip`

Optional.
Purpose:

* small metadata cues where useful

Use carefully.
Do not let the site drift into pill overload.

---

## 4. Category Landing / Index Components

These support browse mode inside each category.

### `CategoryPageHeader`

Purpose:

* category-specific landing intro
* short orientation to the section

### `FilterBar`

Purpose:

* filter by subcategory or other lightweight facets

Should remain simple for v1.

### `EntryIndexGrid`

Purpose:

* render category entries as a browsable collection

May support:

* grid layout
* list layout
* responsive adaptation

### `IndexStatsBlock`

Optional.
Purpose:

* show counts or simple overview figures for a category landing page

Should be used only if it clarifies browsing, not as dashboard decoration.

### `CategoryIntroPanel`

Optional.
Purpose:

* richer category explanation on landing pages

Useful if a category benefits from a slightly deeper explanation before the index.

---

## 5. Category-Specific Detail Components

These components are expected to vary because the schemas differ meaningfully.

---

## Failure Modes Components

Failure Modes require the richest narrative + diagnostic structure.

### `FailureModeSnapshot`

Purpose:

* quick orientation block for what the mode is
* category, severity, frequency, stage, mistaken-for, intervene point

### `FailureModeStoryArc`

Purpose:

* render the narrative sequence:

  * starts
  * feels reasonable because
  * escalates
  * ends

### `WarningSignsByStage`

Purpose:

* render early / mid / late warning signals clearly

### `FailureModeCauses`

Purpose:

* render why the pattern happens

### `FailureModeResponse`

Purpose:

* render immediate actions, structural fixes, and what not to do

### `FailureModeFieldNotes`

Optional but highly valuable.
Purpose:

* render quote, speaker, counter-move, false positive

---

## Tech Decisions Components

Tech Decisions require comparison-first structures.

### `DecisionCoreTradeoff`

Purpose:

* render the main trade-off statement prominently

### `OptionComparison`

Purpose:

* compare option A and option B in parallel

Should support:

* names
* summaries
* best when
* strengths
* costs
* failure modes
* natural-fit examples

### `HiddenVariablesBlock`

Purpose:

* render contextual variables that materially change the answer

### `DecisionHeuristicsBlock`

Purpose:

* render compact practical heuristics

### `QuestionsToAskBlock`

Purpose:

* render the key evaluation questions prominently

This should be one of the strongest parts of the decision page.

---

## Red Flags Components

Red Flags require rapid recognition and inspection support.

### `RedFlagSignalHeader`

Purpose:

* render the signal clearly and fast

### `SignalMetaPanel`

Purpose:

* render severity, frequency, detectability

### `ShowsUpAsBlock`

Purpose:

* concrete manifestations of the flag

### `UsuallyIndicatesBlock`

Purpose:

* likely underlying conditions

### `InspectNextBlock`

Purpose:

* diagnostic next steps

### `IfIgnoredBlock`

Purpose:

* likely downstream consequences

### `CounterSignalsBlock`

Optional but strongly useful.
Purpose:

* show what would make the concern less severe or less certain

---

## Engineering Playbook Components

Engineering Playbook requires procedural clarity.

### `PlaybookSituationHeader`

Purpose:

* render the situation, goal, and use-when frame

### `UseWhenBlock`

Purpose:

* show applicability conditions

### `RolesAndOwnershipPanel`

Purpose:

* render roles involved, primary owner, time horizon, difficulty

### `WhatGoodLooksLikeBlock`

Purpose:

* render success-state conditions

### `StepFlow`

Purpose:

* render the ordered step objects cleanly

Should support:

* step number
* title
* purpose
* actions
* outputs

### `DecisionPointsBlock`

Purpose:

* render judgment moments inside the playbook

### `ArtifactsBlock`

Purpose:

* show outputs or artifacts to produce

### `SuccessSignalsBlock`

Purpose:

* render observable signs that the playbook is working

---

## Cross-Category Shared Patterns

These patterns should stay consistent across categories where they appear.

### Metadata presentation

If a field behaves like metadata, it should render in a consistent visual family.

### Related entries

Cross-references should feel like one system across all categories.

### AI effects

AI sections should feel related across categories, even if content differs.

### Section labeling

Section blocks should share a structural language so pages feel related.

---

## Components to Avoid Creating Too Early

These are tempting but should wait until the system proves they are needed.

### `UniversalEntryRenderer`

Avoid building one giant renderer for all category types.
It will usually become too abstract and too fragile.

### `ConfigDrivenMegaTemplate`

Avoid trying to drive every page through one giant layout config too early.

### `EverythingCard`

Avoid making one master card component that handles all browse cases in the first pass.
Some category-specific card variation is healthy.

### `HyperFlexibleMetadataComponent`

Avoid giant prop surfaces that make metadata rendering obscure.
Prefer smaller, clearer structural components.

---

## Suggested Component Priority

Build components in this order:

### First priority

* `SiteShell`
* `SiteHeader`
* `PageContainer`
* `SectionHero`
* `EntryCard`
* `EntryMetaRail`
* `SectionBlock`

### Second priority

* Failure Modes-specific components for the first vertical slice

### Third priority

* `RelatedEntriesBlock`
* `AiImpactBlock`
* category-specific blocks for Tech Decisions

### Fourth priority

* Red Flags and Engineering Playbook specific blocks

### Fifth priority

* optional navigation helpers, search UI, or enhanced browse components

---

## Extraction Rule

Do not extract a component just because something appears twice.
Extract when:

* the same structural idea repeats
* the rendering logic is meaningfully shared
* reuse will reduce drift
* category identity will not be flattened by the extraction

A component should earn its existence.

---

## Acceptance Questions for New Components

Before adding or extracting a component, ask:

1. Is this a real repeated structural pattern?
2. Does extracting it reduce duplication or drift?
3. Does it preserve schema clarity?
4. Does it keep category-specific meaning intact?
5. Is the component easier to understand than the duplicated code it replaces?

If not, do not extract yet.

---

## One-Sentence Rule

**Build shared components around repeated knowledge structures, not around the convenience of the current page.**

