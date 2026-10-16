# UNIVO — masterbrand website

One Next.js site (SEO, RU / EN / KY). Directions and products have their own sites on their own domains;
this site only links to them.
Brand source of truth: **UNIVO Brand Book v1.2.2 (APPROVED, 13.10.2026)**.

```
src/
  app/          Pages (Next.js App Router): /[locale], /ecosystem, /about, /contact
  components/   Site sections and forms
  i18n/         RU / EN / KY dictionaries
  lib/          Routes, SEO, entity links
  shared/       brand (tokens, logo, Onest) · config (locales, env, contacts) · content (ecosystem
                model) · ui (buttons, fields, primitives) · leads (lead validation, delivery)
public/         Icons, OG image
assets/brand/   Master brand files (tokens, icons)
scripts/        Visual QA, brand generators
tests/          node:test — lead validation, wordmark geometry
docs/           ARCHITECTURE.md · ART-DIRECTION.md
```

## Run

```bash
corepack enable            # pnpm via corepack (packageManager pinned)
pnpm install
cp .env.example .env.local   # optional
pnpm dev                   # http://localhost:3100 (redirects to /ru)
```

## Checks

```bash
pnpm lint        # ESLint (next/core-web-vitals + typescript)
pnpm typecheck   # tsc
pnpm test        # node:test — lead validation & staging delivery
pnpm build       # production build
pnpm qa:visual   # Playwright screenshots + overflow / a11y smoke (needs `pnpm start` running)
```

## Environment

| Variable | Default | Meaning |
|---|---|---|
| `SITE_ENV` | auto | Unset: Vercel production → `production` (indexed), previews / local → `staging` (noindex) |
| `SITE_URL` | auto | Public origin. Unset on Vercel production: the project's production domain |
| `TECH_URL` / `PRODUCTION_URL` / `RETAIL_URL` / `SLOT_URL` | — | External URLs of the independent ecosystem sites. Unset: directions → contact form, products → early-access page |
| `LEAD_DELIVERY` | `staging` | `staging` validates and discards — UI says so. Any other value = live mode with no adapter → honest failure |

Staging is `noindex, nofollow` three ways: `X-Robots-Tag`, meta robots, `robots.txt`.

SEO: per-page title / description / canonical, hreflang (RU, EN, x-default; KY joins once translated),
OpenGraph + Twitter cards, `sitemap.xml` with alternates, `robots.txt`, web manifest, and schema.org
JSON-LD (Organization with its directions and products, WebSite, WebPage types, BreadcrumbList).

## Architecture & deploy

One Next.js site. Every other entity (TECH, PRODUCTION, RETAIL, SLOT) is an independent website
with its own domain, repository/deploy and SEO. This site presents the ecosystem and links out with
ordinary external links (`TECH_URL`, … — one config: `getEcosystemUrl` in `src/shared/config`).
No microfrontends, no shared runtime, no `vercel.json` services.

`src/shared/*` holds brand, config, content, UI and lead code, imported as `@univo/*` (tsconfig paths).

Vercel: import the repo as one Next.js project — Root Directory is the repo root, no `vercel.json`.
Env vars: see `.env.example`.
