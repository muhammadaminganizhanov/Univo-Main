import { ButtonLink, Reveal } from "@univo/ui";
import styles from "./EndCta.module.css";

/** Closing scene of a page, on the same Ink surface as the footer (one continuous ending). */
export function EndCta({
  title,
  body,
  href,
  action,
  variant = "default",
}: {
  title: string;
  body: string;
  href: string;
  action: string;
  /** "home": monumental closing gesture — headline, line and action as one composition. */
  variant?: "default" | "home";
}) {
  return (
    <section
      className={`${styles.end} ${variant === "home" ? styles.home : ""}`}
      data-surface="ink"
      data-scene="end-cta"
      aria-labelledby="end-title"
    >
      <div className="container">
        <h2 id="end-title" className={`t-h1 ${styles.title}`}>
          <Reveal>{title}</Reveal>
        </h2>
        {variant === "home" ? <p className={`t-lead ${styles.bodyTop}`}>{body}</p> : null}
        <div className={styles.route} data-route="entry">
          <span className={styles.ring} aria-hidden="true" data-node="entry" />
          <span className={styles.line} aria-hidden="true" data-draw="" />
          <div className={styles.action}>
            <ButtonLink href={href} icon="arrowRight">
              {action}
            </ButtonLink>
          </div>
        </div>
        {variant === "home" ? null : <p className={`t-lead ${styles.body}`}>{body}</p>}
      </div>
    </section>
  );
}
