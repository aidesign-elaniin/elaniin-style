# Changelog

Every release of the Elaniin plugin. This file is the single source: `scripts/build-docs.py` renders it
in the public landing (the Versions block) and `.github/workflows/release.yml` publishes each entry as a GitHub Release.
Format: `## [x.y.z] - YYYY-MM-DD`, then `### Added | Changed | Fixed` with `-` bullets. Newest first.
Release with `scripts/release.sh <x.y.z>`.

## [Unreleased]

## [1.1.0] - 2026-10-29

### Added
- Complete website mode: site architect (sitemap, phases, collections) and a Next.js site starter with MDX collections, so Claude Code can maintain the site like a CMS.
- Full component library from DESIGN.md v1.87.3: mega-menu, split hero, rotating logo strip, solutions and dialog, success cases, research, FAQ, engagement, routes, CTA, 404 and footer with credentials and AI summary.
- 13 isometric scenes and the official Elaniin icons (software, AI, cloud) on the hero slabs.
- Bilingual kit (EN primary, ES under `/es`) with route table, hreflang, typed dictionaries and tests.
- `add-assets.sh`: copies the real badges, LinkedIn and ChatGPT icons into a site instead of embedding them.
- Demo master project "Nova Logística" (30 pages) published in the docs.
- Checks: `sync-tokens.py`, `check-system.py` (34 contrast pairs, reduced motion), `browser-check.py` and `verify.sh`.
- Developer panel in the landing: quick start, task cards and a sticky index.

### Changed
- Tokens come from one source, `templates/tokens.css`, and every copy is regenerated.
- Hover without lift, scale or glow; touch targets of 40px; gradients only the ones in DESIGN.md.
- Navigation with four entries and a mobile sheet; solutions section on white.
- Code is MIT; logos and favicon stay reserved to Elaniin.
- Install steps follow the real Customize → Plugins flow, with mockups for each step.

### Fixed
- Plugin name collision that duplicated the skill namespace.
- Mobile navigation drawer, dashboard sidebar height, deck phone-frame bezel.
- Clipped isometric scenes and success-cases panel.

## [1.0.3] - 2026-10-20

### Added
- Full motion system: Tailwind-first API (`@theme` and `@utility`), living loops per template and `references/tailwind-api.md`.

### Fixed
- `sm` breakpoint, `surface-dark-card` token, focus ring without border radius, CDN pinned to 4.3.3.

## [1.0.2] - 2026-10-20

### Fixed
- Logo alignment (viewBox) and the official favicon.

## [1.0.1] - 2026-10-20

### Fixed
- Official logos, full-screen decks without overflow, reactive textures and micro-interactions.

## [1.0.0] - 2026-10-20

### Added
- First release: the `elaniin-style` skill for pitch decks, dashboards & reports, and websites & landings. Bilingual EN/ES.
