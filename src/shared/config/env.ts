/**
 * Site environment. Server-side only — never import into client components.
 *
 * SITE_ENV wins when set. Unset: a Vercel production deployment counts as production, everything
 * else (previews, local) as staging → noindex, nofollow, staging copy in forms.
 * Indexing needs production AND a public URL: SITE_URL, else the domain Vercel assigns to production
 * (VERCEL_PROJECT_PRODUCTION_URL — the custom domain once one is added). Nothing hardcodes a domain.
 *
 * Plain module (no server-only): next.config.ts reads the same rules for the X-Robots-Tag header.
 */
export type SiteEnv = "staging" | "production";

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

const LOCAL_PORT = 3100;

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
  const explicit = process.env.SITE_ENV?.trim();
  if (explicit) return explicit === "production" ? "production" : "staging";
  return process.env.VERCEL_ENV === "production" ? "production" : "staging";
}

/** Public origin: SITE_URL, else Vercel's production domain (production deployments only). */
function publicUrl(): string | null {
  const explicit = clean(process.env.SITE_URL);
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return getSiteEnv() === "production" && vercel ? clean(`https://${vercel}`) : null;
}

/** External URL of an ecosystem entity, or null when it has no public site yet. */
export function getEcosystemUrl(id: EcosystemId): string | null {
  return clean(process.env[ECOSYSTEM_URL_ENV[id]]);
}

/** Origin of the site (metadata, canonical): the public URL, else the deployment URL, else localhost. */
export function getSelfUrl(): { url: string; explicit: boolean } {
  const url = publicUrl();
  if (url) return { url, explicit: true };
  const deployment = process.env.VERCEL_URL?.trim();
  return { url: deployment ? `https://${deployment}` : `http://localhost:${LOCAL_PORT}`, explicit: false };
}

/** Indexing needs BOTH a production env and a public URL. */
export function isIndexable(): boolean {
  return getSiteEnv() === "production" && publicUrl() !== null;
}
