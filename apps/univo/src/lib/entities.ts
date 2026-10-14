import "server-only";
import type { Locale } from "@univo/config";
import { getEcosystemUrl } from "@univo/config/server";
import { pick, type Entity } from "@univo/content";
import { format, type Dictionary } from "@/i18n";
import { localeHref } from "./routes";

export interface ResolvedLink {
  href: string;
  label: string;
  /** An independent website on its own domain. */
  external: boolean;
  /** false → the entity has no live destination yet (controlled placeholder state). */
  available: boolean;
}

/**
 * Where an entity's CTA leads. Every entity is an independent website: if its URL is configured
 * (TECH_URL, PRODUCTION_URL, RETAIL_URL, SLOT_URL) we link out to it. Until then:
 * - products → the early-access page on this site (a page of the master site, not the product);
 * - directions → the group contact form with the direction preselected ("site in progress").
 */
export function resolveEntityLink(entity: Entity, locale: Locale, t: Dictionary): ResolvedLink {
  const external = getEcosystemUrl(entity.id);
  if (external) return { href: external, label: pick(entity.cta, locale), external: true, available: true };
  if (entity.link.kind === "early-access") {
    return { href: localeHref(locale, entity.link.path), label: pick(entity.cta, locale), external: false, available: true };
  }
  return {
    href: `${localeHref(locale, "/contact")}?direction=${entity.id}`,
    label: format(t.common.entity.discussWith, { name: entity.name }),
    external: false,
    available: false,
  };
}
