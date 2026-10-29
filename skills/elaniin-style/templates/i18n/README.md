# i18n kit (DESIGN.md section 13 and 12)

Drop-in library for a bilingual (English primary, Spanish secondary) Next.js 16 site, taken from the reference site and made generic.
It needs a SERVER (a `proxy.ts` rewrite), so it is NOT compatible with `output: "export"` (the site-starter). On a static export use the
prefix-both variant described in `references/i18n.md`.

| File | What it is |
|---|---|
| `i18n.ts` | `langs`, `defaultLang`, `otherLang`, `hasLang` |
| `routes.ts` | the ONE route table (slug per language), `href(key, lang, anchor?)`, `alternates()`, `switchLinks()`. A new page is added here FIRST |
| `proxy-rules.ts` + `proxy.ts` | pure `resolveLocale(pathname)` (English no prefix → rewrite to `/en/…`, Spanish slug → internal folder, `/en/…` → 308, unknown → 404) and the Next 16 proxy that calls it. Copy `proxy.ts` to `src/proxy.ts` |
| `region.ts` | region cookie (`?country=`, `x-vercel-ip-country`) used by the logo strip |
| `metadata.ts` | `buildMetadata(lang, route, page)`: translated title/description, self canonical, hreflang en/es/x-default, Open Graph locale, `ALLOW_INDEXING` |
| `site.ts` | `siteUrl()` (`SITE_URL`); fails loudly if indexing is on without it |
| `format.ts` | `Intl` formatting: English `en-US`, Spanish `es-SV`; `plainSpaces` |
| `template.ts` | `fill("Hello {name}", { name })` — never concatenate sentences |
| `anchors.ts` | section ids (English in both languages) |
| `language-switch.tsx` | the EN \| ES links (same page in the other language, `hreflang`, `aria-current`, lands on the section being read) |
| `*.test.ts` | Vitest: routes, proxy rules, metadata, formats, plus `copy-guard` (Spanish text in components) and `jsx-literals` (any literal text node or `aria-label`/`alt`/`placeholder`/`title`) |

Layout it expects: `src/lib/*` (these files), `src/proxy.ts`, `src/app/[lang]/…` (the folder is named after the ENGLISH slug), `src/content/{en,es}/<section>.ts`
typed against `src/content/schema.ts`. Read `references/i18n.md` before using it.

**Verified:** the kit type-checks and its logic tests (routes, proxy rules, metadata, formats, region, template, i18n) pass in a Next 16 project. The three guard tests (`copy-guard`, `jsx-literals`, `anchors`) scan the whole `src/` and are meant for a project that has adopted the dictionaries: they fail by design on the single-language `site-starter`, whose components still carry Spanish text. Turn them on once every section reads its strings from `src/content/{en,es}/`.
The scenes of `templates/iso/scenes/` type-check against `templates/iso/` (hero-stack, `useClock(periodMs, tickMs, restMs, enabled)`, `easeOutCubic`).
