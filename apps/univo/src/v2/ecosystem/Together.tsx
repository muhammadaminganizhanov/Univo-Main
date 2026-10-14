import { getEntity } from "@univo/content";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Together.module.css";

/**
 * How the parts work together, drawn as an elevation of one route: it enters at the masterbrand
 * level, goes down to the floor of directions (two crafts at once), returns as one owner, one project.
 */
export function Together({ ctx }: { ctx: LocaleContext }) {
  const g = ctx.t.ecosystem.together;
  const crafts = [getEntity("tech"), getEntity("production")];
  return (
    <section className={styles.section} data-surface="white" data-scene="together" aria-labelledby="eco-together">
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <h2 id="eco-together" className="t-h1">
            {g.title}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{ctx.t.v2.ecosystem.togetherLead}</p>
        </div>
        <ol role="list" className={styles.route} data-route="together">
          {g.steps.map((s, i) => (
            <li key={s.title} className={styles.step} data-level={i === 2 ? "down" : "up"} data-stage={i + 1}>
              <span className={styles.mark} aria-hidden="true">
                {i === 2 ? (
                  crafts.map((e) => <span key={e.id} className={styles.craft} style={{ "--c": `var(${e.accent})` } as CSSProperties} />)
                ) : (
                  <span className={styles.point} data-kind={i === 0 ? "in" : i === g.steps.length - 1 ? "result" : "pass"} />
                )}
              </span>
              <h3 className={styles.word}>{s.title}</h3>
              <p className={styles.text}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
