import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { groupLevels } from "../group";
import styles from "./Elevation.module.css";

/**
 * About opens on the group in elevation (front view): the floors, the axis, the ground it stands on.
 * The identity notes are annotations of that drawing — each one is written next to what it describes.
 */
export function Elevation({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const a = t.about;
  const l = t.v2.about.levels;
  const notes: Record<string, { label: string; text?: string; lead?: boolean }> = {
    master: { label: l.master, text: a.identity.statement, lead: true },
    services: { label: l.services, text: a.identity.notes[0] },
    products: { label: l.products },
    next: { label: l.next, text: a.identity.notes[1] },
  };
  return (
    <section className={styles.section} data-surface="paper" data-scene="elevation" aria-labelledby="page-title">
      <div className="container">
        <div className={styles.head}>
          <h1 id="page-title" className={styles.title}>
            {a.hero.title}
            <span className="brand-dot" aria-hidden="true">
              .
            </span>
          </h1>
          <p className={`t-lead ${styles.lead}`}>{a.hero.lead}</p>
        </div>

        <ol role="list" className={styles.elevation} aria-label={t.v2.about.elevation}>
          {groupLevels().map((lv, i) => {
            const n = notes[lv.id]!;
            return (
              <li key={lv.id} className={styles.row} data-level={lv.id} style={{ "--i": i } as CSSProperties}>
                <span className={styles.floor} aria-hidden="true">
                  {lv.ghost ? (
                    <span className={`${styles.slab} ${styles.ghost}`} />
                  ) : (
                    lv.members.map((m) => (
                      <span key={m.id} className={styles.slab}>
                        {lv.id !== "master" ? (
                          <span className={styles.node} data-state={m.state} style={{ "--c": m.color } as CSSProperties} />
                        ) : null}
                      </span>
                    ))
                  )}
                </span>
                <span className={styles.note}>
                  <span className={styles.label}>{n.label}</span>
                  {n.text ? <span className={n.lead ? styles.statement : styles.text}>{n.text}</span> : null}
                </span>
              </li>
            );
          })}
          <li className={`${styles.row} ${styles.groundRow}`} data-level="ground">
            <span className={styles.ground} aria-hidden="true" />
            <span className={styles.note}>
              <span className={styles.label}>{l.ground}</span>
              <span className={styles.text}>{a.identity.notes[2]}</span>
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}
