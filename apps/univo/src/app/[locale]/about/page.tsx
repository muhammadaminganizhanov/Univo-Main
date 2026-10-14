import type { Metadata } from "next";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Elevation } from "@/v2/about/Elevation";
import { Character, Qualification, Result, Standards } from "@/v2/about/Parts";
import { Ending } from "@/v2/Ending";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.about, title: t.meta.about.title, description: t.meta.about.description });
}

/** Elevation (identity) → the result → how a business gets in → standards as a specification → character → end. */
export default async function AboutPage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <Elevation ctx={ctx} />
      <Result ctx={ctx} />
      <Qualification ctx={ctx} />
      <Standards ctx={ctx} />
      <Character ctx={ctx} />
      <Ending title={t.end.title} body={t.end.body} href={localeHref(locale, ROUTES.contact)} action={t.common.cta.discuss} />
    </>
  );
}
