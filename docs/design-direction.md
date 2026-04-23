# Design Direction — nosilverbullet.dev

## Purpose

This document defines the visual and interaction direction for nosilverbullet.dev.

It exists to help builders make design decisions that are:

* consistent
* intentional
* original
* aligned with the product
* resistant to generic AI/site-builder drift

This is not a pixel spec.
It is a design-intent document.

It should help answer:

* what the site should feel like
* what visual language fits the product
* what should be avoided
* how category identity should work
* how interaction should support reading and thinking

---

## Core Design Position

Nosilverbullet.dev should feel like a:

* technical field guide
* editorial reference system
* engineering manual
* structured dossier of patterns and trade-offs

It should **not** feel like:

* a SaaS landing page
* a startup growth product
* a generic dashboard
* a soft modern card UI with pills everywhere
* a glossy AI-generated design demo

The site should communicate:

* seriousness
* structure
* clarity
* technical credibility
* memorability without trend-chasing

A good internal shorthand is:
**editorial + technical + reference-first**

---

## Design Goals

The design should:

1. Make dense information readable
2. Make categories feel distinct but part of one product
3. Reward scanning and deep reading
4. Support structured, repeatable page templates
5. Feel more like a manual than a marketing site
6. Look original enough that it does not read as “default AI design”
7. Keep content as the primary event

---

## Overall Aesthetic Direction

Preferred aesthetic qualities:

* sharp
* typographic
* grid-led
* composed
* slightly editorial
* tactile
* layered without clutter
* structured rather than decorative

The site should feel like it was designed by someone who cares about:

* information hierarchy
* print-era discipline
* technical systems
* modern but not fashionable interfaces

It should not feel driven by:

* trend libraries
* component-marketplace defaults
* over-rounding
* colorful productivity-app energy

---

## Controlled tabloid energy

The product may borrow a small amount of tabloid / bulletin / newsroom energy where it strengthens recognition and memorability.

This can include:
- stronger section markers
- more assertive accent color use
- bulletin-like labels, rails, stamps, or reference cues
- sharper contrast between metadata and narrative areas
- slightly more visual punch in category identity

This should remain controlled.

Avoid:
- sensationalism
- noisy layouts
- aggressive newspaper parody
- high-saturation chaos
- visual treatment that undermines readability or seriousness

The goal is:
**technical field guide with a hint of print-era urgency, not a loud media brand.**

---

## Strong Reference Directions

The product can borrow energy from these design families:

* technical manual
* editorial dossier
* field guide
* annotated engineering notebook
* tabloid or bulletin reference system, if controlled carefully

These are directions, not things to imitate literally.

What matters is the **behavioral feel**:

* content looks inspectable
* metadata feels useful
* sections feel named and navigable
* pages look designed for repeated use, not just first impressions

---

## Primary UX Modes

The design must support two core user modes.

### 1. Browse mode

The user is exploring patterns.

Needs:

* category browsing
* strong card/index systems
* quick scan of summary + metadata
* strong cross-link visibility
* low-friction movement between related entries

### 2. Lookup mode

The user arrives with a specific problem.

Needs:

* fast recognition
* clear detail page hierarchy
* high-trust metadata
* obvious “what this is / what to do next” structure
* ability to jump to adjacent patterns quickly

The site should never over-optimize for one mode at the expense of the other.

---

## Information Density Philosophy

Nosilverbullet.dev should be **information-dense but calm**.

That means:

* more structure than most marketing sites
* more breathing room than raw documentation dumps
* enough metadata to orient quickly
* enough typography contrast to avoid visual fatigue

Avoid both extremes:

### Too sparse

Feels like:

* oversized startup hero pages
* too little information per screen
* substance hidden behind scrolling

### Too dense

Feels like:

* enterprise control panel overload
* cramped content
* weak hierarchy
* intimidating walls of detail

The right balance is:
**reference-rich, but readable**.

---

## Typography Direction

Typography is one of the main identity tools of the site.

### Typographic goals

* strong hierarchy
* readable long-form text
* technical but not robotic
* clear distinction between narrative, metadata, and system labels

### Recommended text roles

Use at least these distinct roles:

* **display / page title**
* **section title**
* **entry title**
* **body text**
* **metadata label**
* **small system label / code / eyebrow**
* **cross-reference / utility text**

### Tone of typography

The typography should suggest:

* editorial seriousness
* structured thinking
* reference credibility

Not:

* cheerful SaaS friendliness
* app-store polish
* futuristic sci-fi branding

### Guidance

* headlines should feel strong and deliberate
* metadata labels can be mono or mono-like if used sparingly
* body copy must remain highly readable for long pages
* avoid relying on giant type as the only design move

---

## Layout Direction

The layout should be **grid-led** and **structural**.

That means:

* clear columns
* visible section boundaries
* stable content regions
* metadata blocks that feel intentional
* repeatable page rhythm

### Good layout patterns

* side rails
* content columns
* sectional dividers
* dossier-like blocks
* technical-manual style labeled sections
* stacked panels with controlled asymmetry

### Avoid

* floating soft cards everywhere
* center-column-only blog layouts for everything
* random decorative asymmetry with no structural meaning
* dashboard widgets that turn reference content into app chrome

---

## Card Direction

Cards are allowed, but they should not feel like generic product cards.

### Cards should feel like:

* reference records
* index entries
* dossier sheets
* technical catalog objects
* field-guide panels

### Cards should not feel like:

* pricing cards
* analytics tiles
* e-commerce panels
* mobile-app settings groups

### Preferred card behavior

A card should usually contain:

* code / ID / category marker
* title
* summary
* compact metadata
* maybe one or two structural cues
* clear affordance to open or expand

### Avoid overuse of:

* rounded corners everywhere
* pills everywhere
* soft shadows as primary depth tool
* gradient-heavy visual treatment

If corners are rounded at all, use them intentionally and sparingly.

---

## Detail Page Direction

Detail pages are the heart of the product.

They must feel:

* worth reading
* structured enough to scan
* credible enough to return to
* rich enough to support serious use

### Every detail page should support:

* immediate recognition of what the entry is
* strong summary and orientation metadata
* clear sectional structure
* narrative + structured blocks in balance
* cross-reference discovery
* category-specific rendering without fragmenting the product

### Detail pages should not feel like:

* article blogs
* docs generated from markdown only
* UI component galleries
* dashboard forms

A good detail page should feel like:

* a technical reference sheet
* a well-edited chapter page
* a system record with narrative intelligence

---

## Category Identity

The four categories should feel related, but not identical.

Each category should have its own visual accent logic.

### Failure Modes

Tone:

* cautionary
* structural
* diagnostic

Visual feel:

* warning without alarmism
* progression, escalation, signal tracking
* strong relationship to severity and lifecycle

Accent (implemented):

* **forest green** (`--accent-fm`) — picks up the "diagnostic / structural" tone without pulling in red/amber, which are reserved for severity and hero-signal use respectively

### Tech Decisions

Tone:

* analytical
* comparative
* balanced

Visual feel:

* duality, comparison, structured evaluation
* less dramatic than Failure Modes

Accent (implemented):

* **burnt orange** (`--accent-td`) — a warmer, reference-manual orange, deliberately *not* the pure blue the earlier draft of this doc suggested. Blue is reserved for the homepage `Entries` hero stat; making it a category color would overload it

### Red Flags

Tone:

* alert
* sharp
* signal-oriented

Visual feel:

* early-warning system
* strong scanability
* urgency without chaos

Accent (implemented):

* **crimson red** (`--accent-rf`) — saturated but editorial, not emergency-siren. Do not let this bleed into severity rendering: severity is a *grayscale weight ramp*, not a color; RF's crimson is category identity only

### Engineering Playbook

Tone:

* practical
* constructive
* operational

Visual feel:

* steps, actions, ownership, outcomes
* usable and procedural

Accent (implemented):

* **plum purple** (`--accent-ep`) — distinct from FM's green and TD's orange so the four categories form a clearly separated palette. The earlier teal/green-blue suggestion was dropped because it read too close to FM's forest green at small sizes

### Important note

These accents should support category recognition.
They should not fragment the product into four unrelated brands.

**Single source of truth:** the four accent tokens are defined in `src/styles/tokens.css` under the *Category accents* section, and cascade everywhere through the `--accent-current` variable (set by `[data-accent="fm"|"td"|"rf"|"ep"]`). Every place that needs "the current category's color" (homepage card heads, detail masthead edition strip, related-entries frame, etc.) reads `--accent-current` rather than hardcoding a hex. If you change the palette, change `tokens.css` — nowhere else.

---

## Severity encoding

Severity is a cross-cutting attribute that shows up on Failure Modes, Red Flags, and Tech Decisions (as `severityIfWrong`). The site uses a **strict separation of channels**:

* **color = category identity** (FM = green, TD = orange, RF = crimson, EP = plum)
* **weight = severity** (a grayscale ramp from paper to near-black)

These two channels are kept orthogonal so that a reader can glance at any entry card and tell *which category* and *how heavy* independently, without them ever collapsing into a single hue.

### The severity ramp

Five steps, defined as `--sev-low`, `--sev-medium`, `--sev-medium-high`, `--sev-high`, `--sev-critical` in `tokens.css` along with matching `--sev-*-ink` foregrounds for legibility:

| Level           | Fill                     | Ink          |
|-----------------|--------------------------|--------------|
| `low`           | paper (lightest gray)    | near-black   |
| `medium`        | light gray               | near-black   |
| `medium-high`   | mid gray                 | near-black   |
| `high`          | dark gray                | white        |
| `critical`      | near-black               | white        |

An earlier draft used a sepia ramp; it was replaced with grayscale because sepia clashed with the saturated category accents and blurred the line between "color" and "weight".

### Where the ramp is applied

* **Entry cards** — card fill darkens through the ramp via the `fillFromSeverity` prop on `EntryCard`. "Scan the grid for weight first, then read the names" is the explicit reading order.
* **Detail masthead severity pill** — uses the matching `--sev-*` token so the pill color matches the card the reader just came from.
* **MetaRail severity cell** — same tint + ink flip.
* **FM landing reading-guide "Severity key" panel** — shows the five level chips so readers decode the ramp once.

### What the ramp is *not* for

* Do **not** tint lifecycle, frequency, recovery, or confidence cells with severity color.
* Do **not** reuse the ramp for any non-severity purpose. If a future field needs a weight-style ramp, define a new ramp with a different visual signature.
* Do **not** introduce a category-colored severity variant (e.g. "green-to-red for FM"). Color belongs to category identity, full stop.

---

## Reading width

Long-form prose paragraphs on this site are **not capped by a global `max-width`**. Every container that wraps a prose paragraph owns its own reading width.

This was a deliberate reversal. The first draft put `max-width: var(--reading-max)` (~70ch) on the global `p` selector, which produced the well-known "dangling last line" problem — a short closing phrase wrapping alone below a long balanced paragraph, impossible to un-break with `text-wrap: balance` because the cap was narrower than the container. Removing the global cap let `text-wrap: balance` and `pretty` do their job, and let individual containers (detail prose column, FM landing intro panel, operator notes body) choose reading widths appropriate to their own layout.

Practical rule for any new container that hosts prose:

1. Do not set `max-width` on the `<p>` itself.
2. Set the column width on the **container**, not the paragraph.
3. Trust `text-wrap: pretty` (and `balance` where supported) to handle widows and awkward breaks.

---

## Attribute glyph decisions

For the record of a decision already made: the site experimented with small mono-line glyphs per ordinal attribute (severity triangle, frequency tally marks, recovery staircase, confidence bullseye) to appear next to labels on the FM landing reading-guide cards and the detail MetaRail cells. They were removed because:

* attribute *types* are already identified by short, high-contrast uppercase labels (`SEVERITY`, `FREQUENCY`, etc.) — the glyphs duplicated, rather than added, signal
* four small icons on every label cell read as KPI-dashboard decoration rather than editorial annotation
* the site's existing vocabulary (saturated category color + grayscale severity ramp + bar ladders + catalog numbers) is already dense; adding a fifth layer crossed into noise

The one glyph kept is the **trend chevron** (↗) for `frequency: "increasing"`. It survives because it carries information that no word or color carries: a *direction*. An attribute-type glyph says "this cell is about severity" (redundant with the label); a trend glyph says "this pattern is rising" (a distinct claim).

Before reintroducing per-attribute glyphs for any reason, re-read this rationale and justify the change explicitly.

---

## Interaction Direction

Interaction should serve reading and navigation, not spectacle.

### Preferred interaction qualities

* crisp
* subtle
* deliberate
* low-friction
* confidence-building

### Good interactions

* expand/collapse where useful
* hover states that clarify structure
* section highlighting
* smooth but restrained transitions
* anchor jumps for long pages
* index-to-detail continuity

### Avoid

* flashy parallax
* excessive motion
* novelty-driven hover tricks
* microinteractions that distract from reading
* animation-first design decisions

The site should feel stable and inspectable.

---

## Motion Principles

Motion is allowed, but should be minimal and purposeful.

Use motion to:

* show expansion / collapse
* clarify active state
* guide transitions between browse and detail
* soften structural shifts

Do not use motion to:

* impress
* dramatize content
* create artificial delight
* compensate for weak hierarchy

A useful rule:
**motion should support cognition, not compete with it**.

---

## Visual Language to Avoid

These patterns should generally be avoided unless there is a strong specific reason.

### Avoid:

* generic Tailwind-startup look
* over-rounded component systems
* chip / pill overload
* giant hero sections with too little substance
* too many gradient backgrounds
* dribbblified AI site aesthetics
* “premium” black-and-gold clichés
* overuse of glassmorphism, blur, floating panels
* generic dashboard widgets
* icon-library dependence as the main personality source

### Especially avoid:

* designs that look like the site is selling software subscriptions
* designs that feel like an AI-created landing page before content exists

---

## Preferred Structural Motifs

These motifs are encouraged where useful:

* codes / identifiers
* margin rails
* section markers
* divider systems
* chapter or dossier tabs
* metadata tables / strips
* side annotations
* layered paper / manual / field-guide metaphors, used subtly
* tabloid or bulletin treatment in controlled sections

These motifs help the site feel distinct and reference-like.

They should be used carefully so the site remains readable and modern.

---

## Content-First UI Rules

The UI should never make the content feel secondary.

### Therefore:

* summaries should always be easy to spot
* metadata should clarify, not clutter
* cross-links should be meaningful, not decorative
* visual system should reinforce schema structure
* each category template should reflect its content model

If a design choice looks clever but weakens:

* scanability
* content hierarchy
* comparison
* trust
  then it is the wrong choice.

---

## Long-Form Readability Rules

Many detail pages will be long.

So the design must support:

* readable line lengths
* section rhythm
* clear anchor points
* visible section labels
* strong contrast between narrative and metadata
* comfortable vertical pacing

Long pages should feel:

* navigable
* deliberate
* structurally segmented

Not:

* exhausting
* bloggy
* like one endless white page

---

## Mobile and Responsive Direction

Responsive design should preserve structure, not flatten everything into generic stacked cards.

### On smaller screens:

* hierarchy must remain obvious
* section markers should survive
* metadata should still be readable
* dense pages should remain navigable
* side-rail ideas may collapse, but should not disappear conceptually

### Avoid on mobile:

* shrinking everything into soft generic cards
* losing category identity
* dropping key metadata because the layout cannot handle it

The mobile version should feel like a compact field guide, not a stripped-down app clone.

---

## Accessibility Direction

Accessibility should be part of the design language, not an afterthought.

Design expectations:

* strong contrast
* clear typography
* no meaning carried by color alone
* obvious headings and section hierarchy
* interactive elements that are visible and understandable
* long-form content that remains easy to navigate

Because the site is reference-first, accessibility and readability are deeply aligned.

---

## Print and Screenshot Friendliness

The site should be designed with “reference portability” in mind.

Even if not fully print-optimized on day one, the design should naturally support:

* clean screenshots
* printable sections
* strong grayscale readability
* stable hierarchy when exported or shared

This is another reason to avoid fragile decorative design.

---

## Design Quality Filter

Before accepting a page or component, ask:

1. Does this feel like a reference system or a startup product?
2. Does the structure become clearer because of this design choice?
3. Would an experienced engineer take this page seriously?
4. Is the category identity visible without becoming gimmicky?
5. Is the content easier to scan, compare, or understand?
6. Does this look too much like default AI-generated UI?

If the answer to the last question is yes, redesign it.

---

## Practical Build Rules for Designers and Builders

When designing or implementing pages:

* prefer stronger structure over extra decoration
* prefer typography and layout over novelty effects
* prefer category-aware templates over one generic template for everything
* prefer clear metadata systems over floating UI sugar
* keep the product visibly unified across all four categories

Do not:

* redesign the whole system page by page
* invent a new interaction language per category
* let one category become hyper-stylized while the others stay generic
* allow the product to drift into “default modern website” mode

---

## Working Design Motto

**Make it feel like something engineers would keep open while thinking.**

## One-Sentence Rule

**If a design choice makes the site feel more like a SaaS product than a technical reference system, it is probably the wrong choice.**

