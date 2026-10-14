import type { Metadata } from "next";
import { EcoMap } from "@/components/ecosystem/EcoMap";
import { Products } from "@/components/ecosystem/Products";
import { ProductionProfile, TechProfile } from "@/components/ecosystem/Profiles";
import { Together } from "@/components/ecosystem/Together";
import { EndCta } from "@/components/shared/EndCta";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.ecosystem, title: t.meta.ecosystem.title, description: t.meta.ecosystem.description });
}

/** Map → directions (two different profiles) → products → how they work together → end. */
export default async function EcosystemPage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <EcoMap ctx={ctx} />
      <TechProfile ctx={ctx} />
      <ProductionProfile ctx={ctx} />
      <Products ctx={ctx} />
      <Together ctx={ctx} />
      <EndCta title={t.end.title} body={t.end.body} href={localeHref(locale, ROUTES.contact)} action={t.common.cta.discuss} />
    </>
  );
}
