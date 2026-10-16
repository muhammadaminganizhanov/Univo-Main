import { Lines } from "@univo/ui";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./WorkDone.module.css";

/*
 * The page's strongest statement, alone on Ink. Work is done when it can be used: the line under it
 * runs to the point — the result — and the three examples say what "used" means.
 */
export function WorkDone({ ctx }: { ctx: LocaleContext }) {
  const r = ctx.t.about.result;
  return (
    <section className={styles.section} data-surface="ink" data-scene="about-done" aria-labelledby="about-result">
      <div className="container">
        <h2 id="about-result" className={styles.statement}>
          <Lines
            text={r.statement}
            after={
              <span className="brand-dot" aria-hidden="true">
                .
              </span>
            }
          />
        </h2>
        <div className={styles.rule} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.point} />
        </div>
        <ul role="list" className={styles.examples}>
          {r.examples.map((ex, i) => (
            <li key={ex} style={{ "--i": i } as CSSProperties}>
              {ex}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
