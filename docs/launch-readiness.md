# Launch Readiness Report — nosilverbullet.dev

> Captured at the end of the Phase A–D consolidation pass. All four
> categories (FM / TD / RF / EP) are implemented; the site ships as a
> pure static build targeting Cloudflare Pages Free.

---

## 1 · Refactored into shared primitives

### New shared components (Phase A)

| Component | Replaces | Used by |
|---|---|---|
| `LandingIntroPanel` | `.xx-landing__intro-text` (×4) | FM, TD, RF, EP landings |
| `ReadingGuide` | `.xx-landing__attr-row` (×4) | FM, TD, RF, EP landings |
| `AttributeLegend` | `.xx-landing__legend*` (×4) | FM, TD, RF, EP landings |
| `AttributeCard` | `.xx-landing__attr*` (×4) | FM, TD, RF, EP landings |
| `LandingGroup` | `.xx-landing__group*` (×4) | FM, TD, RF, EP landings |

### New shared utilities

| Utility | Purpose |
|---|---|
| `.nsb-landing-prelude` | Flex-column outer header on every landing |
| `.nsb-two-col` | Generic 1→2 column grid at ≥820px |
| `.nsb-two-col--wide-gap` | Same + larger inter-column gap |
| `.nsb-two-col--equal` | Same + row-aligned heights |
| `.nsb-skip-link` | Keyboard-skip link styling |

### New shared helpers (`attribute-scales.ts`)

- `severityTagVariant(value)` — maps severity / difficulty to `sev-*` Tag variant
- `severityCardFill(value)` — maps severity / difficulty to `SeverityLevel` for `EntryCard.fillFromSeverity`
- `DIFFICULTY_SCALE` — added in EP phase, used by both EP landing and detail

### Already-shared primitives (left alone, already clean)

`DetailLayout`, `CategoryLayout`, `BaseLayout`, `MetaRail`,
`SectionHeader`, `SectionIndex`, `AtAGlance`, `CalloutBand`,
`LabeledList`, `RelatedEntries`, `EntryCard`, `Tag`, `KeywordList`,
`NumberCard`, `Stamp`.

### Line-count savings

| Area | Before | After | Reduction |
|---|---:|---:|---:|
| 4 landings | 2 001 | 549 | **-73%** |
| 4 details | 2 852 | 2 693 | -6% |
| Total pages code | 5 711 | 3 784 | **-34%** |

Detail-page reduction is smaller by design — those pages legitimately
own category-specific narrative order and signature visuals. Only the
repeated 2-col grid CSS and inline severity mappings were extracted.

---

## 2 · Category-specific by design (kept, not generalized)

### Category-only components

| Component | Category | Why kept |
|---|---|---|
| `WarningSignsByStage` | FM | Stage-based progression is FM-schema-specific (early/mid/late) |
| `OperatorNotes` | FM | Hard-won annotations register; no other category has it |
| `HeardInTheWild` | FM | `commonQuote` is FM-only |
| `OptionsLedger` | TD | A/B option comparison is TD-exclusive |
| `AxisMatrix` | RF | Two-axis layer × signalType chart is RF-specific |
| `SignalQuote` | RF | Field-guide quote hero is RF signature |
| `ProcedureSteps` | EP | Numbered step cards with actions + outputs are EP signature |

### Category-specific detail narratives

Each detail page keeps its own section ordering because the schemas
differ materially:

- **FM** — definition → arc → warning signs → causes → response
- **TD** — options ledger → cost/time → how to decide → signals
- **RF** — signal → usually indicates → check next → under the signal
- **EP** — situation → procedure steps → outcomes → AI effects

Generalizing these into one template would flatten the product. The
shared chassis (`DetailLayout`, `MetaRail`, `AtAGlance`,
`SectionHeader`, `RelatedEntries`, 9-section rhythm) handles the
framing; category pages compose the middle.

---

## 3 · Homepage changes (Phase B)

- **Added** "Pick your way in" — four Q/A rows that route first-time
  visitors to the category matching their actual question ("I've seen
  this go wrong before", "what trade-off am I making", "something
  feels off", "what's the right move here"). Each row uses the
  category's accent color on the code chip.
- **Removed** the "Phase status" dev aside. Replaced with an editorial
  closer: NSB · 01 code plate + working motto pair (*"Software is
  hard. That's the point."* + *"Name the patterns. Show the
  trade-offs. Surface the signals. Make the useful path visible."*).
- **Relabeled** CalloutBand eyebrows on the 4 preview strips for voice
  parity: *Field guide* (FM), *Decision ledger* (TD), *Signal
  bulletin* (RF), *Operating manual* (EP). Previously two said
  "Special section".
- **Kept** the tabloid masthead, 4-card category map, and 6-card-per-
  category preview sections — all already on-brand and scanning well.

---

## 4 · Cross-link & navigation behavior

### Already-strong (verified, untouched)

- `RelatedEntries` handles three tiers cleanly:
  - **Resolved (primary category)** — black-framed ordered list with
    `CAT · NNN · title` pill
  - **Resolved (cross-category)** — same treatment under an "Also
    relevant" subhead with paper-alt fill
  - **Pending** — yellow-eyebrow subgroup with `PEND` marker, honest
    about unbuilt entries rather than hiding them
- `SectionIndex` provides sticky left-rail navigation at ≥1080px with
  a progressive-enhancement scroll-spy + collapsible jump-menu
  fallback at narrow widths
- Catalog reference codes (`FM-05`, `TD-045`) are globally consistent
  — the pill on a detail masthead matches the ref code on every
  incoming cross-link
- 0 broken internal links across 2 663 hrefs on all 157 pages (verified
  programmatically against every built route + asset path)

### Added this pass

- Skip link (`Skip to main content`) on every page, jumps past the
  header nav
- Category-accented shortcut panel on 404 page routing a reader back
  to any of the four catalogs

---

## 5 · Production / readiness fixes

| Area | Fix |
|---|---|
| **OG / social** | `og:type`, `og:title`, `og:description`, `og:url`, `og:site_name` + Twitter card meta on every page |
| **Canonical URLs** | `<link rel="canonical">` computed from `Astro.url.pathname + Astro.site` — set once in `BaseLayout` |
| **Description meta** | Every page now has `<meta name="description">` (falls back to site tagline when a page doesn't pass one) |
| **Theme color** | `<meta name="theme-color">` for browser chrome |
| **Sitemap** | `sitemap.xml` generated at build time from the same loaders that drive the detail routes — can't drift from built routes |
| **Robots** | `robots.txt` with sitemap URL, allow-all (reference-first site, no private areas) |
| **404 page** | Branded, non-apologetic "no such call number" page with four category shortcuts + back-home link |
| **Accessibility** | Skip link, `lang="en"` on every `<html>`, semantic `<main id="nsb-main">`, 0 pages missing `<title>` / description |
| **Print / screenshot** | `@media print` rules strip nav/footer/rail, flatten ink, force page-break-avoid on framed panels |
| **CF Pages Free compat** | 0 runtime `fetch()` calls in built HTML · 0 inline `on*=` handlers · 8.1 MB total build · 100 KB total CSS across 8 hash-named files |

---

## 6 · Remaining backlog

### Editorial backlog (content, not code)

- **Pending cross-refs** — `RelatedEntries` surfaces `PEND` markers
  for referenced-but-unauthored entries (does **not** render as
  broken links). Full inventory lives in `docs/pending-xrefs.md`,
  auto-generated by `scripts/normalize-xrefs.mjs`. Summary:
  **253 unique pending slugs** referenced by authored entries —
  FM 3, TD 21, RF 123, EP 106. The most-referenced ones are the
  strongest editorial candidates to author next.
- **Dupe audit** — `docs/pending-xrefs-review.md` (generated by
  `scripts/find-xref-duplicates.mjs`) lists plausible re-routes and
  consolidations. 14 high-confidence consolidations have already
  been applied via `scripts/apply-xref-reroutes.mjs`; remaining
  items need editorial judgment.
- **Author new playbooks / failure modes** as the patterns come up in
  practice — schemas and templates handle expansion automatically

### Technical backlog (nice-to-have, not blockers)

- **OG image rendering** — each page currently has OG text fields but
  no image. A build-time `og-image.png` generator (Satori / resvg)
  would add social cards without runtime infrastructure
- **`@astrojs/sitemap` integration** — the hand-rolled sitemap works;
  switching to the integration would reduce code at the cost of a
  dependency. Not urgent
- **Dark mode** — design direction doesn't require it, but the
  existing token architecture (`--color-paper`, `--color-ink`, etc.)
  is already structured to support it via a `:root[data-theme="dark"]`
  override layer

---

## 7 · Ready for deployment?

**Yes.** The site is ready to deploy to Cloudflare Pages Free.

Deploy plan:

1. `npm run build` → `dist/` (static output, 157 HTML pages + 100 KB
   assets)
2. Connect the repo to CF Pages; set build command `npm run build`
   and output directory `dist`
3. No environment variables, no runtime config, no functions, no KV
4. Confirm the deployed origin matches `astro.config.mjs → site`
   (`https://nosilverbullet.dev`); canonical URLs and the sitemap
   depend on it

Quality bar from `docs/product-brief.md §Quality Bar` — all satisfied:

- [x] IA feels coherent across all four sections
- [x] Entries feel structurally related, not randomly designed page by page
- [x] Content is readable at both scan and deep-read levels
- [x] UI feels deliberate and original, not default-template polished
- [x] Category differences feel meaningful without fragmenting the product
- [x] Site is maintainable and expandable through structured content
