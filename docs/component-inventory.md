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

### `MetaRail`

(Implemented as `src/components/MetaRail.astro`. Earlier drafts of this doc called it `EntryMetaRail` — the final name drops the `Entry` prefix.)

Purpose:

* structured metadata block on detail pages, rendered as a framed horizontal strip at the top of the entry

Useful for:

* severity (with color-tinted cell and bar ladder)
* frequency (bar ladder for ladder values, trend chevron for `increasing`)
* lifecycle (list, no bar ladder — intentionally, because it's not an ordinal)
* recovery and pattern confidence (bar ladders)

Each cell may optionally carry:

* `severity` — tints the cell with the matching `--sev-*` token from the grayscale severity ramp
* `scale: { total, filled }` — renders a rising-bar indicator under the value, driven by the shared `FREQUENCY_SCALE` / `RECOVERY_SCALE` / etc. in `src/lib/attribute-scales.ts`
* `trend: "increasing"` — renders the trend chevron in place of the bar ladder for frequency values that are trajectories rather than ladder positions

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

### `RelatedEntries`

(Implemented as `src/components/RelatedEntries.astro`. Earlier drafts of this doc called it `RelatedEntriesBlock` — the final name drops the `Block` suffix.)

Purpose:

* show related content links across categories, using the shared cross-reference resolver so every link is either real + resolved or explicitly marked as a pending editorial placeholder

Supports:

* `refs` — raw slug array from content (mixed resolved / pending allowed)
* `expectCategory` — category that should be primary; resolved refs outside this category are still rendered, but in a visually-grouped "Also relevant" subhead
* `dense` — tighter treatment when multiple related blocks stack

Each link renders the target entry's catalog reference code (e.g. `FM-05`, `TD-045`) as a two-span "cat · num" prefix. **These numbers are the target entry's own catalog index**, not a locally-reset counter, so the `FM-05` you see in a related block on one page is the same `FM-05` stamped on that target entry's own masthead. See `docs/content-schema.md#catalog-reference-codes`.

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

## 3b. Implemented shared components (current snapshot)

This section catalogs components that exist in `src/components/` today but were not in the original aspirational inventory above. They emerged during the first vertical slice (Failure Modes) and should be reused by the remaining three categories rather than reinvented.

### `SectionIndex`

(`src/components/SectionIndex.astro`)

Purpose:

* local navigation rail for long detail pages, rendered as:
  * a sticky left-hand rail at ≥1080px
  * a compact collapsible `<details>` jump menu at narrower widths

Features:

* static-first — works fully without JavaScript
* progressive-enhancement **scroll-spy** — an inline `IntersectionObserver` module highlights the currently-visible section as the reader scrolls, mirroring the highlight in both the mobile menu and desktop rail

> **Implementation gotcha:** Astro compiles `<script>` tags to ES modules by default, and `document.currentScript` is `null` inside modules. The original version of this component's scroll-spy used `currentScript?.previousElementSibling` to find the nav and silently no-op'd in production for weeks. The current version uses `document.querySelectorAll('.nsb-section-index')` and iterates. Any future progressive-enhancement script in this codebase should do the same — do not rely on `currentScript`.

### `SectionHeader`

(`src/components/SectionHeader.astro`)

Purpose:

* numbered section header for detail pages (`01 · DEFINITION`, `02 · HOW IT UNFOLDS`)
* stamps the `id` that `SectionIndex`'s anchors target and that the scroll-spy observes

### `OperatorNotes`

(`src/components/OperatorNotes.astro`)

Purpose:

* FM-specific "things an operator learns after the third incident" panel
* hosts `bestMomentToIntervene`, `counterMove`, `falsePositive` as a typed register of hard-won annotations
* two-column layout: mono label (with optional italic hint) on the left, serif body on the right

### `HeardInTheWild`

(`src/components/HeardInTheWild.astro`)

Purpose:

* surface a representative `commonQuote` from an entry as a field-recording-style voice panel
* dark plate variant for dramatic contrast with the surrounding prose

### `WarningSignsByStage`

(`src/components/WarningSignsByStage.astro`)

Purpose:

* render `warningSigns.{early,mid,late}` arrays as a three-stage editorial block
* each stage gets its own column/row with escalating visual weight

### `KeywordList`

(`src/components/KeywordList.astro`)

Purpose:

* compact dot-separated list of short phrases (alternative names, first noticers, etc.)
* used inside `AT A GLANCE` cells on FM detail pages

### `CalloutBand`

(`src/components/CalloutBand.astro`)

Purpose:

* horizontal callout strip with a colored label band + prose slot
* used for `mistakenFor` / `oftenMistakenAs` / AI synthesis notes and homepage special-section markers

### `Tag`

(`src/components/Tag.astro`)

Purpose:

* small framed label with category / severity / status variants
* used in masthead pill rows, eyebrow rows, and meta-bits on cards

### `NumberCard`

(`src/components/NumberCard.astro`)

Purpose:

* stat card — label above a giant zero-padded numeral (`ENTRIES / 32`)
* used on category landing hero strips

> The homepage hero rail no longer uses `NumberCard`; it renders the two hero stats (`Sections`, `Entries`) as bespoke cells inside `.nsb-home__hero-stats` so their padding aligns with the adjacent columns' shared `.nsb-home__hero-col` padding. Category landing pages still use `NumberCard` for their hero strips.

### `Stamp`

(`src/components/Stamp.astro`)

Purpose:

* rubber-stamp-style label (e.g. `AT A GLANCE`)
* used where a label needs a tactile, field-manual-index feel

### `AttrGlyph`

(`src/components/AttrGlyph.astro`)

Purpose:

* single-source inline SVG component for the site's small mono-line glyphs
* currently used only for the `increasing` trend chevron (↗) on the Frequency attribute

> A wider set of attribute-type glyphs (severity triangle, frequency tally marks, recovery staircase, confidence bullseye) was prototyped and rejected: per-attribute icons on label cells read as dashboard decoration rather than editorial signal. The `AttrGlyph` component retains the full glyph set in its frontmatter in case a future use case needs one, but only the trend chevron is rendered today. If reaching for an attribute-type icon in future work, reread the rationale before shipping.

### `Pending` (status)

Not a component — a shared convention. Cross-references that point to entries not yet authored are rendered by `RelatedEntries` with a `PEND` marker in the same list structure as resolved entries. The placeholder slot stays honest rather than hidden, matching the catalog-first voice of the site.

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
* `MetaRail`
* `SectionBlock`

### Second priority

* Failure Modes-specific components for the first vertical slice

### Third priority

* `RelatedEntries`
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

