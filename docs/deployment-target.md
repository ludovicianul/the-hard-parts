# Deployment Target — nosilverbullet.dev

## Purpose

This document defines the deployment target and runtime constraints for nosilverbullet.dev.

It exists to keep implementation decisions aligned with the intended hosting model.

This is not a general infrastructure document.
It is a **product build constraint document**.

---

## Primary Deployment Target

Primary deployment target:

* **Cloudflare Pages**
* **Free plan preferred**

The project should be built to remain compatible with Cloudflare Pages Free for as long as reasonably possible.

---

## Core Runtime Assumption

Nosilverbullet.dev should be treated as a **pure static site by default**.

That means:

* no backend required for core functionality
* no database
* no server-side rendering requirement
* no runtime API dependency for page rendering
* no authenticated user-specific experience in v1
* no dependence on a persistent server process

Everything important for the initial product should be deliverable through:

* static routes
* build-time rendering
* structured local content files
* static assets
* client-side interactions where needed

---

## What This Means in Practice

The site should be built assuming:

* category pages are statically generated
* detail pages are statically generated
* content comes from local JSON files at build time
* cross-links resolve from local structured content
* navigation, filtering, and browse behavior work without a backend

The default implementation model is:
**static-first, content-first, CDN-friendly**.

---

## V1 Platform Constraints

For version one, avoid introducing features that require runtime infrastructure.

### Specifically avoid by default

* server-rendered page dependency
* backend search services
* authentication systems
* user accounts
* database-backed content delivery
* runtime content APIs
* personalization tied to sessions
* server actions or API routes unless explicitly approved
* Cloudflare Pages Functions unless there is a clear justified reason

These are not banned forever.
They are outside the default deployment target for v1.

---

## Search Guidance

If search is added in the first version, it should prefer:

* statically generated search index data
* client-side search over local indexed content

Avoid for v1:

* backend search engines
* runtime query services
* server-side semantic search infrastructure

The search solution should preserve the static-first deployment model.

---

## Content Loading Rules

Content should come from:

* repository-managed files
* structured JSON content
* build-time transforms if needed

Content should not depend on:

* CMS runtime fetches
* external databases
* external APIs for essential page content

If a CMS is ever introduced later, it should not compromise the static deployment model unless deliberately approved.

---

## Framework / Rendering Guidance

Any framework used for the site should be configured in a way that supports:

* static generation
* static export where appropriate
* low runtime complexity
* CDN delivery of pages and assets

Avoid framework modes that default into:

* dynamic rendering
* SSR for ordinary page requests
* server-only route logic for core content pages

If a framework offers both static and runtime-heavy modes, the static mode should be treated as the default.

---

## Asset Strategy

Assets should be handled conservatively to stay compatible with the target platform.

Guidance:

* optimize images
* avoid unnecessarily large binaries
* avoid oversized decorative media
* prefer efficient static assets
* keep the asset footprint disciplined

The site is a reference product, not a media-heavy application.

Its performance and portability should reflect that.

---

## Build and Deployment Discipline

Because Cloudflare Pages Free is the target, builders should behave as if deployment budget matters.

That means:

* avoid unnecessary deployment churn
* avoid architecture that assumes paid hosting features
* prefer changes that keep the site simple to build and ship
* do not introduce runtime complexity casually

The deployment target should influence product decisions early, not only at launch time.

---

## Approved Default Architecture

The intended default architecture is:

* static content files in repository
* typed content loaders
* statically generated category pages
* statically generated detail pages
* reusable templates
* client-side navigation enhancements where useful
* optional client-side search later

This architecture is strongly preferred unless there is a compelling product reason to change it.

---

## What Would Require Explicit Approval

The following changes should be treated as exceptions and explicitly justified before adoption:

* adding Cloudflare Pages Functions
* adding any backend or runtime API
* adding authentication or user-specific features
* introducing a database
* making page rendering depend on runtime fetches
* choosing SSR for core content routes
* adding external services that are essential to normal page rendering

The question should always be:
**Does this feature justify moving away from a static-first Cloudflare Pages Free-compatible architecture?**

If the answer is no, do not add it.

---

## Why This Constraint Exists

This deployment target is intentional because the product is:

* structured content
* mostly static reference material
* page-based and navigational
* not operationally dependent on live user data

That makes it a strong fit for:

* simple deployment
* low operational burden
* good caching behavior
* inexpensive hosting
* long-term maintainability

The goal is to preserve those advantages.

---

## Future Expansion Policy

Later, the project may add features that challenge the static model.
Examples might include:

* advanced search
* annotations
* saved reading state
* account features
* editorial tooling

If that happens, the default rule should still be:

* keep the public reference site as static as possible
* isolate runtime needs carefully
* do not make the whole product dynamic unless truly necessary

---

## Working Deployment Motto

**If it can be static, keep it static.**

## One-Sentence Rule

**Nosilverbullet.dev should be built as a Cloudflare Pages Free-friendly static reference site unless a runtime feature is explicitly justified and approved.**

