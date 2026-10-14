import "server-only";
import type { Locale } from "@univo/config";
import { getAppHref } from "@univo/config/server";
import { pick, type Entity } from "@univo/content";
import { localeHref } from "./routes";

export interface ResolvedLink {
  href: string;
  label: string;
  /** Another app (another Vercel service): must be a plain <a>, never client-side navigation. */
  external: boolean;
  /** false → the entity has no live destination yet (controlled placeholder state). */
  available: boolean;
}

/**
 * Where an entity's CTA leads. Directions → their own app (same domain under /tech, /production on
 * Vercel services, or an explicit *_SITE_URL). Products → the early-access page on the master site.
 */
export function resolveEntityLink(entity: Entity, locale: Locale): ResolvedLink {
  if (entity.link.kind === "early-access") {
    return { href: localeHref(locale, entity.link.path), label: pick(entity.cta, locale), external: false, available: true };
  }
  return { href: `${getAppHref(entity.link.app)}/${locale}`, label: pick(entity.cta, locale), external: true, available: true };
}
