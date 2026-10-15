import { ButtonLink } from "@univo/ui";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Ending.module.css";

/*
 * The page's ending on Ink. After the whole architecture, the one principle: you do not need to know
 * which part you need. One line from the task to the UNIVO point — the route inside the group is
 * UNIVO's to decide. Not the Home's closing signature; a quiet, decisive end.
 */
export function Ending({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const e = t.ecosystem.end;
  return (
    <section className={styles.end} data-surface="ink" data-scene="eco-end" aria-labelledby="end-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.entry} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.line} />
          <span className={styles.point} />
          <span className={styles.from}>{e.entry}</span>
          <span className={styles.to}>UNIVO</span>
        </div>
        <h2 id="end-title" className={styles.title} data-reveal>
          {t.end.title}
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </h2>
        <div className={styles.side}>
          <p className={styles.lead}>{e.lead}</p>
          <p className={styles.body}>{t.end.body}</p>
          <div className={styles.action}>
            <ButtonLink href={localeHref(locale, ROUTES.contact)} icon="arrowRight">
              {t.common.cta.discuss}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
