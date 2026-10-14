import type { LocaleContext } from "@/i18n";
import { groupCallouts, groupLevels } from "../group";
import { Model } from "../Model";
import styles from "./Exploded.module.css";

/** Signature 3 — the same building, taken apart: floors separate along the axis, shared edges open. */
export function Exploded({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const e = t.v2.ecosystem;
  return (
    <section className={styles.hero} data-surface="paper" data-scene="exploded" aria-labelledby="page-title">
      <div className={`container ${styles.grid}`}>
        <h1 id="page-title" className={styles.title}>
          {t.ecosystem.intro.title}
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </h1>
        <p className={`t-lead ${styles.lead}`}>{e.lead}</p>
        <nav className={styles.model} aria-label={t.v2.model.label}>
          <Model id="model-exploded" variant="exploded" levels={groupLevels()} callouts={groupCallouts(ctx, true)} label={e.drawing} />
        </nav>
      </div>
    </section>
  );
}
