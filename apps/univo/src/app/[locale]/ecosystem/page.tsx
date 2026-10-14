import type { Metadata } from "next";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Exploded } from "@/v2/ecosystem/Exploded";
import { Sheets } from "@/v2/ecosystem/Sheets";
import { Together } from "@/v2/ecosystem/Together";
import { Ending } from "@/v2/Ending";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.ecosystem, title: t.meta.ecosystem.title, description: t.meta.ecosystem.description });
}

/** Exploded model → one drawing sheet per part → the route through the parts → end. */
export default async function EcosystemPage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <Exploded ctx={ctx} />
      <Sheets ctx={ctx} />
      <Together ctx={ctx} />
      <Ending title={t.end.title} body={t.end.body} href={localeHref(locale, ROUTES.contact)} action={t.common.cta.discuss} />
    </>
  );
}
