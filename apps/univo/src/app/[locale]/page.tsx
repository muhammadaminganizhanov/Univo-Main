import type { Metadata } from "next";
import { Inside } from "@/components/home/Inside";
import { Source } from "@/components/home/Source";
import { SystemWeave } from "@/components/home/SystemWeave";
import { Workflow } from "@/components/home/Workflow";
import { EndCta } from "@/components/shared/EndCta";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/", title: t.meta.home.title, description: t.meta.home.description, absoluteTitle: true });
}

/** Source → standard → members → route → end. One narrative, four surfaces. */
export default async function HomePage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <Source ctx={ctx} />
      <Inside ctx={ctx} />
      <SystemWeave ctx={ctx} />
      <Workflow ctx={ctx} />
      <EndCta
        variant="home"
        title={t.end.title}
        body={t.end.body}
        href={localeHref(locale, ROUTES.contact)}
        action={t.common.cta.discuss}
      />
    </>
  );
}
