import { FALLBACK_LOCALE, LOCALE_META, type Locale } from "@univo/config";
import { en } from "./en";
import { KY_FALLBACK_NOTICE, ky } from "./ky";
import { ru, type Dictionary } from "./ru";

export type { Dictionary };

function merge<T>(base: T, override: unknown): T {
  if (override === undefined) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return override as T;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    out[k] = merge((base as Record<string, unknown>)[k], v);
  }
  return out as T;
}

const DICTIONARIES: Record<Locale, Dictionary> = {
  ru,
  en,
  ky: merge(ru, ky),
};

export interface LocaleContext {
  locale: Locale;
  t: Dictionary;
  /** Language most of the page copy is actually in (differs from `locale` while KY falls back to RU). */
  contentLang: string;
  /** Notice shown while the locale is incomplete. */
  fallbackNotice: string | null;
}

export function getDictionary(locale: Locale): LocaleContext {
  const complete = LOCALE_META[locale].complete;
  return {
    locale,
    t: DICTIONARIES[locale],
    contentLang: complete ? LOCALE_META[locale].htmlLang : LOCALE_META[FALLBACK_LOCALE].htmlLang,
    fallbackNotice: locale === "ky" && !complete ? KY_FALLBACK_NOTICE : null,
  };
}

/** "{name} is launching" → "UNIVO SLOT is launching". */
export const format = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
