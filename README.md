# UNIVO — masterbrand website

One Next.js site (SEO, RU / EN / KY). Directions and products have their own sites on their own domains;
this site only links to them.
Brand source of truth: **UNIVO Brand Book v1.2.2 (APPROVED, 13.10.2026)**.

```
apps/
  univo/        The website                                  :3100
packages/
  brand/        Tokens (Brand Book master tokens + web roles), Onest, logo / symbol / lockups
  config/       Locales, environment (SITE_ENV / URLs), contacts, legal
  content/      Ecosystem model (entities, statuses, accents) + shared labels
  ui/           Shared primitives: buttons, fields, status, notice, line+dot, group switcher
  leads/        Lead model, server-side validation, delivery abstraction (staging only)
docs/
  ARCHITECTURE.md · ART-DIRECTION.md
```

## Run

```bash
corepack enable            # pnpm via corepack (packageManager pinned)
pnpm install
cp .env.example apps/univo/.env.local   # optional
pnpm dev                   # http://localhost:3100 (redirects to /ru)
```

## Checks

```bash
pnpm lint        # ESLint (next/core-web-vitals + typescript)
pnpm typecheck   # tsc in every workspace
pnpm test        # node:test — lead validation & staging delivery
pnpm build       # production build
pnpm qa:visual   # Playwright screenshots + overflow / a11y smoke (needs `pnpm start` running)
```

## Environment

| Variable | Default | Meaning |
|---|---|---|
| `SITE_ENV` | `staging` | `production` allows indexing **only** together with `SITE_URL` |
| `SITE_URL` | — | Public origin of the site. Domains are not purchased: never hardcode one |
| `TECH_URL` / `PRODUCTION_URL` / `RETAIL_URL` / `SLOT_URL` | — | External URLs of the independent ecosystem sites. Unset: directions → contact form, products → early-access page |
| `LEAD_DELIVERY` | `staging` | `staging` validates and discards — UI says so. Any other value = live mode with no adapter → honest failure |

Staging is `noindex, nofollow` three ways: `X-Robots-Tag`, meta robots, `robots.txt`.

## Architecture & deploy

One frontend: `apps/univo`. Every other entity (TECH, PRODUCTION, RETAIL, SLOT) is an independent website
with its own domain, repository/deploy and SEO. This site presents the ecosystem and links out with
ordinary external links (`TECH_URL`, … — one config: `getEcosystemUrl` in `@univo/config`).
No microfrontends, no shared runtime, no `vercel.json` services.

`packages/*` are build-time libraries (tokens, logo, Onest, locales, ecosystem data, UI primitives,
lead validation) compiled into the site.

Vercel: one project — import the repo, **Root Directory** `apps/univo`, framework Next.js; Vercel installs
the pnpm workspace from the repo root. Env vars: see `.env.example`.
