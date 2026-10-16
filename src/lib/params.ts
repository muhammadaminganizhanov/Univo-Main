import { isLocale, type Locale } from "@univo/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Resolve the [locale] segment or 404. */
export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return getDictionary(locale as Locale);
}
