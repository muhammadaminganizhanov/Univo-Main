import type { LocaleContext } from "@/i18n";
import styles from "./Further.module.css";

/*
 * What comes next, said calmly. The master brand is not tied to an industry; a new business takes its
 * place on the same line. Four points for the parts there are today, then the line runs on, dashed,
 * to an open ring. No dates, no plans, no numbers.
 */
export function Further({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const m = t.ecosystem.map;
  return (
    <section className={styles.section} data-surface="paper" data-scene="about-further" aria-labelledby="about-further">
      <div className={`container ${styles.grid}`}>
        <h2 id="about-further" className={styles.statement}>
          {t.about.identity.notes[1]}
        </h2>
        <div className={styles.line} aria-hidden="true">
          <span className={styles.points}>
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className={styles.dash} />
          <span className={styles.ring} />
        </div>
        <p className={styles.caption}>
          <span className={styles.next}>{m.next}</span>
          <span>{m.openEnd}</span>
        </p>
      </div>
    </section>
  );
}
