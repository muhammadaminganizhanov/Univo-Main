import { ArrowLink, ButtonLink } from "@univo/ui";
import { DEFAULT_LOCALE } from "@univo/config";
import { getDictionary } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./not-found.module.css";

/** Rendered inside the locale layout. The locale is not available here, so the default locale is used. */
export default function NotFound() {
  const { t, locale } = getDictionary(DEFAULT_LOCALE);
  return (
    <section className={`container ${styles.root}`} aria-labelledby="nf-title" lang={locale}>
      <p className="t-label">404</p>
      <h1 id="nf-title" className="t-h1">
        {t.notFound.title}
        <span className="brand-dot" aria-hidden="true">
          .
        </span>
      </h1>
      <p className="t-lead">{t.notFound.body}</p>
      <div className={styles.actions}>
        <ButtonLink href={localeHref(locale)}>{t.notFound.home}</ButtonLink>
        <ArrowLink href={localeHref(locale, ROUTES.ecosystem)}>{t.common.cta.ecosystem}</ArrowLink>
      </div>
    </section>
  );
}
