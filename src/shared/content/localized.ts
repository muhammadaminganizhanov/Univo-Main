import type { Locale } from "@univo/config";

/** A translated value: every public locale is required. */
export type Localized<T = string> = { ru: T; en: T; ky: T };

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
