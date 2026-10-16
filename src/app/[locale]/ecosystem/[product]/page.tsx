import { LOCALES, isLocale } from "@univo/config";
import { STATUS_LABEL, getEntityBySlug, getPrelaunchProducts, pick } from "@univo/content";
import { ArrowLink, StatusLabel } from "@univo/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { EntityLockup } from "@/components/shared/EntityLockup";
import { format, getDictionary } from "@/i18n";
import { showStagingNote } from "@/lib/delivery";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import styles from "./product.module.css";

type Params = { params: Promise<{ locale: string; product: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getPrelaunchProducts().map((p) => ({ locale, product: p.slug })));
}

async function resolve(params: Params["params"]) {
  const { locale, product } = await params;
  const entity = getEntityBySlug(product);
  if (!isLocale(locale) || !entity || entity.type !== "product" || entity.status !== "launching") notFound();
  return { ctx: getDictionary(locale), entity };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { ctx, entity } = await resolve(params);
  return pageMetadata(productMeta(ctx, entity));
}

function productMeta(ctx: ReturnType<typeof getDictionary>, entity: NonNullable<ReturnType<typeof getEntityBySlug>>) {
  return {
    locale: ctx.locale,
    path: `/ecosystem/${entity.slug}`,
    title: `${entity.name} — ${pick(entity.role, ctx.locale)}`,
    description: format(ctx.t.meta.earlyAccess.description, { name: entity.name }),
    // the name already carries "UNIVO": no "— UNIVO" suffix
    absoluteTitle: true,
  };
}

export default async function ProductPage({ params }: Params) {
  const { ctx, entity } = await resolve(params);
  const { t, locale } = ctx;
  const segments = entity.segments ? pick(entity.segments, locale) : null;

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd graph={pageGraph({ ...productMeta(ctx, entity), t, crumb: entity.name, trail: [{ name: t.common.nav.ecosystem, path: ROUTES.ecosystem }] })} />
      <div className={styles.back}>
        <ArrowLink href={`${localeHref(locale, ROUTES.ecosystem)}#${entity.slug}`} icon="arrowLeft">
          {t.earlyAccess.back}
        </ArrowLink>
      </div>

      <div className={styles.layout}>
        <section className={styles.info} aria-labelledby="page-title">
          <div className={styles.id}>
            <EntityLockup entity={entity} className={styles.lockup} />
            <StatusLabel status={entity.status}>{pick(STATUS_LABEL[entity.status], locale)}</StatusLabel>
          </div>
          <h1 id="page-title" className={`t-h1 ${styles.title}`}>
            {pick(entity.role, locale)}
            <span className="brand-dot" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="t-lead">{pick(entity.description, locale)}</p>

          <div className={styles.block}>
            <h2 className="t-label">{t.earlyAccess.scopeTitle}</h2>
            <ul role="list" className={styles.list}>
              {pick(entity.scope, locale).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {segments ? (
            <div className={styles.block}>
              <h2 className="t-label">{t.earlyAccess.segmentsTitle}</h2>
              <p className={styles.segments}>{segments.join(" · ")}</p>
            </div>
          ) : null}

          <p className="t-small">{t.earlyAccess.note}</p>
        </section>

        <div className={styles.formCol}>
          <EarlyAccessForm
            labels={t.forms}
            locale={locale}
            product={entity.id as "retail" | "slot"}
            title={t.forms.earlyAccessTitle}
            lead={format(t.forms.earlyAccessLead, { name: entity.name })}
            staging={showStagingNote()}
          />
        </div>
      </div>
    </div>
  );
}
