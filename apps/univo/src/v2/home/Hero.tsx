import { ArrowLink, ButtonLink, Lines } from "@univo/ui";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import { groupCallouts, groupLevels } from "../group";
import { Model } from "../Model";
import styles from "./Hero.module.css";

/** Signature 1 — the group as a building: one point, one axis, floors settle onto it. */
export function Hero({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  return (
    <section className={styles.hero} data-surface="paper" data-scene="source" aria-labelledby="page-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <h1 id="page-title" className={styles.title}>
            <Lines text={t.home.hero.title} />
          </h1>
          <p className={`t-lead ${styles.lead}`}>{t.home.hero.lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={localeHref(locale, ROUTES.contact)} icon="arrowRight">
              {t.common.cta.discuss}
            </ButtonLink>
            <ArrowLink href={localeHref(locale, ROUTES.ecosystem)}>{t.common.cta.ecosystem}</ArrowLink>
          </div>
        </div>
        <nav className={styles.model} aria-label={t.v2.model.label}>
          <Model id="model-home" levels={groupLevels()} callouts={groupCallouts(ctx)} label={t.v2.model.label} />
        </nav>
      </div>
    </section>
  );
}
