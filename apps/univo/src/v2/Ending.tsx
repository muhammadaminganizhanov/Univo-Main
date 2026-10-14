import { ButtonLink } from "@univo/ui";
import styles from "./Ending.module.css";

/** Closing scene on Ink: the statement and the one action, standing on the ground line of the footer. */
export function Ending({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return (
    <section className={styles.ending} data-surface="ink" data-scene="end-cta" aria-labelledby="end-title">
      <div className={`container ${styles.grid}`}>
        <h2 id="end-title" className={styles.title}>
          {title}
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </h2>
        <div className={styles.side}>
          <p className={`t-lead ${styles.body}`}>{body}</p>
          <ButtonLink href={href} icon="arrowRight">
            {action}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
