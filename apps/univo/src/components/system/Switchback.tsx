import type { ReactNode } from "react";
import styles from "./Switchback.module.css";

export interface SwitchbackStage {
  id: string;
  title: string;
  text: string;
  extra?: ReactNode;
}

/** Entry ring → stages → Tangerine result dot. Order is the meaning: an ordered list. */
export function Switchback({ stages, className }: { stages: SwitchbackStage[]; className?: string }) {
  return (
    <ol role="list" className={[styles.route, className].filter(Boolean).join(" ")} data-route="switchback">
      {stages.map((s, i) => (
        <li key={s.id} className={styles.stage} data-segment={i + 1} data-stage={s.id}>
          <span className={styles.node} aria-hidden="true" data-node={s.id} />
          <span className={`t-meta ${styles.num}`}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className={styles.title}>{s.title}</h3>
          <p className={styles.text}>{s.text}</p>
          {s.extra ? <div className={styles.extra}>{s.extra}</div> : null}
        </li>
      ))}
    </ol>
  );
}
