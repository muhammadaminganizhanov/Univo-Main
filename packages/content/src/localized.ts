import type { Locale } from "@univo/config";

/**
 * A translated value. `ky` is optional: until a professional Kyrgyz translation exists,
 * Kyrgyz falls back to Russian (and the page marks that content with lang="ru").
 */
export type Localized<T = string> = { ru: T; en: T; ky?: T };

/** Russian is the fallback locale (see FALLBACK_LOCALE in @univo/config). */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.ru;
}
