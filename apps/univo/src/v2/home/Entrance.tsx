import { getEntity } from "@univo/content";
import { Dot } from "@univo/ui";
import type { LocaleContext } from "@/i18n";
import styles from "./Entrance.module.css";

/**
 * One entrance. The brand's arch (the n) is the doorway; inside it the task's route runs from the
 * entry ring down to the Tangerine result on the ground line.
 */
export function Entrance({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const e = t.v2.entrance;
  const tech = getEntity("tech");
  const production = getEntity("production");
  return (
    <section className={styles.section} data-surface="paper" data-scene="entrance" aria-labelledby="v2-entrance">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <h2 id="v2-entrance" className="t-h1">
            {e.title}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{e.lead}</p>
        </div>
        <div className={styles.arch}>
          <ol role="list" className={styles.route} data-route="entrance">
            {t.home.how.steps.map((s, i) => (
              <li key={s.title} className={styles.step} data-stage={i + 1}>
                <span className={styles.node} aria-hidden="true" />
                <h3 className={styles.stepTitle}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h3>
                <p className={styles.stepText}>{s.text}</p>
                {i === 1 ? (
                  <p className={styles.chips}>
                    <span data-entity="tech">
                      <Dot color={`var(${tech.accent})`} size={10} /> {tech.name}
                    </span>
                    <span aria-hidden="true">+</span>
                    <span data-entity="production">
                      <Dot color={`var(${production.accent})`} size={10} /> {production.name}
                    </span>
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <span className={styles.ground} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
