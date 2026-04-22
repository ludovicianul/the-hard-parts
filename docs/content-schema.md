# Content Schema — nosilverbullet.dev

## Purpose

This document defines the **shared content conventions** for nosilverbullet.dev.

It is the master schema and content-contract guide for the site.

It exists to ensure that:

* all category JSON files follow consistent rules
* Windsurf and future builders do not infer schema inconsistently
* cross-linking works reliably across categories
* rendering stays data-driven and maintainable
* category-specific schema docs can extend a common foundation without drifting

This document does **not** replace the category-specific schema docs.
It defines the global rules they all inherit.

---

## Site Content Model

The site has four primary content categories:

* **Failure Modes**
* **Tech Decisions**
* **Red Flags**
* **Engineering Playbook**

Each category has:

* its own top-level JSON
* its own entry schema
* its own detail-page template
* its own landing/index page behavior

All categories must still follow shared rules for:

* identifiers
* slugs
* references
* naming
* optional vs required discipline
* rendering expectations

---

## Top-Level JSON Convention

Each category JSON should use the same top-level structure.

Expected top-level shape:

```json
{
  "category": {
    "code": "",
    "name": "",
    "summary": "",
    "categories": []
  },
  "template": {
    "fields": []
  },
  "entries": []
}
```

### Meaning of top-level keys

#### `category`

Describes the category itself.

Required fields:

* `code` — short code for the category
* `name` — display name
* `summary` — one-sentence category summary
* `categories` — list of internal subcategories used for grouping/filtering

#### `template`

Defines the entry fields expected in that category.

Required fields:

* `fields` — ordered list of schema field names used by entries in that category

This is mainly for:

* schema visibility
* content consistency
* builder/debugging support

#### `entries`

The actual list of category entries.

Each entry must conform to that category’s schema.

---

## Category Codes

Each category must use a stable short code.

Approved codes:

* `FM` → Failure Modes
* `TD` → Tech Decisions
* `RF` → Red Flags
* `EP` → Engineering Playbook

These codes may be used in:

* data files
* visual labels
* internal references
* UI section markers

Do not invent alternate category codes unless the system is intentionally expanded.

---

## Slug Rules

Every entry must have a stable slug.

### Requirements

* lowercase only
* words separated by hyphens
* no spaces
* no underscores
* no punctuation other than hyphens
* slug must be unique within the whole site
* slug should remain stable once published

### Examples

* `the-friendly-rewrite` is **not preferred** because articles should usually be removed
* `friendly-rewrite` is preferred
* `run-a-phased-migration` is acceptable because it is an action phrase
* `sql-vs-nosql` is acceptable
* `ownership-is-claimed-but-not-visible` is acceptable

### Guidance

Prefer:

* concise
* memorable
* stable
* human-readable

Do not optimize slug naming for SEO tricks.
Optimize for durability and clarity.

---

## Entry Identity Rules

Each entry must have:

* a unique `slug`
* a human-readable `title`
* a category-specific internal `category` value where relevant

Optional short IDs like `FM-01` may exist in UI or source content, but the **slug** is the primary routing identity.

### Routing assumption

The site should treat slug as the canonical route key.

Example route patterns:

* `/failure-modes/friendly-rewrite`
* `/tech-decisions/build-vs-buy`
* `/red-flags/ownership-is-claimed-but-not-visible`
* `/playbook/run-a-phased-migration`

---

## Shared Field Conventions

Not every category uses the same fields, but when a field name appears in more than one category, it should mean the same thing.

### Shared semantic fields

These names should remain consistent when used:

* `slug`
* `title`
* `summary`
* `category`
* `goal`
* `useWhen`
* `doNotUseWhen`
* `relatedFailureModes`
* `relatedRedFlags`
* `relatedTechDecisions`
* `relatedPlaybooks`
* `aiCanHelpWith`
* `aiCanMakeWorseBy`
* `aiSpecificNotes`
* `patternConfidence`

### Shared field naming rules

* Use **camelCase** for field names
* Use plural names for arrays
* Use clear, explicit names over short names
* Do not introduce synonyms for existing concepts

Examples:

* use `relatedPlaybooks`, not `playbooksRelated`
* use `useWhen`, not `whenToUse`
* use `patternConfidence`, not `confidenceLevel` unless intentionally changing schema

---

## Array vs String Rules

Use arrays when a field naturally contains multiple discrete items.

### Use arrays for:

* bullet-like content
* lists of signals
* lists of causes
* lists of steps
* related references
* examples
* roles
* tags/subcategories

### Use strings for:

* short summaries
* narrative paragraphs
* concise labels
* single explanatory notes

### Avoid

Do not store multiple conceptual bullets inside one long string if they are meant to render as separate list items.

Bad:

```json
"useWhen": "When risk is high, the team is blocked, and ownership is unclear"
```

Good:

```json
"useWhen": [
  "risk is high",
  "the team is blocked",
  "ownership is unclear"
]
```

---

## Text Density Rules

Entries are meant to support both:

* scanning
* deeper reading

So content should be structured accordingly.

### Preferred content shapes

Use:

* concise summaries
* list fields for quick scan
* paragraph fields for deeper explanation
* clearly separated sections

### Avoid

Avoid storing everything as:

* one giant markdown blob
* one long rich-text field per entry
* HTML fragments inside JSON

This site should remain **strongly structured**.

---

## Cross-Reference Rules

Cross-linking is a core product feature.

### Principle

Entries should reference one another using **slugs**, not display text.

That means related fields should ideally store slug references, or at minimum a stable format that can be normalized into slugs.

### Preferred reference form

Preferred:

```json
"relatedFailureModes": ["friendly-rewrite", "dependency-fog"]
```

Less preferred:

```json
"relatedFailureModes": ["The Friendly Rewrite", "Dependency Fog"]
```

The system should aim for slug-based linking everywhere.

### Cross-category related fields

Use these fields:

* `relatedFailureModes`
* `relatedRedFlags`
* `relatedTechDecisions`
* `relatedPlaybooks`

These should contain arrays of slugs pointing to entries in the corresponding category.

### Rules for related content

* only link when the relationship is meaningful
* avoid inflated cross-linking just to appear connected
* prefer smaller, stronger related sets
* related links should help navigation and reasoning

---

## Category/Subcategory Rules

Each entry may belong to a category-specific subcategory.

Examples:

* Failure Modes: `planning`, `people`, `technical`, `process`, `leadership`, `ai`
* Engineering Playbook: `delivery`, `team`, `architecture`, `operations`, `ai`

### Rules

* subcategory values should be lowercase strings
* subcategories should be listed in the top-level `category.categories`
* entry subcategory values must match one of the declared subcategories

This ensures filters and landing pages stay consistent.

---

## AI Field Rules

AI is a modifier across the entire site.

Not every entry needs strong AI treatment, but many do.

### Preferred shared AI fields

When relevant, use:

* `aiCanHelpWith` → array of positive leverage points
* `aiCanMakeWorseBy` → array of distortion or risk points
* `aiSpecificNotes` → short synthesis or warning note

### Rules

* do not force AI fields if they add no value
* do not add generic AI commentary
* only include AI fields where AI materially changes the pattern, signal, decision, or playbook

---

## Confidence Field Rules

Some categories include a confidence-style field.

Preferred global name:

* `patternConfidence`

### Allowed values

Recommended controlled values:

* `high`
* `medium`
* `low`

### Meaning

This does **not** mean model confidence.
It means editorial confidence that the pattern or recommendation is:

* broadly valid
* clearly observed
* stable enough to present as a structured entry

If more nuance is needed later, expand carefully.

---

## Step Object Rules

Some categories include procedural steps.

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

### Rules

* `step` should be numeric and ordered
* `title` should be concise
* `purpose` should explain why the step exists
* `actions` should be concrete
* `outputs` should describe artifacts or outcomes

This is especially important for Engineering Playbook.

---

## Rendering Philosophy

The JSON is not just storage. It is meant to drive rendering.

So fields should map naturally to UI sections.

### Good data fields are:

* semantically clear
* renderable without heavy inference
* reusable across entry pages
* stable enough for templates

### Avoid data that requires the UI to guess too much

Bad examples:

* giant mixed-format rich text fields
* ambiguous labels
* one-off field names for similar concepts
* narrative text that contains hidden list structures

---

## Markdown and HTML Rules

### Preferred

Store plain strings and arrays of strings.

### Avoid

Do not embed:

* raw HTML
* CSS classes
* JSX
* layout instructions
  inside JSON content.

If markdown is ever introduced later, it should be:

* minimal
* intentional
* supported consistently

For now, plain structured text is preferred.

---

## File Organization Expectations

Recommended content layout:

```text
content/
  failure-modes/
    failure-modes.json
  tech-decisions/
    tech-decisions.json
  red-flags/
    red-flags.json
  engineering-playbook/
    engineering-playbook.json
```

Or, if later split into multiple files per entry:

```text
content/
  failure-modes/
    friendly-rewrite.json
    hero-trap.json
  tech-decisions/
    build-vs-buy.json
```

Either is acceptable, but the structure should remain consistent within a category.

---

## Validation Expectations

Each category should be validate-able against:

* required fields
* allowed subcategories
* allowed enum values
* slug uniqueness
* cross-reference integrity

### At minimum, validation should check:

* every entry has a unique slug
* every related slug resolves to a real entry
* no undeclared subcategory is used
* required fields are present
* field types match schema expectations

---

## Future-Proofing Rules

The schema should be extensible, but not casually.

### Rules for schema changes

* do not rename common fields without strong reason
* do not introduce near-duplicate concepts lightly
* do not change slug conventions after routes exist
* do not let category-specific hacks redefine shared field meaning

### If a new field is added

It should answer:

* what problem does this field solve?
* is it category-specific or shared?
* does it affect rendering?
* is it editorially durable?

---

## Relationship to Category-Specific Docs

This document defines the shared rules.

Each category-specific schema doc should define:

* category-specific field meanings
* required vs optional fields for that category
* field-level examples
* rendering notes for that category’s entry pages

Those docs should not contradict this one.

---

## Summary

This document exists to keep content coherent across the whole site.

In practice, it should help Windsurf and future builders understand that:

* the site is structured
* content is strongly typed
* slugs are canonical
* references matter
* field naming is intentional
* categories differ, but not chaotically

## One-Sentence Rule

**If a builder has to guess what a field means or how entries relate, the schema is not clear enough yet.**

