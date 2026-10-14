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
| `UNIVO_SITE_URL` / `TECH_SITE_URL` / `PRODUCTION_SITE_URL` | — | Cross-links between apps. Without them, direction CTAs fall back to the UNIVO contact form |
| `LEAD_DELIVERY` | `staging` | `staging` validates and discards — UI says so. Any other value = live mode with no adapter → honest failure |

Staging is `noindex, nofollow` three ways: `X-Robots-Tag`, meta robots, `robots.txt`.

## Deploy (Vercel, one project with services)

`vercel.json` defines three services in one project on one domain:

| Service | Root | Public path |
|---|---|---|
| `univo` | `apps/univo` | `/` (catch-all, last rewrite) |
| `tech` | `apps/tech` | `/tech`, `/tech/*` — Next `basePath: "/tech"` |
| `production` | `apps/production` | `/production`, `/production/*` — Next `basePath: "/production"` |

`packages/*` are workspace libraries compiled into each app — not services.
There are no bindings: the apps never call each other server-side; they only link to each other in the
browser, by same-origin path (`APP_BASE_PATH` in `@univo/config`). Leave `*_SITE_URL` empty on Vercel.

Project env vars (shared by all services): `SITE_ENV` (`staging` by default), `SITE_URL` (only with a real
domain, enables indexing together with `SITE_ENV=production`), `LEAD_DELIVERY` (`staging`).

Local check of the combined setup: `vercel dev` (Vercel CLI). Without it, run `pnpm dev:all` with the
`*_SITE_URL` values from `.env.example`.
