# Content Location — nosilverbullet.dev

## Purpose

This document defines where content lives in the repository and how builders should treat it.

It exists to keep content handling:

* predictable
* static-first
* easy to load at build time
* easy to validate
* easy to expand later

This is not a CMS document.
It is a **repository content layout document**.

---

## Core Principle

Content is part of the product source.

For v1, the site should treat structured content files in the repository as the editorial source of truth.

That means:

* content should live in version-controlled files
* page rendering should load from local content at build time
* content should not depend on runtime fetching
* builders should know exactly where each category lives

---

## Primary Content Root

Recommended primary content root:

```text
content/
```

All structured editorial content should live under this directory.

This keeps content separate from:

* implementation code
* docs
* assets
* framework-specific routing files

---

## Preferred Category Layout

Recommended initial layout:

```text
content/
  failure-modes/
    failure-modes.json
  tech-decisions/
    tech-decisions.json
  red-flags/
    red-flags.json
  engineering-playbook/
    engineering-playbook-ai.json
    engineering-playbook-architecture.json
    engineering-playbook-delivery.json
    engineering-playbook-operations.json
    engineering-playbook-team.json
```

This is the preferred v1 structure.

Why:

* simple
* easy to reason about
* easy for build-time loaders
* easy for validation
* works well while each category is still managed as one large canonical JSON

---

## Alternate Future Layout

If category files later become too large, they may be split into one file per entry.

Allowed future structure:

```text
content/
  failure-modes/
    index.json
    friendly-rewrite.json
    hero-trap.json
  tech-decisions/
    index.json
    build-vs-buy.json
    monolith-vs-microservices.json
```

This is not required for v1.
Only do this if there is a real maintainability reason.

---

## Current Expected Files

The expected canonical category content files are:

```text
content/failure-modes/failure-modes.json
content/tech-decisions/tech-decisions.json
content/red-flags/red-flags.json
content/engineering-playbook/engineering-playbook-ai.json
content/engineering-playbook/engineering-playbook-architecture.json
content/engineering-playbook/engineering-playbook-delivery.json
content/engineering-playbook/engineering-playbook-operations.json
content/engineering-playbook/engineering-playbook-team.json
```

Each of these should follow:

* the top-level shared schema from `docs/content-schema.md`
* the category-specific schema doc for that content family

---

## Content Ownership Model

Each category JSON is a canonical source file for that category.

That means:

* the category file is authoritative
* page components should not duplicate content that belongs there
* route generation should derive from those files
* related-entry resolution should derive from those files

If supporting helper data exists later, it should not silently replace the canonical category file.

---

## Loader Expectations

Builders should assume that content will be loaded from the files above at build time.

Expected loader behavior:

* read category JSON from local filesystem
* parse and type it
* expose entry lists
* expose entry lookup by slug
* expose related slug resolution helpers
* make route generation possible from local data only

The loader layer should know where content is located.
Page components should not care about raw file paths.

---

## Path Stability Rules

Once the site implementation begins, content paths should remain stable unless there is a strong reason to change them.

Avoid:

* moving files casually
* mixing category content into different unrelated folders
* storing some content under `src/` and some under `content/`
* burying editorial JSON inside framework route folders

Stable paths make:

* loaders simpler
* AI-assisted development safer
* validation easier
* deployment cleaner

---

## Separation From Docs

Keep these concerns separate:

### `docs/`

Contains:

* product decisions
* schema definitions
* design direction
* build rules
* route/architecture docs

### `content/`

Contains:

* structured editorial source data used by the site

### `src/` or equivalent app code directory

Contains:

* loaders
* types
* components
* templates
* route implementations

Do not mix these responsibilities.

---

## Separation From Assets

Content JSON should not be mixed with static media unless there is a very clear reason.

Recommended:

* structured text content in `content/`
* images, icons, illustrations, and other static assets in an asset directory

Do not place presentation assets directly inside category content directories unless there is a deliberate content-packaging strategy later.

---

## Cross-Reference Expectations

Because related entries are important, content files should be stored in a way that supports easy cross-reference resolution.

This means:

* entry slugs should be stable
* related references should resolve across the category files
* loaders should be able to build lookup maps from the content root

A builder should be able to answer these questions from local content alone:

* what entries exist?
* what slug belongs to what category?
* what entries are related?
* what routes need to be generated?

---

## Validation Expectations

The content layout should make it easy to validate:

* each category file exists
* each file follows the expected top-level shape
* slugs are unique
* related references resolve
* subcategory values are valid

Validation should operate against the content root, not against hand-maintained page lists.

---

## Migration Policy for Content Layout

If the layout ever changes later, it should change intentionally.

Examples of valid reasons:

* category JSON becomes too large to manage comfortably
* editorial workflow clearly benefits from per-entry files
* validation or tooling becomes materially easier

Examples of weak reasons:

* one component wants a different shape
* a framework convention suggests a different folder layout
* the current content path feels arbitrary without causing real problems

Do not churn content structure without product or maintainability benefit.

---

## Recommended v1 Rule

For v1, keep the content structure simple:

```text
one category = one canonical JSON file
```

This is enough to support:

* static generation
* route generation
* related reference resolution
* category landing pages
* detail pages

Only split later if the content scale truly demands it.

---

## Builder Guidance

When implementing loaders or routes:

* read from `content/`
* treat category JSON files as authoritative
* do not hardcode content paths in multiple places
* centralize file access in loader utilities
* keep page components unaware of raw file system structure

A good rule is:
**only the content loader layer should know exactly where the files live.**

---

## Example Canonical Layout

```text
content/
  failure-modes/
    failure-modes.json
  tech-decisions/
    tech-decisions.json
  red-flags/
    red-flags.json
  engineering-playbook/
    engineering-playbook-ai.json
    engineering-playbook-architecture.json
    engineering-playbook-delivery.json
    engineering-playbook-operations.json
    engineering-playbook-team.json

docs/
  product-brief.md
  content-schema.md
  schema-failure-modes.md
  schema-tech-decisions.md
  schema-red-flags.md
  schema-engineering-playbook.md
  design-direction.md
  build-rules.md
  deployment-target.md
  route-map.md
  site-architecture.md
  implementation-phases.md
  component-inventory.md
  content-location.md
```

---

## One-Sentence Rule

**Content should live in one clear repository location and be loaded centrally, so the site remains static-first, typed, and easy to reason about.**

