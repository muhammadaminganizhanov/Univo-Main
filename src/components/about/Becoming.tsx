import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Becoming.module.css";

/*
 * How a business becomes part of UNIVO. Not a funnel and not a flowchart: one line, read top-down.
 * It starts as a neutral, dashed ring — "a business"; it passes four conditions, and only past them does
 * it turn solid; at the end the ring has become the Tangerine point and the word has become
 * "part of UNIVO". A business that does not pass leaves the line, dashed, and keeps no UNIVO name.
 */
export function Becoming({ ctx }: { ctx: LocaleContext }) {
  const j = ctx.t.about.join;
  return (
    <section className={styles.section} data-surface="paper" data-scene="about-becoming" aria-labelledby="about-join">
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <h2 id="about-join" className={styles.title} data-reveal>
            {j.title}
          </h2>
          <p className={styles.lead}>{j.lead}</p>
        </div>

        <ol role="list" className={styles.path}>
          <li className={styles.start}>
            <span className={styles.ring} aria-hidden="true" />
            <span className={styles.startWord}>{j.start}</span>
          </li>
          {j.items.map((item, i) => (
            <li key={item.title} className={styles.condition} style={{ "--i": i } as CSSProperties}>
              <span className={styles.notch} aria-hidden="true" />
              <h3 className={styles.condTitle}>{item.title}</h3>
              <p className={styles.condText}>{item.text}</p>
            </li>
          ))}
          <li className={styles.end}>
            <span className={styles.point} aria-hidden="true" />
            <span className={styles.endWord}>{j.pass}</span>
          </li>
        </ol>

        <p className={styles.fail}>
          <span className={styles.failMark} aria-hidden="true" />
          <span>{j.fail}</span>
        </p>
      </div>
    </section>
  );
}
