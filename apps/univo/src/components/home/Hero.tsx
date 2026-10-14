import { ArrowLink, ButtonLink, Lines } from "@univo/ui";
import { GroupStroke } from "@/components/system/GroupStroke";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Hero.module.css";

export function Hero({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const h = t.home.hero;
  return (
    <section className={styles.hero} data-surface="paper" data-scene="source" aria-labelledby="page-title">
      <div className={`container grid ${styles.grid}`}>
        {/* No punctuation dot here: the stroke's dots carry the accent (Brand Book p. 30). */}
        <h1 id="page-title" className={`t-display ${styles.headline}`}>
          <Lines text={h.title} />
        </h1>
        <div className={styles.side}>
          <p className={`t-lead ${styles.lead}`}>{h.lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={localeHref(locale, ROUTES.contact)} icon="arrowRight">
              {t.common.cta.discuss}
            </ButtonLink>
            <ArrowLink href={localeHref(locale, ROUTES.ecosystem)}>{t.common.cta.ecosystem}</ArrowLink>
          </div>
        </div>
        <nav className={styles.stroke} aria-label={h.structure}>
          <GroupStroke ctx={ctx} sourceMeta={h.sourceRole} id="group-stroke" />
        </nav>
      </div>
    </section>
  );
}
