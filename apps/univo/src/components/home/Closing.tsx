import { Symbol } from "@univo/brand";
import { ButtonLink } from "@univo/ui";
import styles from "./Closing.module.css";

/**
 * The closing signature on Ink. The structural line enters from the top of the section and becomes
 * the first stem of the UNIVO symbol — u and n sharing one stroke, the point over the shared stem.
 * The system that opened the page as a stem with a point resolves back into the mark. Beside it,
 * the one action of the page.
 */
export function Closing({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return (
    <section className={styles.end} data-surface="ink" data-scene="end-cta" aria-labelledby="end-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.mark}>
          <Symbol title={null} className={styles.symbol} />
        </div>
        <div className={styles.text}>
          <h2 id="end-title" className={styles.title} data-reveal>
            {title}
            <span className="brand-dot" aria-hidden="true">
              .
            </span>
          </h2>
          <p className={styles.body}>{body}</p>
          <ButtonLink href={href} icon="arrowRight">
            {action}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
