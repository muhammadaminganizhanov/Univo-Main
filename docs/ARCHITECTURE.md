# UNIVO digital architecture — Phase 1

## 1. Brand source

UNIVO Brand Book **v1.2.2**, status APPROVED, 13.10.2026, owner — Ганижанов Мухаммадамин.
Found in `~/Brand/brand/univo/brandbook-v1.2.2/` (v1.0 – v1.2.1 are archived). Version verified by
`scripts/version.json`, `internal/changelog.md` and the colophon page, not by file name.
Master files: `~/Brand/brand/univo/master-assets/` (logo, symbol, icons, Onest, tokens).

### Deviations from the Brand Book (decided by the newer Phase 1 brief, 14.10.2026)

| Topic | Brand Book v1.2.2 | Site | Why / open question |
|---|---|---|---|
| Tech direction name | UNIVO DEV, Indigo dot | **UNIVO TECH**, Indigo dot | Brief renames the direction. Official TECH lockup files must be issued |
| Products | Form A: dot = colour of the direction that makes them | RETAIL, SLOT sit directly under UNIVO → **neutral dot** | Book fallback: "otherwise keep the dot neutral". Owner to decide colour |
| Lockups TECH / RETAIL / SLOT | Not in master-assets | Generated with the book's own lockup rule (`packages/brand/scripts`) | Replace with official files when made |
| Display size | 128 px @1440 | 120 px @1440 | Headline is a 2-line sentence, not one word |

## 2. Ecosystem model

`packages/content/src/ecosystem.ts` — one typed list. Every list, link, colour and switcher reads it.

```
UNIVO               masterbrand  live
├── UNIVO TECH      service      live        independent site → TECH_URL
├── UNIVO PRODUCTION service     live        independent site → PRODUCTION_URL
├── UNIVO RETAIL    product      launching   early access on the master site; RETAIL_URL when it has a site
└── UNIVO SLOT      product      launching   early access on the master site; SLOT_URL when it has a site

Unified at the brand level, not at runtime: each entity is an independent site (own domain, deploy,
SEO). The master site links out with plain external URLs — see `getEcosystemUrl` in `@univo/config`.
```

Statuses: `live | launching | development | private | archived`. Only `live` and `launching` are public.
Adding "UNIVO [NEW]" = one entry (+ accent from the reserve, approved by the owner); its site lives in its own repository/deploy.

## 3. Information architecture (master site)

```
/[locale]                      Home
/[locale]/ecosystem            Ecosystem (key page): directions, products, how they connect
/[locale]/ecosystem/retail     UNIVO RETAIL — pre-launch + early access form
/[locale]/ecosystem/slot       UNIVO SLOT   — pre-launch + early access form
/[locale]/about                About (principles live here — not enough for a separate page)
/[locale]/contact              "Discuss a project" — one form for the whole group (?direction= preselects)
```

Not created on purpose: Projects / Work (no confirmed cases), Principles (folded into About),
Blog / News / Careers / Press (no content).

## 4. Home narrative

1. Hero — principle as headline ("Different businesses. One standard of work.") + the group as one line
   through its members ending in the dot "working result".
2. What UNIVO is — one name for different businesses.
3. Five standards — what connects the group (Brand Book p. 4).
4. Ecosystem — directions as two panels with a shared edge; products as a different, framed list.
5. How the work is organised — one entry point; process line, dot on "result"; one real cross-direction example.
6. Final CTA — "Discuss a project".

No proof / facts section: there are no confirmed cases or figures yet.

## 5. Line and dot — where and why

| Place | Line connects | Dot marks |
|---|---|---|
| Logo | u and n share a stroke | — (identity) |
| Main heading of each page | — | brand punctuation, once per page |
| Hero "group structure" | the four members of the group | the working result |
| Home "how it works" | the four steps | the last step: result |
| Nav current item | short line under the current section | — |

Nowhere else. No decorative underlines, no dots next to list items, no network diagrams.

## 6. i18n

Locale routes `/ru /en /ky`; `proxy.ts` redirects other paths by Accept-Language.
Typed dictionaries: `apps/univo/src/i18n/{ru,en,ky}.ts`; `ru` is the reference type, `en` must match it,
`ky` is a deep partial merged over `ru`. Incomplete locale → notice on every page, `<main lang="ru">`,
excluded from hreflang and sitemap. Entity texts: `Localized<T>` with optional `ky`.

## 7. Forms

Server Actions → `@univo/leads/server` (server-side validation, honeypot) → `LeadDelivery` adapter.
Only `stagingDelivery` exists: validates, discards, and the UI says exactly that, before and after submit.
Future CRM / e-mail / Telegram adapters implement `LeadDelivery.deliver()`; secrets stay server-side.

## 8. SEO / staging

`SITE_ENV=staging` default → `noindex, nofollow` (header + meta + robots.txt), empty sitemap.
Indexing only with `SITE_ENV=production` **and** `SITE_URL`. Canonical, hreflang, OG, title templates are in place.
