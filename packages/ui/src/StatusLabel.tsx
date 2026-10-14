import { Icon } from "./Icon";
import styles from "./StatusLabel.module.css";

type Status = "live" | "launching" | "development" | "private" | "archived";

/** Neutral capsule — status is a fact, not a brand accent. Icon shape differs per status. */
export function StatusLabel({ status, children }: { status: Status; children: string }) {
  return (
    <span className={`${styles.status} ${status === "live" ? styles.live : ""}`}>
      <Icon name={status === "live" ? "check" : "clock"} size={16} />
      {children}
    </span>
  );
}
