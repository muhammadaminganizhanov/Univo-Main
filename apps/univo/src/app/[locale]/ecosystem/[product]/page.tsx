import { LOCALES, isLocale } from "@univo/config";
import { STATUS_LABEL, getEntityBySlug, getPrelaunchProducts, getProducts, getServices, pick } from "@univo/content";
import { ArrowLink, StatusLabel } from "@univo/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { EntityLockup } from "@/components/shared/EntityLockup";
import { format, getDictionary } from "@/i18n";
import { showStagingNote } from "@/lib/delivery";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { TitleBlock } from "@/v2/ecosystem/Sheets";
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
  return pageMetadata({
    locale: ctx.locale,
    path: `/ecosystem/${entity.slug}`,
    title: `${entity.name} — ${pick(entity.role, ctx.locale)}`,
    description: format(ctx.t.meta.earlyAccess.description, { name: entity.name }),
  });
}

export default async function ProductPage({ params }: Params) {
  const { ctx, entity } = await resolve(params);
  const { t, locale } = ctx;
  const segments = entity.segments ? pick(entity.segments, locale) : null;
  // the same sheet number as on the Ecosystem drawing set
  const set = [...getServices(), ...getProducts()];
  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.back}>
        <ArrowLink href={`${localeHref(locale, ROUTES.ecosystem)}#${entity.slug}`} icon="arrowLeft">
          {t.earlyAccess.back}
        </ArrowLink>
      </div>

      <article className={styles.sheet} aria-labelledby="page-title">
        <div className={styles.layout}>
          <section className={styles.info}>
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
        <TitleBlock e={entity} ctx={ctx} sheet={num(set.findIndex((e) => e.id === entity.id) + 1)} total={num(set.length)} />
      </article>
    </div>
  );
}
