import type { Locale } from "@univo/config";
import { en } from "./en";
import { ky } from "./ky";
import { ru, type Dictionary } from "./ru";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { ru, en, ky };

export interface LocaleContext {
  locale: Locale;
  t: Dictionary;
}

export function getDictionary(locale: Locale): LocaleContext {
  return { locale, t: DICTIONARIES[locale] };
}

/** "{name} is launching" → "UNIVO SLOT is launching". */
export const format = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
