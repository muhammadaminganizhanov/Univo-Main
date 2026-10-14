/**
 * Locale registry. Route prefixes: /ru, /en, /ky.
 * `complete: false` → the locale keeps the full structure, but untranslated copy falls back to
 * Russian. Such a locale is excluded from hreflang / sitemap until it is complete.
 */
export const LOCALES = ["ru", "en", "ky"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";
export const FALLBACK_LOCALE: Locale = "ru";

export interface LocaleMeta {
  code: Locale;
  /** BCP 47 tag for <html lang> and hreflang. */
  htmlLang: string;
  /** OpenGraph locale. */
  ogLocale: string;
  /** Self-name, shown in the switcher. */
  nativeName: string;
  shortName: string;
  /** Full professional translation available. */
  complete: boolean;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ru: { code: "ru", htmlLang: "ru", ogLocale: "ru_RU", nativeName: "Русский", shortName: "RU", complete: true },
  en: { code: "en", htmlLang: "en", ogLocale: "en_US", nativeName: "English", shortName: "EN", complete: true },
  // TODO(owner): professional Kyrgyz translation. Until then KY copy falls back to RU.
  ky: { code: "ky", htmlLang: "ky", ogLocale: "ky_KG", nativeName: "Кыргызча", shortName: "KY", complete: false },
};

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);

/** Locales that may be advertised to search engines (hreflang, sitemap). */
export const indexableLocales = (): Locale[] => LOCALES.filter((l) => LOCALE_META[l].complete);

/** Negotiate a locale from an Accept-Language header. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { base } of ranked) if (isLocale(base)) return base;
  return DEFAULT_LOCALE;
}
