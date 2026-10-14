import { getMembers, pick } from "@univo/content";
import { Dot } from "@univo/ui";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Section.module.css";

/**
 * Signature 2 — the section drawing. Levels are floors; the five standards are load-bearing columns
 * through all of them. Hover / focus a standard: its column carries the Tangerine through every floor.
 * Pure CSS (:has); the list is the content, the drawing is decorative.
 */
export function Section({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const s = t.v2.section;
  const members = getMembers();
  const cols = t.standards.length;

  return (
    <section className={styles.section} data-surface="white" data-scene="section" aria-labelledby="v2-section">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <h2 id="v2-section" className="t-h1">
            {s.title}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{s.lead}</p>
        </div>

        <figure className={styles.drawing} aria-label={s.drawing} style={{ "--cols": cols } as CSSProperties}>
          <div className={styles.columns} aria-hidden="true">
            {t.standards.map((_, i) => (
              <span key={i} className={styles.column} data-col={i + 1} style={{ "--i": i } as CSSProperties}>
                <span className={styles.colNum}>{String(i + 1).padStart(2, "0")}</span>
              </span>
            ))}
          </div>
          <ol role="list" className={styles.floors}>
            {members.map((e) => (
              <li key={e.id} className={styles.floor} data-entity={e.id}>
                <span className={styles.floorName}>
                  <Dot color={`var(${e.accent})`} state={e.status === "live" ? "filled" : "ring"} size={10} />
                  <span translate="no">{e.name}</span>
                </span>
                <span className={styles.floorRole}>{pick(e.role, locale)}</span>
                <span className={styles.slab} aria-hidden="true" />
              </li>
            ))}
            <li className={`${styles.floor} ${styles.next}`} aria-hidden="true">
              <span className={styles.floorName}>{t.v2.model.next}</span>
              <span className={styles.slab} />
            </li>
          </ol>
        </figure>

        <ol role="list" className={styles.standards}>
          {t.standards.map((st, i) => (
            <li key={st.title} className={styles.standard} data-col={i + 1}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.stTitle}>{st.title}</h3>
              <p className={styles.rule}>{st.text}</p>
              <p className={styles.check}>
                <span className="visually-hidden">{t.standardsLabels.check}: </span>
                {st.check}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
