/**
 * Site environment. Server-side only — never import into client components.
 *
 * SITE_ENV=staging (default) → noindex, nofollow, staging copy in forms.
 * Indexing is allowed ONLY when SITE_ENV=production AND the app has an explicit public URL.
 * Domains are not purchased yet: nothing here hardcodes a production domain.
 */
export type SiteEnv = "staging" | "production";

/** Apps in this repository (each built and deployed on its own). */
export type AppId = "univo" | "tech" | "production";

/** Ecosystem entities — independent websites / products, each on its own domain. */
export type EcosystemId = "univo" | "tech" | "production" | "retail" | "slot";

/**
 * THE place where ecosystem URLs are configured. Every entity is an independent site with its own
 * domain, deployment and SEO; the master site only links out to it. Unset = not public yet.
 * Domains are not purchased: never hardcode them here.
 */
const ECOSYSTEM_URL_ENV: Record<EcosystemId, string> = {
  univo: "UNIVO_URL",
  tech: "TECH_URL",
  production: "PRODUCTION_URL",
  retail: "RETAIL_URL",
  slot: "SLOT_URL",
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

/** External URL of an ecosystem entity, or null when it has no public site yet. */
export function getEcosystemUrl(id: EcosystemId): string | null {
  return clean(process.env[ECOSYSTEM_URL_ENV[id]]);
}

/** Origin of the current app (metadata, canonical): SITE_URL, else localhost. */
export function getSelfUrl(app: AppId): { url: string; explicit: boolean } {
  const explicit = clean(process.env.SITE_URL);
  return explicit ? { url: explicit, explicit: true } : { url: `http://localhost:${LOCAL_PORT[app]}`, explicit: false };
}

/** Indexing needs BOTH an explicit production env and an explicit public SITE_URL. */
export function isIndexable(): boolean {
  return getSiteEnv() === "production" && clean(process.env.SITE_URL) !== null;
}
