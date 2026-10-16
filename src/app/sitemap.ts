import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALE_META, indexableLocales } from "@univo/config";
import { isIndexable } from "@univo/config/server";
import { getPrelaunchProducts } from "@univo/content";
import { ROUTES, localeHref } from "@/lib/routes";
import { siteOrigin } from "@/lib/seo";

/** Only complete locales are listed. Empty on staging. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  const origin = siteOrigin();
  const paths = [...Object.values(ROUTES), ...getPrelaunchProducts().map((p) => `/ecosystem/${p.slug}`)];
  const locales = indexableLocales();
  // build time = content time: every page is generated from the repository
  const lastModified = new Date();
  const priority = (path: string) => (path === ROUTES.home ? 1 : path.startsWith("/ecosystem/") ? 0.6 : 0.8);
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${origin}${localeHref(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: priority(path),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [LOCALE_META[l].htmlLang, `${origin}${localeHref(l, path)}`])),
          "x-default": `${origin}${localeHref(DEFAULT_LOCALE, path)}`,
        },
      },
    })),
  );
}
