import "server-only";
import { CONTACTS, LEGAL, LOCALE_META, type Locale } from "@univo/config";
import { getEcosystemUrl } from "@univo/config/server";
import { getEntity, getMembers, pick } from "@univo/content";
import type { Dictionary } from "@/i18n";
import { ROUTES, localeHref } from "./routes";
import { siteOrigin } from "./seo";

/*
 * schema.org JSON-LD. Only facts the site already states: no invented address, phone or rating.
 * Organization + WebSite once per page (layout); WebPage + BreadcrumbList per page.
 * Directions are sub-organizations, products are brands of the group; each gets its own URL once
 * it has a public site (TECH_URL, …).
 */

type Node = Record<string, unknown>;

const abs = (path: string) => `${siteOrigin()}${path}`;
const ids = () => ({ org: abs("/#organization"), site: abs("/#website") });

export function siteGraph(locale: Locale): Node[] {
  const { org, site } = ids();
  const univo = getEntity("univo");
  const own = CONTACTS.univo;
  const members = getMembers();
  const memberNode = (e: (typeof members)[number], type: "Organization" | "Brand") => {
    const url = getEcosystemUrl(e.id);
    return {
      "@type": type,
      name: e.name,
      description: pick(e.shortDescription, locale),
      ...(url ? { url } : {}),
    };
  };
  const contactPoint =
    own.email || own.phone
      ? [{ "@type": "ContactPoint", contactType: "customer service", ...(own.email ? { email: own.email } : {}), ...(own.phone ? { telephone: own.phone } : {}) }]
      : undefined;

  return [
    {
      "@type": "Organization",
      "@id": org,
      name: "UNIVO",
      ...(LEGAL.legalName ? { legalName: LEGAL.legalName } : {}),
      url: abs(localeHref(locale)),
      logo: { "@type": "ImageObject", url: abs("/icon-maskable-512.png"), width: 512, height: 512 },
      image: abs("/og-image.png"),
      description: pick(univo.shortDescription, locale),
      subOrganization: members.filter((e) => e.type === "service").map((e) => memberNode(e, "Organization")),
      brand: members.filter((e) => e.type === "product").map((e) => memberNode(e, "Brand")),
      ...(contactPoint ? { contactPoint } : {}),
    },
    {
      "@type": "WebSite",
      "@id": site,
      url: abs(localeHref(locale)),
      name: "UNIVO",
      inLanguage: LOCALE_META[locale].htmlLang,
      publisher: { "@id": org },
    },
  ];
}

export type PageType = "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";

/** WebPage + its breadcrumb trail (Home → … → this page). */
export function pageGraph({
  locale,
  t,
  path,
  title,
  description,
  type = "WebPage",
  crumb = title,
  trail = [],
}: {
  locale: Locale;
  t: Dictionary;
  path: string;
  title: string;
  description: string;
  type?: PageType;
  /** Short name of this page in the breadcrumb (defaults to the title). */
  crumb?: string;
  /** Crumbs between Home and this page. */
  trail?: { name: string; path: string }[];
}): Node[] {
  const { org, site } = ids();
  const url = abs(localeHref(locale, path));
  const crumbs = [{ name: t.common.nav.home, path: ROUTES.home }, ...trail, ...(path === ROUTES.home ? [] : [{ name: crumb, path }])];
  const page: Node = {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: LOCALE_META[locale].htmlLang,
    isPartOf: { "@id": site },
    about: { "@id": org },
    primaryImageOfPage: { "@type": "ImageObject", url: abs("/og-image.png") },
  };
  if (crumbs.length < 2) return [page];
  page.breadcrumb = { "@id": `${url}#breadcrumb` };
  return [
    page,
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(localeHref(locale, c.path)) })),
    },
  ];
}
