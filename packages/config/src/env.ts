/**
 * Site environment. Server-side only — never import into client components.
 *
 * SITE_ENV=staging (default) → noindex, nofollow, staging copy in forms.
 * Indexing is allowed ONLY when SITE_ENV=production AND the app has an explicit public URL.
 * Domains are not purchased yet: nothing here hardcodes a production domain.
 */
export type SiteEnv = "staging" | "production";

export type AppId = "univo" | "tech" | "production";

const URL_ENV: Record<AppId, string> = {
  univo: "UNIVO_SITE_URL",
  tech: "TECH_SITE_URL",
  production: "PRODUCTION_SITE_URL",
};

const LOCAL_PORT: Record<AppId, number> = { univo: 3100, tech: 3101, production: 3102 };

const clean = (value: string | undefined) => {
  const v = value?.trim();
  if (!v) return null;
  try {
    const url = new URL(v);
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
};

export function getSiteEnv(): SiteEnv {
  return process.env.SITE_ENV === "production" ? "production" : "staging";
}

/** Explicit public origin of an app, or null when not configured. */
export function getAppUrl(app: AppId): string | null {
  return clean(process.env[URL_ENV[app]]);
}

/** Origin of the current app: SITE_URL, else the app's own URL env, else localhost. */
export function getSelfUrl(app: AppId): { url: string; explicit: boolean } {
  const explicit = clean(process.env.SITE_URL) ?? getAppUrl(app);
  return explicit ? { url: explicit, explicit: true } : { url: `http://localhost:${LOCAL_PORT[app]}`, explicit: false };
}

/** Indexing needs BOTH an explicit production env and an explicit public SITE_URL. */
/**
 * Public path of every app when all apps are served from one domain (Vercel services:
 * see vercel.json rewrites). Must match each app's `basePath` in next.config.ts.
 */
export const APP_BASE_PATH: Record<AppId, string> = { univo: "", tech: "/tech", production: "/production" };

/**
 * Link target for another app. An explicit `*_SITE_URL` wins (separate domains, or local dev where
 * each app runs on its own port); otherwise the same-origin public path from APP_BASE_PATH.
 */
export function getAppHref(app: AppId): string {
  return getAppUrl(app) ?? APP_BASE_PATH[app];
}

export function isIndexable(): boolean {
  return getSiteEnv() === "production" && clean(process.env.SITE_URL) !== null;
}
