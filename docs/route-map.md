# Route Map — nosilverbullet.dev

## Purpose

This document defines the canonical route structure for nosilverbullet.dev.

It exists to ensure that:

* routing stays consistent
* page types are clear before implementation
* category pages follow one system
* Windsurf does not invent route patterns mid-build
* slugs remain the primary identity for detail pages

This is a product architecture document, not a framework-specific router file.

---

## Routing Principles

### 1. The site should feel simple and legible

Routes should be:

* short
* clear
* stable
* human-readable

Avoid:

* unnecessary nesting
* overly clever route patterns
* mixed naming styles
* route structures that mirror internal component folders instead of product logic

### 2. Slug is canonical

Each detail page should be addressed by:

* category route
* entry slug

Example:

* `/failure-modes/friendly-rewrite`
* `/tech-decisions/build-vs-buy`

Do not build parallel public identifiers unless there is a strong reason.

### 3. Category roots should be plural and explicit

Use category names directly in routes.

Preferred:

* `/failure-modes`
* `/tech-decisions`
* `/red-flags`
* `/engineering-playbook`

Avoid:

* abbreviations in public URLs
* mixed singular/plural route names
* inconsistent route casing

---

## Canonical Route Structure

### Homepage

```text
/
```

Purpose:

* introduce the site
* present the four sections
* act as the main entry point into browse mode

---

## Category Landing Pages

### Failure Modes

```text
/failure-modes
```

### Tech Decisions

```text
/tech-decisions
```

### Red Flags

```text
/red-flags
```

### Engineering Playbook

```text
/engineering-playbook
```

Purpose of category landing pages:

* introduce the category
* support browsing and filtering
* show the category index
* help users scan entries quickly
* provide category-specific orientation

---

## Detail Pages

### Failure Mode detail page

```text
/failure-modes/[slug]
```

Example:

```text
/failure-modes/friendly-rewrite
```

### Tech Decision detail page

```text
/tech-decisions/[slug]
```

Example:

```text
/tech-decisions/build-vs-buy
```

### Red Flag detail page

```text
/red-flags/[slug]
```

Example:

```text
/red-flags/ownership-is-claimed-but-not-visible
```

### Engineering Playbook detail page

```text
/engineering-playbook/[slug]
```

Example:

```text
/engineering-playbook/run-a-phased-migration
```

Purpose of detail pages:

* render one structured entry
* preserve category identity
* support deep reading and cross-reference navigation

---

## Editorial / Supporting Routes

In addition to the four catalog families above, these supporting
routes are part of the canonical site and ship with v1. They are
editorial / publication-meta surfaces — they do not contain catalog
entries, but they frame the rest of the publication.

### About / Method

```text
/about
```

Method / preface page. Explains what the site is, how the four
catalogs are organized, how to use them, and how AI is treated
throughout. Editorial voice; not a corporate "about us".

### Global search

```text
/search
```

Client-side search across all four catalogs.

### Issues archive

```text
/issues
```

Public release-notes archive. Lists every issue that currently has
at least one entry, newest first. The reference ships in numbered
issues; this is the table of contents for that publication
layer. See **Issue detail** below.

### Issue detail

```text
/issues/[issue]
```

Example:

```text
/issues/01
```

Per-issue release notes. Groups every entry that belongs to the
issue (membership comes from each entry's `edition` field) by
category, then by `issueStatus` (`new` / `modified` / `removed`).
Links back to canonical entry pages — it is a changelog, not a
versioned copy of the catalog.

Issue numbers are zero-padded two-digit strings (`01`, `02`, ...,
`12`). The matching `edition` value on entries is `edition-NN`.

### Browse-all page

```text
/browse
```

Optional. Not yet implemented. Only useful if a clear cross-
category browse experience emerges; do not add it unless it
serves a real product need.

---

## Routes to Avoid for V1

Do not introduce these unless explicitly justified:

### Tag or taxonomy archive routes

Examples:

```text
/category/planning
/tags/leadership
/failure-modes/category/planning
```

Reason:

* adds complexity too early
* category filtering can remain inside category landing pages for v1

### Separate AI subsection routes

Examples:

```text
/ai
/failure-modes/ai
```

Reason:

* AI is a modifier across the whole site, not a separate product area by default

### Numeric or internal-code routes

Examples:

```text
/fm/fm-01
/entry/123
```

Reason:

* worse public readability
* duplicates the slug system

### Deep nested browse routes

Examples:

```text
/failure-modes/planning/friendly-rewrite
/engineering-playbook/operations/improve-release-confidence
```

Reason:

* category-level filtering is enough for v1
* subcategory should remain metadata, not mandatory route structure

---

## Slug Expectations in Routing

Each detail route depends on a valid slug.

Slug rules:

* lowercase
* hyphen-separated
* stable once published
* unique across the site if possible
* definitely unique within the category

Examples:

* `friendly-rewrite`
* `hero-trap`
* `build-vs-buy`
* `ownership-is-claimed-but-not-visible`
* `run-a-phased-migration`

Avoid:

* spaces
* underscores
* punctuation-heavy slugs
* SEO-stuffed slugs
* frequent slug churn

---

## URL Naming Rules

### Public routes should use full category names

Preferred:

* `/failure-modes`
* `/tech-decisions`

Not:

* `/fm`
* `/td`
* `/rf`
* `/ep`

Short codes may appear visually in UI, but not as the primary public route structure.

### Use kebab-case for route segments

Always prefer:

* `engineering-playbook`

Never:

* `engineeringPlaybook`
* `engineering_playbook`
* `EngineeringPlaybook`

---

## Breadcrumb Model

Detail pages should support breadcrumbs conceptually using this structure:

### Failure Modes

```text
Home / Failure Modes / [Entry Title]
```

### Tech Decisions

```text
Home / Tech Decisions / [Entry Title]
```

### Red Flags

```text
Home / Red Flags / [Entry Title]
```

### Engineering Playbook

```text
Home / Engineering Playbook / [Entry Title]
```

Subcategory should usually remain metadata on the page, not a required breadcrumb layer.

Example:

* Home / Failure Modes / The Friendly Rewrite

Not necessarily:

* Home / Failure Modes / Planning / The Friendly Rewrite

That deeper hierarchy can be shown in metadata without becoming route structure.

---

## Route-to-Page-Type Mapping

### `/`

Page type:

* Home

### `/failure-modes`

Page type:

* Category landing page
* Filterable index
* Category overview

### `/failure-modes/[slug]`

Page type:

* Failure Mode detail page

### `/tech-decisions`

Page type:

* Category landing page
* Comparative index

### `/tech-decisions/[slug]`

Page type:

* Tech Decision detail page

### `/red-flags`

Page type:

* Category landing page
* Signal index

### `/red-flags/[slug]`

Page type:

* Red Flag detail page

### `/engineering-playbook`

Page type:

* Category landing page
* Playbook index

### `/engineering-playbook/[slug]`

Page type:

* Engineering Playbook detail page

### `/about`

Page type:

* Editorial preface / method page

### `/search`

Page type:

* Client-side search across all catalogs

### `/issues`

Page type:

* Public release-notes archive

### `/issues/[issue]`

Page type:

* Per-issue release-notes / changelog page

---

## Static Generation Expectation

Because the site is intended for Cloudflare Pages Free and a static-first architecture:

* all category landing pages should be statically generated
* all detail pages should be statically generated from JSON content
* slug lists should be derived at build time
* no backend route resolution should be required for content pages

This route map assumes a static generation model by default.

---

## Future Expansion Policy

If new routes are added later, they should follow these rules:

1. do not weaken the clarity of the main route system
2. do not duplicate existing navigation concepts
3. do not turn metadata into unnecessary route depth
4. do not add routing complexity before product need is clear

Any future route should be evaluated against the question:

**Does this make the reference system clearer, or just more complex?**

---

## Final Canonical Route List

Shipped routes:

```text
/
/about
/search
/issues
/issues/[issue]
/failure-modes
/failure-modes/[slug]
/tech-decisions
/tech-decisions/[slug]
/red-flags
/red-flags/[slug]
/engineering-playbook
/engineering-playbook/[slug]
```

Optional later:

```text
/browse
```

### Why `/issues` lives at the top level

The issue system is a thin public release-notes layer over the
canonical catalog — not a versioned copy. Entry URLs are never
versioned (`/failure-modes/friendly-rewrite` always points to the
latest canonical entry). The `/issues/*` routes are the *only*
place issue numbers appear in URLs, and they always link back to
canonical entry pages. This keeps the route system simple and
avoids parallel public identifiers (rule #2 above).

---

## One-Sentence Rule

**Public routes should reflect the product’s four-part reference structure clearly, simply, and statically.**

