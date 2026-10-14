import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./Notice.module.css";

type Tone = "success" | "warning" | "error" | "info";
const ICON = { success: "ok", warning: "warn", error: "error", info: "info" } as const;

export function Notice({
  tone,
  title,
  children,
  role,
  id,
  tabIndex,
}: {
  tone: Tone;
  title: string;
  children?: ReactNode;
  role?: "status" | "alert";
  id?: string;
  tabIndex?: number;
}) {
  return (
    <div className={`${styles.notice} ${styles[tone]}`} role={role} id={id} tabIndex={tabIndex}>
      <Icon name={ICON[tone]} size={22} />
      <div>
        <strong className={styles.title}>{title}</strong>
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
    </div>
  );
}
