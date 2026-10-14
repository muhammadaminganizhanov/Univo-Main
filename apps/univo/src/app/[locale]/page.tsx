import type { Metadata } from "next";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Ending } from "@/v2/Ending";
import { Entrance } from "@/v2/home/Entrance";
import { Hero } from "@/v2/home/Hero";
import { Plan } from "@/v2/home/Plan";
import { Section } from "@/v2/home/Section";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/", title: t.meta.home.title, description: t.meta.home.description, absoluteTitle: true });
}

/** V2 Home: axonometric (whole) → plan (levels) → section (what holds them) → entrance (one way in). */
export default async function HomePage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <Hero ctx={ctx} />
      <Plan ctx={ctx} />
      <Section ctx={ctx} />
      <Entrance ctx={ctx} />
      <Ending title={t.end.title} body={t.end.body} href={localeHref(locale, ROUTES.contact)} action={t.common.cta.discuss} />
    </>
  );
}
