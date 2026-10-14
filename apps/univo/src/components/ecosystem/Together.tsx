import { getEntity } from "@univo/content";
import { Dot } from "@univo/ui";
import { entityDot } from "@/components/system/GroupStroke";
import type { LocaleContext } from "@/i18n";
import styles from "./Together.module.css";

/** One entry → one route → several crafts → one owner → one project (the Tangerine result). */
export function Together({ ctx }: { ctx: LocaleContext }) {
  const g = ctx.t.ecosystem.together;
  const tech = getEntity("tech");
  const production = getEntity("production");
  const last = g.steps.length - 1;
  return (
    <section className={styles.section} data-surface="white" data-scene="together" aria-labelledby="eco-together">
      <div className="container">
        <h2 id="eco-together" className={`t-statement ${styles.title}`}>
          {g.title}
        </h2>
        <ol role="list" className={styles.ladder} data-route="together">
          {g.steps.map((s, i) => (
            <li key={s.title} className={styles.step} data-stage={i + 1}>
              <span className={styles.node} aria-hidden="true">
                {i === 2 ? (
                  <>
                    <Dot color={entityDot(tech)} size={22} />
                    <Dot color={entityDot(production)} size={22} />
                  </>
                ) : i === last ? (
                  <Dot color="var(--accent-univo)" size={22} />
                ) : i === 0 ? (
                  <Dot color="var(--color-fg)" state="ring" size={22} />
                ) : (
                  <Dot color="var(--color-fg)" size={22} />
                )}
              </span>
              <h3 className={styles.word}>{s.title}</h3>
              <p className={styles.text}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
