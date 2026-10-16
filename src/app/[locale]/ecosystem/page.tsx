import type { Metadata } from "next";
import { Directions } from "@/components/ecosystem/Directions";
import { Ending } from "@/components/ecosystem/Ending";
import { MasterMap } from "@/components/ecosystem/MasterMap";
import { Products } from "@/components/ecosystem/Products";
import { Standard } from "@/components/ecosystem/Standard";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.ecosystem, title: t.meta.ecosystem.title, description: t.meta.ecosystem.description });
}

/** Master map → directions (open lines) → products (closed loops) → the common standard → ending. */
export default async function EcosystemPage({ params }: LocaleParams) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  return (
    <>
      <JsonLd
        graph={pageGraph({ locale, t, path: ROUTES.ecosystem, title: t.meta.ecosystem.title, description: t.meta.ecosystem.description, crumb: t.common.nav.ecosystem, type: "CollectionPage" })}
      />
      <MasterMap ctx={ctx} />
      <Directions ctx={ctx} />
      <Products ctx={ctx} />
      <Standard ctx={ctx} />
      <Ending ctx={ctx} />
    </>
  );
}
