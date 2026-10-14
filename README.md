# UNIVO — digital ecosystem

Phase 1: digital foundation + the UNIVO masterbrand website.
Brand source of truth: **UNIVO Brand Book v1.2.2 (APPROVED, 13.10.2026)**.

```
apps/
  univo/        Masterbrand site (complete)                 :3100
  tech/         UNIVO TECH — placeholder shell only          :3101
  production/   UNIVO PRODUCTION — placeholder shell only    :3102
packages/
  brand/        Tokens (Brand Book master tokens + web roles), Onest, logo / symbol / lockups
  config/       Locales, environment (SITE_ENV / URLs), contacts, legal
  content/      Ecosystem model (entities, statuses, accents) + shared labels
  ui/           Shared primitives: buttons, fields, status, notice, line+dot, group switcher
  leads/        Lead model, server-side validation, delivery abstraction (staging only)
docs/
  ARCHITECTURE.md
```

## Run

```bash
corepack enable            # pnpm via corepack (packageManager pinned)
pnpm install
cp .env.example apps/univo/.env.local   # optional: link to the local TECH / PRODUCTION shells
pnpm dev                   # UNIVO → http://localhost:3100 (redirects to /ru)
pnpm dev:all               # UNIVO + TECH + PRODUCTION shells
```

## Checks

```bash
pnpm lint        # ESLint (next/core-web-vitals + typescript)
pnpm typecheck   # tsc in every workspace
pnpm test        # node:test — lead validation & staging delivery
pnpm build       # production build of all apps
pnpm qa:visual   # Playwright screenshots + overflow / a11y smoke (needs `pnpm start` running)
```

## Environment

| Variable | Default | Meaning |
|---|---|---|
| `SITE_ENV` | `staging` | `production` allows indexing **only** together with `SITE_URL` |
| `SITE_URL` | — | Public origin of the current app. Domains are not purchased: never hardcode one |
| `TECH_URL` / `PRODUCTION_URL` / `RETAIL_URL` / `SLOT_URL` | — | External URLs of the independent ecosystem sites. Unset: directions → contact form, products → early-access page |
| `UNIVO_URL` | — | Used by the TECH / PRODUCTION placeholder apps to link back to the master site |
| `LEAD_DELIVERY` | `staging` | `staging` validates and discards — UI says so. Any other value = live mode with no adapter → honest failure |

Staging is `noindex, nofollow` three ways: `X-Robots-Tag`, meta robots, `robots.txt`.

## Architecture & deploy

UNIVO is unified at the **brand** level, not at runtime. Every entity (UNIVO, TECH, PRODUCTION, RETAIL,
SLOT) is an independent website with its own domain, deployment, SEO and release cycle. The master site
only presents the ecosystem and links out with ordinary external links (`TECH_URL`, … — one config:
`getEcosystemUrl` in `@univo/config`). No microfrontends, no shared shell, no runtime coupling.

This repository is a monorepo of independent apps:

| App | Deploy as | Notes |
|---|---|---|
| `apps/univo` | its own project (Root Directory `apps/univo`) | the master site |
| `apps/tech` | optional, its own project | placeholder until the TECH site is built |
| `apps/production` | optional, its own project | placeholder until the PRODUCTION site is built |

`packages/*` are build-time libraries (tokens, logo, Onest, locales, ecosystem data, UI primitives,
lead validation) compiled into each app — nothing is loaded from another app at runtime.

Vercel: import the repo, set **Root Directory** to the app folder (e.g. `apps/univo`), framework Next.js;
Vercel installs the pnpm workspace from the repo root. Env vars per project: see `.env.example`.
