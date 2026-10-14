import { LOCALE_META, isLocale, type Locale } from "@univo/config";
import { getAppHref } from "@univo/config/server";
import { Lockup } from "@univo/brand";
import { getEntity, pick } from "@univo/content";
import { ArrowLink, ButtonLink } from "@univo/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COPY } from "../../copy";
import { ENTITY_ID } from "../../entity";
import styles from "./page.module.css";

type Props = { params: Promise<{ locale: string }> };

const entity = getEntity(ENTITY_ID);
const fill = (s: string) => s.replace("{name}", entity.name);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: `${entity.name} — ${pick(entity.role, locale)}`, description: pick(entity.shortDescription, locale) };
}

/** Phase 1 placeholder: correct identity, honest state, a way back to UNIVO. Nothing more. */
export default async function Placeholder({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  // Same domain on Vercel services ("" = site root); an explicit UNIVO_SITE_URL wins (local dev, other domain).
  const univo = getAppHref("univo");
  const contentLang = LOCALE_META[locale].complete ? undefined : "ru";

  return (
    <main className={`container ${styles.page}`} lang={contentLang} style={{ ["--heading-dot" as string]: `var(${entity.accent})` }}>
      <header className={styles.header}>
        <Lockup name={entity.word!} dot={`var(${entity.accent})`} className={styles.lockup} />
      </header>
      <div className={styles.body}>
        <p className="t-label">{pick(COPY.partOf, locale)}</p>
        <h1 className="t-h1">
          {fill(pick(COPY.title, locale))}
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </h1>
        <p className="t-lead">{pick(entity.description, locale)}</p>
        <p>{pick(COPY.body, locale)}</p>
        <div className={styles.actions}>
          <ButtonLink href={`${univo}/${locale}/contact?direction=${entity.id}`} icon="arrowRight" native>
            {pick(COPY.discuss, locale)}
          </ButtonLink>
          <ArrowLink href={`${univo}/${locale}`} icon="arrowLeft" native>
            {pick(COPY.back, locale)}
          </ArrowLink>
        </div>
      </div>
    </main>
  );
}
