import { getMembers, pick } from "@univo/content";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Spheres.module.css";

/*
 * Different businesses, one standard. The parts of the group are here only as proof: four different
 * kinds of work, each with a short plumb line down to one Tangerine line — the principle. Under it, what
 * they share. No company cards, no network: the principle is the subject, not the parts.
 */
export function Spheres({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const w = t.about.why;
  const notes = t.about.identity.notes;
  return (
    <section className={styles.section} data-surface="white" data-scene="about-spheres" aria-labelledby="about-why">
      <div className="container">
        <h2 id="about-why" className={styles.title} data-reveal>
          {w.title}
        </h2>

        <div className={styles.comb}>
          <p className={styles.label}>{w.differs}</p>
          <ul role="list" className={styles.spheres}>
            {getMembers().map((e, i) => (
              <li key={e.id} className={styles.sphere} style={{ "--c": `var(${e.accent})`, "--i": i } as CSSProperties}>
                <span className={styles.name} translate="no">
                  <span className={styles.dot} aria-hidden="true" />
                  {e.name}
                </span>
                <span className={styles.role}>{pick(e.role, locale)}</span>
                <span className={styles.plumb} aria-hidden="true" />
              </li>
            ))}
          </ul>
          <span className={styles.principle} aria-hidden="true" />
          <p className={styles.label}>{w.shared}</p>
          <p className={styles.shared}>{w.sharedText}</p>
          <p className={styles.note}>{w.note}</p>
        </div>

        <ul role="list" className={styles.notes}>
          <li>{notes[0]}</li>
          <li>{notes[2]}</li>
        </ul>
      </div>
    </section>
  );
}
