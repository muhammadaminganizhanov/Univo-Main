import "server-only";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALE_META, indexableLocales, type Locale } from "@univo/config";
import { getSelfUrl, isIndexable } from "@univo/config/server";
import { localeHref } from "./routes";

export const siteOrigin = () => getSelfUrl("univo").url;

/**
 * Page metadata: title, description, canonical, hreflang (complete locales only), OG, robots.
 * Staging is always noindex/nofollow; production needs SITE_ENV=production + SITE_URL.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const indexable = isIndexable() && LOCALE_META[locale].complete;
  const languages: Record<string, string> = {};
  for (const l of indexableLocales()) languages[LOCALE_META[l].htmlLang] = localeHref(l, path);
  languages["x-default"] = localeHref(DEFAULT_LOCALE, path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: localeHref(locale, path), languages },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      type: "website",
      siteName: "UNIVO",
      title,
      description,
      url: localeHref(locale, path),
      locale: LOCALE_META[locale].ogLocale,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "UNIVO" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}
