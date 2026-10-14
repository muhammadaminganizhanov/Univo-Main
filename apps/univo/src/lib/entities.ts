import "server-only";
import type { Locale } from "@univo/config";
import { getAppUrl } from "@univo/config/server";
import { pick, type Entity } from "@univo/content";
import { format, type Dictionary } from "@/i18n";
import { localeHref } from "./routes";

export interface ResolvedLink {
  href: string;
  label: string;
  external: boolean;
  /** false → the entity has no live destination yet (controlled placeholder state). */
  available: boolean;
}

/**
 * Where an entity's CTA leads. A direction's own site is linked only when its URL is configured
 * (TECH_SITE_URL / PRODUCTION_SITE_URL). Otherwise the CTA honestly routes to the group contact
 * form with the direction preselected — no promise of a site that does not exist yet.
 */
export function resolveEntityLink(entity: Entity, locale: Locale, t: Dictionary): ResolvedLink {
  if (entity.link.kind === "early-access") {
    return { href: localeHref(locale, entity.link.path), label: pick(entity.cta, locale), external: false, available: true };
  }
  const url = getAppUrl(entity.link.app);
  if (url) return { href: `${url}/${locale}`, label: pick(entity.cta, locale), external: true, available: true };
  return {
    href: `${localeHref(locale, "/contact")}?direction=${entity.id}`,
    label: format(t.common.entity.discussWith, { name: entity.name }),
    external: false,
    available: false,
  };
}
