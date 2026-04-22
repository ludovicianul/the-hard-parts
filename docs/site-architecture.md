# Site Architecture — nosilverbullet.dev

## Purpose

This document defines the intended technical architecture for nosilverbullet.dev.

It exists to ensure that implementation decisions stay aligned with the product shape, deployment target, and content model.

This is not a framework-specific implementation file.
It is the architectural source of truth for how the site should be built.

---

## Architecture Summary

Nosilverbullet.dev should be built as a:

* **static-first**
* **content-driven**
* **schema-led**
* **template-based**
* **cross-linked reference site**

The site is not an app with a backend.
It is a structured reference system rendered from local content files.

Core assumption:
**all core pages should be generated from structured content at build time.**

---

## Primary Constraints

The architecture must respect these constraints:

* deployment target is Cloudflare Pages
* Free plan compatibility is preferred
* no backend for core site functionality
* no database
* no server runtime required for core page rendering
* no authentication or account model in v1
* no runtime dependency for essential content delivery

This means the architecture should strongly prefer:

* static generation
* local typed content
* simple routing
* reusable rendering primitives

---

## Core Architectural Model

The product should be built from five layers:

1. **content layer**
2. **schema/type layer**
3. **content resolution layer**
4. **page-template layer**
5. **shared UI/component layer**

This layering should remain visible in the codebase.

---

## 1. Content Layer

The source content lives in structured files inside the repository.

Expected format:

* JSON

Expected categories:

* Failure Modes
* Tech Decisions
* Red Flags
* Engineering Playbook

The content layer is the editorial source of truth.

### Rules

* content should not be hardcoded into page components
* content should remain structured and typed
* content files should be easy to validate
* cross-references should resolve from content, not from hand-maintained UI logic

---

## 2. Schema / Type Layer

Each category should have a typed entry model.

Expected type families:

* top-level category payload
* Failure Mode entry
* Tech Decision entry
* Red Flag entry
* Engineering Playbook entry
* related-reference resolution types

### Purpose

This layer exists to:

* prevent schema drift
* make templates predictable
* reduce fragile untyped rendering logic
* enforce structure during implementation

### Rules

* shared concepts should use shared field names
* slug should be treated as canonical identity
* route generation should depend on typed slugs

---

## 3. Content Resolution Layer

This layer converts raw content files into page-usable data.

Responsibilities:

* load category JSON
* validate basic structure
* expose entry lists by category
* expose entry lookups by slug
* resolve related references across categories
* provide pre-renderable route data

### This layer should do

* slug lookups
* relationship resolution
* category filtering preparation
* route generation support

### This layer should not do

* visual formatting logic
* page layout decisions
* hardcoded UI-specific content transformation

The output of this layer should be clean, predictable data for templates.

---

## 4. Page-Template Layer

The site should be built around a small number of stable page types.

Primary page types:

* Home page
* Category landing page
* Detail page

Optional later:

* Search page
* About / Method page
* Browse-all page

### Template philosophy

Templates should be:

* reusable
* schema-aware
* structurally stable
* category-adaptable

### Important rule

Do not build every detail page from scratch.

Instead:

* use shared page shell patterns
* use shared layout primitives
* allow category-specific sections where the schema genuinely differs

The site should feel like one system with four content families, not four unrelated websites.

---

## 5. Shared UI / Component Layer

This layer provides reusable rendering building blocks.

Likely component families:

* page shell
* section header
* category hero
* entry card/index card
* metadata rail
* related references block
* AI impact block
* warning signals block
* comparison block
* procedural steps block
* narrative section block

### Rules

* reuse should be driven by content structure
* components should stay data-driven
* category-specific variants are acceptable when they reflect real schema differences
* avoid cloning similar layouts across categories

---

## Canonical Page Architecture

### Home page

The homepage should:

* introduce the product clearly
* introduce the four sections
* act as a browse starting point
* show category identity without requiring deep reading

It should not behave like a marketing landing page.

### Category landing pages

Each category landing page should:

* explain the category briefly
* provide a filterable/scannable index
* render entries from structured content
* preserve category-specific tone and metadata

### Detail pages

Each detail page should:

* render from structured content only
* preserve category identity
* support deep reading and scanability
* expose strong metadata and section hierarchy
* link to related entries across categories

---

## Routing Model

The architecture assumes these route families:

* `/`
* `/failure-modes`
* `/failure-modes/[slug]`
* `/tech-decisions`
* `/tech-decisions/[slug]`
* `/red-flags`
* `/red-flags/[slug]`
* `/engineering-playbook`
* `/engineering-playbook/[slug]`

Route generation should be derived from local content slugs at build time.

There should be no runtime dependency for page resolution.

---

## Rendering Model

Preferred rendering model:

* statically generated pages from local content
* generated at build time
* deployed as static output

### Why

Because the product is:

* content-driven
* stable enough to pre-render
* well-suited to CDN caching
* intentionally backend-free for v1

### Avoid

Avoid introducing:

* SSR dependency for content pages
* runtime page assembly
* API-backed page rendering
* server-generated related-content logic unless clearly necessary

---

## Search Architecture Guidance

Search is not mandatory for the first implementation.

If added later, preferred direction is:

* generate a static search index at build time
* load that index client-side
* perform client-side search over structured content

Avoid for v1:

* backend search services
* runtime vector search
* server-side query infrastructure

The architecture should remain static-first even if search is added later.

---

## Cross-Reference Architecture

Cross-linking is a core product feature.

### Cross-reference model

Entries should reference one another through:

* slug-based related fields
* content-resolution layer lookup
* rendered related-block components

### Rules

* related items should resolve from data, not page hardcoding
* broken references should be detectable during build/validation
* category-aware related rendering should be supported

Cross-references should feel native to the product, not bolted on later.

---

## Category Variation Model

The architecture must support category-specific rendering differences.

That means:

* shared base page shell
* shared metadata and cross-reference patterns
* category-specific section arrangements where necessary

Examples:

* Failure Modes need narrative progression and staged warning signals
* Tech Decisions need option comparison structure
* Red Flags need quick recognition and inspection logic
* Engineering Playbook needs step-by-step execution structure

### Important rule

Variation should come from:

* schema-aware template composition
* category-specific section modules

Not from:

* separate unrelated page systems
* one-off page implementations

---

## Suggested Codebase Shape

Conceptually, the codebase should separate:

```text
content/
  ...json files

docs/
  ...product and schema docs

src/
  content/
    loaders
    resolvers
    validators
    types
  components/
    shared
    category-specific
  pages-or-routes/
    home
    category
    detail
  utils/
    route helpers
    content helpers
```

Exact framework folder naming may vary, but the separation of concerns should remain.

---

## Validation Expectations

The architecture should make it easy to validate:

* unique slugs
* valid category membership
* required fields present
* cross-reference integrity
* schema/type alignment

Validation does not need to be over-engineered for v1, but content integrity should not rely on hope.

---

## Performance Philosophy

The product should be naturally performant because of its architecture.

That means:

* static generation
* low runtime complexity
* lightweight client-side behavior
* disciplined asset usage
* content-first rendering

Performance should come from architectural fit, not from last-minute optimization theater.

---

## Anti-Patterns to Avoid

Avoid these architectural mistakes:

### 1. Page-by-page improvisation

Do not let each page become its own mini-system.

### 2. Data-model drift driven by UI convenience

Do not reshape content arbitrarily because one component is awkward.

### 3. Runtime-heavy architecture without product need

Do not introduce backend logic because the framework makes it easy.

### 4. Generic CMS thinking too early

Do not design the architecture around a future CMS before the static system is strong.

### 5. Over-abstraction too early

Do not build an elaborate rendering engine before one strong vertical slice exists.

---

## Recommended Build Order

The architecture assumes this implementation order:

1. define types and content loaders
2. define route generation from slugs
3. build shared page shell and primitives
4. build one full vertical slice using one category
5. refine templates and component boundaries
6. expand remaining categories
7. add cross-reference improvements
8. add optional search later

This order reduces drift and rework.

---

## Decision Rule for Architectural Choices

When facing an architectural choice, ask:

1. Does this keep the site static-first?
2. Does this keep content as the source of truth?
3. Does this strengthen reuse without flattening category identity?
4. Does this make build-time generation easier or harder?
5. Does this introduce runtime complexity without real product need?

If the answer to the last question is yes, avoid it.

---

## One-Sentence Rule

**Nosilverbullet.dev should be built as a static, schema-led, content-driven reference system whose templates are stronger than its implementation shortcuts.**

