# Build Rules — nosilverbullet.dev

## Purpose

This document defines the working rules for building nosilverbullet.dev.

It exists to keep implementation:

* consistent
* maintainable
* data-driven
* aligned with the product and design direction
* resistant to drift during AI-assisted development

This is not a style guide for content.
This is a **build discipline document**.

It should help answer:

* what builders are allowed to change
* what must remain stable
* how to avoid architectural drift
* how to avoid generic AI-generated implementation behavior
* how to make progress without breaking coherence

---

## Core Build Principle

Build the site as a **structured reference system**, not as a collection of pretty pages.

That means:

* data models come first
* templates come before page-specific improvisation
* shared components come before duplication
* one strong system is better than four disconnected category sites

If an implementation choice makes the product feel more fragmented, more generic, or less data-driven, it is probably the wrong choice.

---

## Deployment Constraint

Primary deployment target:
- **Cloudflare Pages**
- **Free plan preferred**

This project should be built to work as a **pure static site** by default.

That means:
- no backend required for core functionality
- no database
- no server-side rendering requirement
- no authentication-dependent experience for v1
- no runtime API dependency for page rendering
- no Pages Functions unless there is a clear, approved reason

The site should render from:
- static routes
- build-time content
- structured local JSON content
- static assets

If a feature requires runtime server logic, it should be treated as an exception and justified explicitly.

Default assumption:
**Everything should work as static output deployable on Cloudflare Pages Free.**

---

## Source of Truth Order

When building, use this priority order:

1. `docs/product-brief.md`
2. `docs/content-schema.md`
3. category-specific schema docs
4. `docs/design-direction.md`
5. actual JSON content
6. implementation convenience

If implementation convenience conflicts with the product, schema, or design direction, convenience loses.

---

## Non-Negotiable Rules

### 1. Do not invent schema casually

Do not:

* add new content fields without reason
* rename shared fields casually
* create near-duplicate field names
* reshape content models because one component is inconvenient

If schema needs to change, it should be done intentionally and documented.

### 2. Do not hardcode content that already exists in JSON

If content exists in structured form, render from structured data.

Avoid:

* hardcoded summaries
* hardcoded metadata
* hardcoded lists that duplicate source content
* page-specific text embedded directly in components when it belongs in content

### 2a. Do not introduce backend requirements casually
Do not add features that require server runtime, database access, or dynamic backend infrastructure unless explicitly approved.

### 3. Do not redesign the product page by page

The site must feel like one system.

Do not:

* create a new visual language for each page
* let one category drift into a separate product aesthetic
* redesign shared layout patterns ad hoc during feature work

### 4. Do not default to generic SaaS UI patterns

Avoid implementation drift toward:

* oversized hero sections
* startup-style cards everywhere
* pill/chip overload
* generic dashboard sections
* glossy template-like component systems

### 5. Do not optimize for speed at the cost of structure

A fast but messy implementation is worse than a slower but reusable one.

Prefer:

* reusable templates
* typed data rendering
* stable component boundaries
* explicit layout systems

---

## Build Strategy Rules

### Build in phases

The correct implementation sequence is:

1. docs and contracts
2. app architecture
3. shared types and loaders
4. one vertical slice
5. refinement
6. shared component extraction
7. category expansion
8. cross-links / search / polish

Do not jump straight to full-site implementation.

### Start with one vertical slice

The first complete implementation should cover:

* homepage preview of one category
* one category landing page
* one full detail page
* real JSON rendering
* reusable component logic

Only after this is strong should the rest expand.

### Prefer refinement over repeated rewrites

Once a page or template exists, improve it through:

* refactoring
* extraction
* alignment
* structural cleanup

Do not repeatedly rebuild major sections from scratch unless clearly necessary.

---

## Architecture Rules

### Data first

The site should be built around typed structured content.

Core expectations:

* each category has a typed entry model
* routes are slug-driven
* rendering is template-driven
* related content is resolved through structured references

### Static-first architecture is mandatory

The site must be designed as a static-first system.

Required architectural assumptions:
- routes should be statically generated where possible
- content should be loaded from local structured files at build time
- page rendering should not depend on a live server
- cross-links should resolve from local content data
- browse and detail pages must work without runtime backend logic

Avoid:
- server-only rendering paths
- runtime content fetching for core page content
- backend search for v1
- personalized or session-dependent rendering
- architecture that assumes a persistent server process

If search is added in v1, prefer:
- static index generation
- client-side search over prebuilt data over runtime query infrastructure.

### Shared types are mandatory

Define shared types/interfaces for:

* top-level category payloads
* each entry type
* related references
* shared UI blocks where appropriate

Do not rely on loose untyped object access for core rendering.

### Slug is canonical

Use `slug` as the canonical identity for routing and cross-linking.

Do not build parallel identity systems unless truly needed.

### Cross-links should resolve from data

Related items must resolve from structured references where possible.

Do not hardwire cross-links into component code.

---

## Component Rules

### Prefer reusable primitives

Create shared primitives for recurring patterns such as:

* section hero
* entry index/list block
* metadata rail
* detail page sections
* cross-reference block
* signal block
* step block
* AI impact block

Do not clone similar structures across categories if the difference is mostly styling or field mapping.

### Allow category-specific variants where needed

Not every category should use the exact same detail-page layout.

But differences should be:

* intentional
* driven by content structure
* implemented through variants or composable sections

Not by creating totally separate unrelated page systems.

### Components should reflect schema, not fight it

A good component should map naturally to structured content.

Avoid components that require:

* lots of conditional guessing
* shape rewriting in the view layer
* hidden hardcoded fallback text

---

## Content Rendering Rules

### Respect the structure of the content

If content is:

* a list, render it as a list
* a stage object, render it by stage
* a comparison, render it comparatively
* a step flow, render it procedurally

Do not flatten strong structured data into generic text blocks.

### Avoid markdown-dump pages

Even when content is textual, detail pages should still feel structured.

Avoid:

* giant unbroken narrative blocks
* markdown-looking pages with weak hierarchy
* article-style layouts for highly structured entries

### Preserve editorial meaning

Do not simplify away meaningful fields such as:

* `coreTradeoff`
* `whatToInspectNext`
* `warningSigns`
* `decisionPoints`
* `counterSignals`
* `whatGoodLooksLike`

These are not extra decoration.
They are the product.

---

## Design Implementation Rules

### Follow design direction over default framework style

The implementation must follow `docs/design-direction.md`, not the default instincts of component libraries.

When in doubt:

* prefer stronger typography
* prefer cleaner structure
* prefer manual-like layout
* prefer reference clarity over generic modern softness

### Use visual restraint

Do not solve design problems mainly with:

* more shadows
* more rounded corners
* more color
* more gradients
* more decorative effects

Solve them with:

* hierarchy
* spacing
* alignment
* contrast
* labeling
* composition

### Category identity must remain controlled

Category differences should come through:

* accent logic
* layout emphasis
* metadata behavior
* content presentation

Not through product fragmentation.

---

## Responsiveness Rules

### Preserve structure on smaller screens

Responsive behavior should:

* preserve hierarchy
* preserve metadata meaning
* preserve section logic
* preserve category identity

Do not reduce the mobile experience to generic stacked cards if that erases the reference-system feel.

### Long-form pages must remain navigable

On smaller screens, make sure:

* titles remain distinct from metadata
* sections remain visually separated
* long pages still have rhythm
* dense content does not collapse into clutter

---

## Accessibility Rules

Accessibility is part of the quality bar.

Implementation expectations:

* semantic headings
* meaningful landmarks where appropriate
* accessible interactive controls
* good contrast
* no meaning carried by color alone
* keyboard-usable interactions
* readable text sizes and spacing

Because this is a reference product, readability and accessibility are tightly linked.

---

## AI-Assisted Build Rules

This project may be built heavily with AI help, so the build rules must explicitly guard against AI implementation failure modes.

### Do not accept polished generic output by default

AI-generated UI often looks:

* clean
* modern
* complete

But may still be:

* structurally weak
* too generic
* over-componentized in the wrong way
* inconsistent with the design direction

Every generated result must be judged against the docs, not against whether it “looks fine.”

### Do not let AI invent product direction mid-build

AI can drift into:

* SaaS patterns
* marketing patterns
* dashboard patterns
* random redesigns

Builders must keep the original direction stable.

### Prefer bounded prompts

When using AI tools like Windsurf, prefer prompts such as:

* implement this page using existing contracts
* refactor this into reusable primitives
* improve this layout without changing the data model
* align this page with the design direction

Avoid prompts such as:

* redesign the site
* make it premium
* make it more modern
* make it better

---

## Review Checkpoints

Stop and review after these milestones:

### 1. After implementation plan

Check:

* architecture logic
* route model
* component model
* phasing

### 2. After scaffolding

Check:

* folder structure
* data loading structure
* shared types
* route setup

### 3. After first vertical slice

Check:

* real content rendering
* detail page quality
* browse/detail continuity
* design fit

### 4. After shared extraction

Check:

* duplication removal
* component boundaries
* over-abstraction risk

### 5. After each category expansion

Check:

* category identity
* schema fidelity
* system cohesion
* design drift

### 6. Before final polish

Check:

* responsiveness
* accessibility
* performance
* metadata and SEO

---

## Anti-Drift Rules

If the product starts feeling like any of these, stop and correct course:

* startup site
* docs portal with personality glued on later
* dashboard app
* AI-generated design showcase
* inconsistent page family
* category-specific mini-sites

Correction should usually happen by:

* strengthening structure
* improving page templates
* tightening typography and layout
* removing generic UI patterns
* reusing stronger shared primitives

Not by adding more effects.

---

## Acceptance Standard for New Work

Before accepting any new page, section, or major component, check:

1. Does it align with the product brief?
2. Does it respect the content schema?
3. Does it feel like part of one coherent product?
4. Does it avoid generic SaaS/UI-template drift?
5. Does it improve clarity, navigation, or usefulness?
6. Is it data-driven where it should be?
7. Is it maintainable and reusable?

If not, revise before expanding.

---

## One-Sentence Rule

**Build the system so the structure of the knowledge remains stronger than the convenience of the implementation.**

