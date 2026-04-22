# nosilverbullet.dev

A reference-first editorial field guide for software people.

Four sections:

- **Failure Modes** — named software-engineering failure patterns
- **Tech Decisions** — trade-off references for consequential engineering decisions
- **Red Flags** — early warning signals in code, teams, process, leadership, and AI usage
- **Engineering Playbook** — practical playbooks for recurring engineering situations

This repository holds both the canonical editorial content (`content/`) and the
static site implementation (`src/`). The site is **static-first by design** and
targets **Cloudflare Pages Free**. No backend, no database, no runtime API
dependency for page rendering.

See `docs/` for the product, schema, design, build, route, and deployment
contracts — those documents are the source of truth; this README is a runbook.

---

## Status

**Phase 1 — Technical scaffold.** Routes, loaders, schemas, validation, and
layout shells are wired. No final UI yet. Phase 2 (Failure Modes vertical
slice) has not started.

---

## Stack

- **Astro 5** in static output mode (`output: "static"`).
- **TypeScript strict**.
- **Zod** schemas for content validation.
- **Plain CSS** with design tokens (no Tailwind, no component library).
- **Node 20+** recommended.

## Commands

```bash
npm install           # install dependencies
npm run dev           # local dev server
npm run build         # produces static `dist/` — deployable to Cloudflare Pages
npm run preview       # preview the built output
npm run validate      # run content integrity checks without building
npm run typecheck     # astro check (TS + .astro)
```

## Project structure

```
content/                                    # editorial source of truth (JSON)
  failure-modes/failure-modes.json
  tech-decisions/tech-decisions.json
  red-flags/red-flags.json
  engineering-playbook/
    engineering-playbook-ai.json
    engineering-playbook-architecture.json
    engineering-playbook-delivery.json
    engineering-playbook-operations.json
    engineering-playbook-team.json

docs/                                       # product/schema/design/build/route docs
public/                                      # static assets (favicon, future og images)
src/
  content/
    schemas/                                 # Zod schemas per category + shared primitives
  lib/
    categories.ts                            # canonical category metadata (code, route, file paths, accent)
    load.ts                                  # content loaders (reads JSON via fs at build time)
    resolve.ts                               # cross-reference resolver (slug -> entry + route)
    validate.ts                              # slug uniqueness / subcategory / cross-ref checks
  layouts/                                   # BaseLayout, CategoryLayout, DetailLayout
  pages/                                     # 9 canonical routes
  styles/                                    # tokens.css + globals.css
scripts/validate-content.ts                  # standalone validator CLI
astro.config.mjs
tsconfig.json
package.json
```

## Routes

Implemented in Phase 1 (see `docs/route-map.md`):

```
/
/failure-modes
/failure-modes/[slug]
/tech-decisions
/tech-decisions/[slug]
/red-flags
/red-flags/[slug]
/engineering-playbook
/engineering-playbook/[slug]
```

All detail pages are statically generated at build time from local JSON slugs.
No runtime routing or backend.

## Content

- Content lives in `content/`, one canonical file per category (Engineering
  Playbook is split across five files by subcategory — see
  `docs/content-location.md`).
- Every entry has a stable `slug` which is its canonical route key.
- Cross-references between entries use slugs, not display titles.
- Page components never import JSON directly — they go through
  `@/lib/load` and `@/lib/resolve`.

### Adding an entry

1. Open the relevant category JSON under `content/`.
2. Add an entry at the end of the `entries` array, following the shape of
   existing entries (or the matching schema under `src/content/schemas/`).
3. Make sure the slug is unique across the entire site (kebab-case, lowercase,
   hyphen-separated — see `docs/content-schema.md`).
4. Ensure the subcategory (`category` / `family` / `layer`) matches one of the
   values declared in the file's top-level `category` block.
5. Run `npm run validate` and `npm run build` to verify.

## Content validation

Validation runs:

- automatically at build time (from every page via `ensureValidated()`)
- on demand via `npm run validate`

Checks performed:

- **Slug uniqueness** (globally, across all four categories) — fails build
- **Subcategory validity** — every entry's `category` / `family` / `layer`
  must be declared in its file's top-level subcategory list — fails build
- **Enum conformance** — severity / frequency / patternConfidence values are
  validated at parse time via Zod schemas
- **Cross-reference integrity** — every related-slug in fields like
  `relatedFailureModes`, `oftenLeadsTo`, `adjacentDecisions`, etc. must
  resolve to an existing entry somewhere on the site

### Strict mode for cross-references

Cross-reference integrity runs as a **warning** by default because the
current content is still being migrated. To make it fail the build:

```bash
NSB_STRICT_REFS=1 npm run build
NSB_STRICT_REFS=1 npm run validate
```

Flip this to the default once content is clean.

## Styling philosophy

See `docs/design-direction.md`. The scaffold sets up tokens only — not
final components. No Tailwind-startup defaults, no pill clusters, no
gradient cards. Category identity is expressed via a single CSS variable
(`--accent-current`) set by the layout, not via duplicated components.

## Deployment

Target: **Cloudflare Pages, Free plan**.

1. Push this repository to GitHub.
2. In Cloudflare Pages, connect the repo.
3. Build command: `npm run build`
4. Output directory: `dist`
5. No Pages Functions required. No environment variables required.

The output is a plain static site and can also be served from any static
host (Netlify, GitHub Pages, etc.) without changes.

## Schema alignment status

- **Failure Modes** — **aligned**. Content, docs, and types agree. Canonical
  shape: `warningSigns: { early, mid, late }`; first-class `oftenLeadsTo` /
  `oftenCausedBy` relationship fields; closed `frequency` enum; slugs omit
  leading articles ("the-"). No compatibility layer.
- **Tech Decisions** — **aligned**. Content, docs, and types agree. Canonical
  naming (`category` / `categories`); canonical subcategories (`architecture`,
  `product-delivery`, `team-operations`, `quality-delivery`, `ai-systems`);
  richer content model kept (including `whatThisIsReallyAbout`, `whyItFeelsHard`,
  `keyFactors`, `evidenceNeeded`, `defaultBias`, `reversibility`,
  `whenToRevisit`, `commonBadReasons`, `antiPatterns`, `goodSignalsForA/B`,
  `costBearer`, `timeHorizonNotes`, `adjacentDecisions`); strict structured
  comparison objects; AI fields renamed to site-wide canonical
  (`aiCanHelpWith` / `aiCanMakeWorseBy` / `aiSpecificNotes`); option objects
  use plural `failureModesWhenMisused`; `patternConfidence` allows
  `low | medium | medium-high | high`. No compatibility layer.
- **Red Flags** — **aligned**. Content, docs, and types agree. Two-axis
  classification (`layer` + `signalType`) canonical; canonical layers
  (`code | team | process | leadership | ai`) and signal types
  (`structural | behavioral | delivery | communication | architectural |
  operational | ai-quality`) match the actual content; richer RF-specific
  field names preserved (`whatYouNotice`, `whatItUsuallyIndicates`,
  `whatToCheckNext`, `likelyConsequences`, `exampleSignals`, `falseFriends`);
  diagnostic fields retained (`decisionHeuristic`, `commonContexts`,
  `leadingIndicators`, `diagnosticQuestions`, `commonRootCauses`,
  `antiPatterns`, `ownerMostLikelyToNotice`, `ownerBestPlacedToAct`,
  `timeHorizon`, `notNecessarilyAProblemWhen`); owner and AI effect fields
  are arrays only; `aiSpecificVariant` renamed to site-wide
  `aiSpecificNotes`; `severity` allows
  `low | medium | medium-high | high | critical`; `frequency` uses shared
  FrequencyEnum. Secondary-axis `signalType` validated at build time. No
  compatibility layer.
- **Engineering Playbook** — matches docs closely, no major drift.

All four categories now have aligned content / docs / types / validation.
There is no known schema-drift debt.

## License

TBD.
