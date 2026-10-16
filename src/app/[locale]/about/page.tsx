import type { Metadata } from "next";
import { AboutEnd } from "@/components/about/AboutEnd";
import { AboutHero } from "@/components/about/AboutHero";
import { Becoming } from "@/components/about/Becoming";
import { Further } from "@/components/about/Further";
import { Principles } from "@/components/about/Principles";
import { Spheres } from "@/components/about/Spheres";
import { WorkDone } from "@/components/about/WorkDone";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.about, title: t.meta.about.title, description: t.meta.about.description });
}

/**
 * About = philosophy: why different businesses carry one name. The principle (hero) → different kinds
 * of work, one standard → how a business becomes part of UNIVO → the five standards as a way of working
 * → "work is done when it can be used" → what comes next → one simple action.
 */
export default async function AboutPage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  return (
    <>
      <AboutHero ctx={ctx} />
      <Spheres ctx={ctx} />
      <Becoming ctx={ctx} />
      <Principles ctx={ctx} />
      <WorkDone ctx={ctx} />
      <Further ctx={ctx} />
      <AboutEnd ctx={ctx} />
    </>
  );
}
