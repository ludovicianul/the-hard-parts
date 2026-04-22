# Implementation Phases — nosilverbullet.dev

## Purpose

This document defines the recommended execution order for building nosilverbullet.dev.

It exists to ensure that implementation happens in a way that:

* preserves architecture quality
* reduces rework
* keeps the system coherent
* prevents premature expansion
* gives Windsurf a clear sequence of work

This is not a sprint plan.
It is the preferred **build order and decision sequence** for the product.

---

## Core Principle

Build the site in layers.

Do not try to build all categories, all templates, and all features at once.

The correct pattern is:

1. lock direction
2. lock contracts
3. build one strong vertical slice
4. refactor into reusable systems
5. expand carefully
6. polish last

This sequence is important because the main risk is not “can the code be written?”
The main risk is:

* design drift
* schema drift
* duplicated page systems
* generic AI-generated output
* expansion before the core system is strong

---

## Phase 0 — Direction and Contracts

### Goal

Make sure the product, content, routes, architecture, and deployment model are clear before implementation begins.

### Inputs

* `docs/product-brief.md`
* `docs/content-schema.md`
* category schema docs
* `docs/design-direction.md`
* `docs/build-rules.md`
* `docs/deployment-target.md`
* `docs/route-map.md`
* `docs/site-architecture.md`

### Outputs

* aligned documentation set
* no major unresolved schema questions
* stable route model
* stable deployment assumptions

### Exit criteria

* the four categories are clearly defined
* route structure is accepted
* static-first architecture is accepted
* category schemas are accepted
* design direction is clear enough for implementation

### What not to do in this phase

* do not start broad UI implementation
* do not improvise framework-specific patterns before structure is agreed
* do not let tooling decide architecture by default

---

## Phase 1 — Technical Scaffold

### Goal

Create the technical foundation of the site without trying to finish the UI.

### Work in this phase

* choose and initialize the framework
* set up project structure
* create route skeletons
* define TypeScript types for all content models
* implement content loaders and resolvers
* implement slug-based content lookup
* establish static generation paths
* confirm Cloudflare Pages Free compatibility assumptions

### Expected outputs

* project scaffold
* typed content layer
* route generation model
* buildable app shell
* placeholder page shells where useful

### Exit criteria

* content can be loaded from local JSON
* slugs resolve correctly
* routes can be generated statically
* shared types exist for all categories
* the app builds successfully

### What not to do in this phase

* do not build final visual design for all pages
* do not implement all categories fully
* do not add search or extra features yet
* do not add runtime/backend logic

---

## Phase 2 — First Vertical Slice

### Goal

Build one complete, real, end-to-end slice of the product using one category only.

### Recommended category

**Failure Modes**

Why:

* richest structure
* strongest detail page demands
* strongest cross-reference potential
* best test of long-form reference UX
* most useful for stress-testing design direction

### Scope of the first slice

* homepage preview section for Failure Modes
* Failure Modes category landing page
* one or more Failure Mode detail pages
* real JSON rendering
* real metadata rendering
* real staged signal rendering
* cross-reference block pattern

### Expected outputs

* first true category implementation
* first true detail template
* first usable browse-to-detail flow
* evidence of what works and what does not

### Exit criteria

* one category feels real and coherent
* detail page quality is strong enough to evaluate seriously
* browse/index flow works
* structured content maps cleanly into UI
* the design feels aligned with the product brief

### What not to do in this phase

* do not expand all four categories in parallel
* do not over-abstract before the slice exists
* do not add lots of optional features

---

## Phase 3 — Refine the First Slice

### Goal

Improve the first vertical slice until it is strong enough to serve as the base for the rest of the product.

### Work in this phase

* improve long-form readability
* tighten spacing and hierarchy
* improve category landing page scanability
* improve detail-page structure
* improve metadata layout
* remove generic UI patterns
* align the implementation more strongly with the design direction
* test responsive behavior on the first slice

### Expected outputs

* stronger Failure Modes category implementation
* stronger shared page patterns
* clearer category identity
* fewer visual and structural weaknesses

### Exit criteria

* the first slice feels like a serious reference product, not a generic UI mockup
* the detail page is readable and memorable
* structure feels stronger than decoration
* the system is worth reusing

### What not to do in this phase

* do not rush into category expansion while major structural issues remain
* do not paper over weak hierarchy with motion or decoration

---

## Phase 4 — Extract Shared Primitives

### Goal

Convert the first slice from “working implementation” into a reusable system.

### Work in this phase

* identify repeated layout patterns
* extract shared components
* extract shared page shell pieces
* extract metadata rail patterns
* extract cross-reference blocks
* extract AI-impact presentation patterns where appropriate
* identify which pieces should remain category-specific

### Expected outputs

* reusable component inventory
* reduced duplication
* clearer component boundaries
* cleaner mapping between schema and UI

### Exit criteria

* repeated structures are shared rather than copied
* category-specific differences are intentional
* the codebase is easier to expand safely

### What not to do in this phase

* do not over-generalize everything into one hyper-flexible component
* do not erase category identity in the name of reuse

---

## Phase 5 — Expand Category by Category

### Goal

Implement the remaining categories using the shared architecture and refined templates.

### Recommended order

1. Tech Decisions
2. Red Flags
3. Engineering Playbook

### Why this order

#### Tech Decisions

Best next because:

* comparison structure is distinct but still highly structured
* tests how well the system handles side-by-side evaluation layouts

#### Red Flags

Next because:

* signal/index behavior is different from Failure Modes and Tech Decisions
* tests scan-first browse behavior strongly

#### Engineering Playbook

Last because:

* broadest set of entry shapes
* easiest to do well once the shared system is already strong

### Work in this phase

For each category:

* implement landing page
* implement detail page
* map content faithfully from JSON
* reuse shared primitives first
* add category-specific components only where necessary

### Exit criteria for each category

* category landing page feels coherent
* detail pages fit the category schema well
* cross-links work
* category identity is visible but the product still feels unified

### What not to do in this phase

* do not redesign the product while adding each category
* do not let new categories break the shared route or content model
* do not create one-off page systems casually

---

## Phase 6 — Cross-References and Browse Intelligence

### Goal

Make the site feel more interconnected and reference-like.

### Work in this phase

* improve related-entry rendering
* strengthen cross-category linking
* resolve and validate all related slugs cleanly
* improve “see also” behavior
* improve browse continuity between category and detail pages
* possibly add browse-all or about/method pages if useful

### Expected outputs

* stronger web of relationships
* better movement between ideas
* more reference-system feel

### Exit criteria

* related content feels useful, not decorative
* users can move naturally between patterns, signals, decisions, and playbooks
* the product feels like one knowledge system

### What not to do in this phase

* do not add relationship gimmicks without usefulness
* do not create noisy related-content overload

---

## Phase 7 — Optional Search

### Goal

Add search only if the core browse and detail experience is already strong.

### Preferred approach

* static index generation
* client-side search
* no backend required

### Work in this phase

* generate a search index from content
* define searchable fields
* create a search page or inline search experience
* keep the experience aligned with the reference-first product

### Exit criteria

* search improves lookup mode without weakening the static-first deployment target
* search feels integrated, not bolted on

### What not to do in this phase

* do not introduce runtime search infrastructure for v1
* do not treat search as the core product before browse is strong

---

## Phase 8 — QA, Accessibility, and Responsive Refinement

### Goal

Make the site robust, readable, and production-worthy.

### Work in this phase

* accessibility review
* responsive layout review
* typography tuning
* interaction polish
* broken-link checks
* schema/render consistency checks
* content integrity validation
* image/asset optimization
* metadata and basic SEO cleanup

### Exit criteria

* site works well on mobile and desktop
* long-form pages remain readable
* structured content renders consistently
* navigation feels stable
* visual system remains coherent across all categories

### What not to do in this phase

* do not use polish work to cover major structural weaknesses
* do not add flashy behavior that weakens readability

---

## Phase 9 — Launch Preparation

### Goal

Prepare the site for deployment and stable iteration.

### Work in this phase

* final Cloudflare Pages configuration review
* static output verification
* deploy preview review
* route and asset checks
* final content loading checks
* ensure no unnecessary runtime features were added

### Exit criteria

* static deployment works cleanly
* routes behave correctly
* content loads correctly in production build
* the site remains compatible with the intended deployment target

---

## Review Gates

The project should stop and review at these moments:

### Gate 1 — after scaffold

Ask:

* does the architecture still match the docs?
* are types and routes clean?

### Gate 2 — after first vertical slice

Ask:

* does this feel like the real product yet?
* is the design direction actually working?

### Gate 3 — after shared extraction

Ask:

* are we reusing correctly?
* did we over-abstract or under-extract?

### Gate 4 — after each category expansion

Ask:

* does the site still feel unified?
* is the schema mapping faithful?

### Gate 5 — before launch

Ask:

* is the product coherent, static-first, readable, and worth returning to?

---

## Anti-Pattern Warning

If the build starts to look like this, stop and correct course:

* all categories being built at once before one is good
* repeated redesigns instead of refinement
* page-specific hacks replacing shared systems
* runtime complexity appearing with no product reason
* category identity becoming fragmentation
* polished but generic UI overwhelming the content model

---

## Minimal Recommended Execution Order

If the build needs to stay very focused, the minimum healthy order is:

1. scaffold
2. Failure Modes vertical slice
3. refine
4. shared primitives
5. Tech Decisions
6. Red Flags
7. Engineering Playbook
8. cross-links
9. search later if needed
10. polish and launch

---

## One-Sentence Rule

**Do not expand the site faster than the underlying system becomes trustworthy.**

