import { MARKET_LABEL, getEntity, pick, type Entity } from "@univo/content";
import { ArrowLink } from "@univo/ui";
import type { CSSProperties, ReactNode } from "react";
import { EntityLockup } from "@/components/shared/EntityLockup";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Directions.module.css";

/*
 * Directions work on a client's task, so each one is an open line: the task comes in (a thin line to
 * a ring), the direction does the work (the line takes its weight, its colour only for a short run
 * after the node), the result comes out. TECH: task → TECH (what it makes) → result. PRODUCTION:
 * task → PRODUCTION → script → shoot → edit → result (formats). Below, the two lines turn and meet —
 * the u of the wordmark: when a task needs both, it is one project.
 */
export function Directions({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const d = t.ecosystem.directions;
  const tech = getEntity("tech");
  const production = getEntity("production");
  const g = d.together;

  return (
    <section id="directions" className={styles.section} data-surface="white" data-scene="eco-directions" aria-labelledby="eco-directions">
      <div className="container">
        <div className={styles.head}>
          <h2 id="eco-directions" className={styles.title} data-reveal>
            {d.title}
          </h2>
          <p className={styles.lead}>{d.lead}</p>
        </div>

        <div className={styles.pair}>
          <Lane e={tech} ctx={ctx}>
            <Step kind="entity" k={1}>
              <span className={styles.stepName} translate="no">
                {tech.word}
              </span>
              <span className={styles.outLabel}>{d.scope}</span>
              <span className={styles.outList}>
                {pick(tech.scope, locale).map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </span>
            </Step>
            <Step kind="result" k={2}>
              <span className={styles.stepName}>{d.result}</span>
            </Step>
          </Lane>

          <Lane e={production} ctx={ctx}>
            <Step kind="entity" k={1}>
              <span className={styles.stepName} translate="no">
                {production.word}
              </span>
            </Step>
            {d.processSteps.map((s, i) => (
              <Step key={s} kind="stage" k={i + 2}>
                <span className={styles.stageName}>{s}</span>
              </Step>
            ))}
            <Step kind="result" k={d.processSteps.length + 2}>
              <span className={styles.stepName}>{d.result}</span>
              <span className={styles.outLabel}>{d.formats}</span>
              <span className={styles.outList}>
                {d.formatItems.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </span>
            </Step>
          </Lane>

          {/* together: the two lines meet in one project */}
          <div className={styles.together}>
            <span className={styles.join} aria-hidden="true" />
            <span className={styles.mini} aria-hidden="true">
              <span style={{ "--c": `var(${tech.accent})` } as CSSProperties} />
              <span style={{ "--c": `var(${production.accent})` } as CSSProperties} />
            </span>
            <div className={styles.togetherText}>
              <h3 className={styles.togetherTitle}>{g.title}</h3>
              <p className={styles.togetherBody}>{g.text}</p>
              <p className={styles.example}>
                <span className={styles.exampleTask}>«{g.example}»</span>
                <span>
                  {g.project}. {g.projectText}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lane({ e, ctx, children }: { e: Entity; ctx: LocaleContext; children: ReactNode }) {
  const { t, locale } = ctx;
  const d = t.ecosystem.directions;
  const link = resolveEntityLink(e, locale, t);
  return (
    <article id={e.slug} className={styles.lane} data-lane={e.id} style={{ "--c": `var(${e.accent})` } as CSSProperties} aria-labelledby={`${e.slug}-title`}>
      <div className={styles.identity}>
        <EntityLockup entity={e} className={styles.lockup} decorative />
        <h3 id={`${e.slug}-title`} className={styles.role}>
          <span className="visually-hidden">{e.name}. </span>
          {pick(e.role, locale)}
        </h3>
        <p className={styles.desc}>{pick(e.description, locale)}</p>
        <p className={styles.market}>{e.markets.map((m) => pick(MARKET_LABEL[m], locale)).join(". ")}</p>
        <div className={styles.cta}>
          <ArrowLink href={link.href} icon={link.external ? "arrowUpRight" : "arrowRight"}>
            {link.label}
          </ArrowLink>
          {!link.available ? <p className={styles.soon}>{t.common.entity.siteSoon}</p> : null}
        </div>
      </div>
      <ol role="list" className={styles.work} aria-label={d.process}>
        <Step kind="task" k={0}>
          <span className={styles.taskName}>{d.task}</span>
        </Step>
        {children}
      </ol>
    </article>
  );
}

function Step({ kind, k, children }: { kind: "task" | "entity" | "stage" | "result"; k: number; children: ReactNode }) {
  return (
    <li className={styles.step} data-kind={kind} style={{ "--k": k } as CSSProperties}>
      <span className={styles.node} aria-hidden="true" />
      {children}
    </li>
  );
}
