import { getEntity } from "@univo/content";
import { Dot } from "@univo/ui";
import { entityDot } from "@/components/system/GroupStroke";
import { Switchback } from "@/components/system/Switchback";
import type { LocaleContext } from "@/i18n";
import styles from "./Workflow.module.css";

const IDS = ["task", "route", "owner", "result"] as const;

export function Workflow({ ctx }: { ctx: LocaleContext }) {
  const h = ctx.t.home.how;
  const tech = getEntity("tech");
  const production = getEntity("production");
  const example = (
    <div className={styles.example}>
      <p className={styles.chips} data-node="route-example">
        <span className={styles.chip} data-entity="tech">
          <Dot color={entityDot(tech)} />
          {tech.name}
        </span>
        <span className={styles.plus} aria-hidden="true">
          +
        </span>
        <span className={styles.chip} data-entity="production">
          <Dot color={entityDot(production)} />
          {production.name}
        </span>
      </p>
      <p className={`t-meta ${styles.caption}`}>{h.example}</p>
    </div>
  );

  return (
    <section className={styles.section} data-surface="paper" data-scene="route" aria-labelledby="home-how">
      <div className="container">
        <div className={styles.head}>
          <h2 id="home-how" className={`t-statement ${styles.title}`}>
            {h.title}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{h.lead}</p>
        </div>
        <Switchback
          stages={h.steps.map((s, i) => ({ id: IDS[i] ?? String(i), ...s, extra: i === 1 ? example : undefined }))}
        />
      </div>
    </section>
  );
}
