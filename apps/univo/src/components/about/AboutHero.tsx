import { Symbol } from "@univo/brand";
import { Lines } from "@univo/ui";
import type { LocaleContext } from "@/i18n";
import styles from "./AboutHero.module.css";

/*
 * The principle, first. A master-brand statement on the left; on the right the UNIVO sign as the
 * source of the idea, not a picture: from its foot one Tangerine line runs on past the edge of the
 * page — the principle continues — and under it, what the name is.
 */
export function AboutHero({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const a = t.about;
  return (
    <section id="about-hero" className={styles.hero} data-surface="paper" data-scene="about-hero" aria-labelledby="page-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <p className={styles.kicker}>{t.common.nav.about}</p>
          <h1 id="page-title" className={styles.title}>
            <Lines text={a.hero.title} />
          </h1>
          <p className={styles.lead}>{a.hero.lead}</p>
        </div>
        <div className={styles.source}>
          <div className={styles.mark}>
            <Symbol title={null} className={styles.symbol} />
            <span className={styles.line} aria-hidden="true" />
          </div>
          <p className={styles.identity}>{a.identity.statement}</p>
        </div>
      </div>
    </section>
  );
}
