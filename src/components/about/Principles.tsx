import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Principles.module.css";

/*
 * The five standards as a philosophy of work — not a selector (Home) and not a pipeline (Ecosystem).
 * Each is a spread of its own: the number, the word, what it means (the rule), how it is checked.
 * Each row reveals as it is reached; nothing is held back from a reader without motion.
 */
export function Principles({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const s = t.about.standards;
  const owner = t.ecosystem.directions.together.outcome;
  return (
    <section className={styles.section} data-surface="white" aria-labelledby="about-standards">
      <div className="container">
        <div className={styles.head}>
          <h2 id="about-standards" className={styles.title} data-reveal>
            {s.title}
          </h2>
          <p className={styles.lead}>{s.lead}</p>
        </div>
        <ol role="list" className={styles.list}>
          {t.standards.map((st, i) => (
            <li key={st.title} className={styles.item} data-scene="about-principle" style={{ "--i": i } as CSSProperties}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.word}>{st.title}</h3>
              <div className={styles.body}>
                <p className={styles.rule}>{st.text}</p>
                <p className={styles.check}>
                  <span className={styles.checkLabel}>{t.standardsLabels.check}</span>
                  {st.check}
                </p>
                {i === 3 ? (
                  <p className={styles.aside}>
                    {owner.map((o) => (
                      <span key={o}>{o}</span>
                    ))}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
