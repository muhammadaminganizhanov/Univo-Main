import type { Metadata } from "next";
import { Inside } from "@/components/home/Inside";
import { Source } from "@/components/home/Source";
import { Checks } from "@/components/home/Checks";
import { Routing } from "@/components/home/Routing";
import { Closing } from "@/components/home/Closing";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/", title: t.meta.home.title, description: t.meta.home.description, absoluteTitle: true });
}

/** Source (stroke) → inside (index) → checks (standards) → routing (one entry) → closing signature. */
export default async function HomePage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <JsonLd graph={pageGraph({ locale, t, path: ROUTES.home, title: t.meta.home.title, description: t.meta.home.description })} />
      <Source ctx={ctx} />
      <Inside ctx={ctx} />
      <Checks ctx={ctx} />
      <Routing ctx={ctx} />
      <Closing title={t.end.title} body={t.end.body} href={localeHref(locale, ROUTES.contact)} action={t.common.cta.discuss} />
    </>
  );
}
