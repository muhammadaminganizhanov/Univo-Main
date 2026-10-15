import { Symbol } from "@univo/brand";
import { ButtonLink } from "@univo/ui";
import styles from "./Closing.module.css";

/**
 * The closing signature on Ink: the UNIVO symbol — u and n sharing one stroke, the point over the
 * shared stem — beside the one action of the page. The same stroke and point the hero opened with.
 */
export function Closing({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return (
    <section className={styles.end} data-surface="ink" data-scene="end-cta" aria-labelledby="end-title">
      <div className={`container ${styles.grid}`}>
        <Symbol title={null} className={styles.symbol} />
        <div className={styles.text}>
          <h2 id="end-title" className={styles.title}>
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
