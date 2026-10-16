import { ButtonLink } from "@univo/ui";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./AboutEnd.module.css";

/* After a page of principle, one plain way forward: describe the task. No signature, no extra block. */
export function AboutEnd({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  return (
    <section className={styles.end} data-surface="ink" data-scene="about-end" aria-labelledby="end-title">
      <div className={`container ${styles.grid}`}>
        <h2 id="end-title" className={styles.title} data-reveal>
          {t.end.title}
        </h2>
        <div className={styles.side}>
          <p className={styles.body}>{t.end.body}</p>
          <ButtonLink href={localeHref(locale, ROUTES.contact)} icon="arrowRight">
            {t.common.cta.discuss}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
