import { MARKET_LABEL, getEntity, pick, type Entity } from "@univo/content";
import { ArrowLink } from "@univo/ui";
import type { CSSProperties, ReactNode } from "react";
import { EntityLockup } from "@/components/shared/EntityLockup";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Directions.module.css";

/*
 * Directions work on a client's task, so each one is an open line: the task comes in (a thin line to
 * a ring), the direction does the work (full weight, its colour only for a short run after its node),
 * the result comes out. The two lines speak differently: TECH branches — what passes through it, in
 * three clusters off one line; PRODUCTION runs in sequence — script, shoot, edit.
 * The culmination: below, the two lines turn and meet at the UNIVO point — the u of the wordmark.
 * When a task needs both, the client still has one project, one conversation, one owner.
 */

/** TECH's scope, read as three clusters: interfaces · business systems · automation. */
const TECH_CLUSTERS = [3, 2, 3];

export function Directions({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const d = t.ecosystem.directions;
  const tech = getEntity("tech");
  const production = getEntity("production");
  const g = d.together;
  const scope = pick(tech.scope, locale);
  const clusters = TECH_CLUSTERS.map((n, i) => scope.slice(TECH_CLUSTERS.slice(0, i).reduce((a, b) => a + b, 0)).slice(0, n));

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
          <Lane e={tech} ctx={ctx} label={d.scope}>
            <Step kind="entity" k={1}>
              <span className={styles.stepName} translate="no">
                {tech.word}
              </span>
            </Step>
            {clusters.map((c, i) => (
              <Step key={i} kind="branch" k={i + 2}>
                <span className={styles.cluster}>
                  {c.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </span>
              </Step>
            ))}
            <Step kind="result" k={clusters.length + 2}>
              <span className={styles.stepName}>{d.result}</span>
            </Step>
          </Lane>

          <Lane e={production} ctx={ctx} label={d.process}>
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
              <span className={styles.formats}>
                <span className="visually-hidden">{d.formats}: </span>
                {d.formatItems.join(", ")}
              </span>
            </Step>
          </Lane>

          {/* the culmination: both lines meet at the UNIVO point */}
          <div className={styles.together} data-scene="eco-together">
            <span className={styles.join} aria-hidden="true" />
            <span className={styles.mini} aria-hidden="true">
              <span style={{ "--c": `var(${tech.accent})` } as CSSProperties} />
              <span style={{ "--c": `var(${production.accent})` } as CSSProperties} />
            </span>
            <div className={styles.togetherText}>
              <h3 className={styles.togetherTitle}>{g.title}</h3>
              <p className={styles.outcome}>
                {g.outcome.map((o) => (
                  <span key={o}>{o}</span>
                ))}
              </p>
              <p className={styles.togetherBody}>{g.text}</p>
              <p className={styles.example}>
                «{g.example}»
                <span className={styles.exampleParts} translate="no">
                  <span style={{ "--c": `var(${tech.accent})` } as CSSProperties}>TECH</span>
                  <span style={{ "--c": `var(${production.accent})` } as CSSProperties}>PRODUCTION</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lane({ e, ctx, label, children }: { e: Entity; ctx: LocaleContext; label: string; children: ReactNode }) {
  const { t, locale } = ctx;
  const d = t.ecosystem.directions;
  const link = resolveEntityLink(e, locale, t);
  return (
    <article id={e.slug} className={styles.lane} data-lane={e.id} data-scene="eco-lane" style={{ "--c": `var(${e.accent})` } as CSSProperties} aria-labelledby={`${e.slug}-title`}>
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
      <ol role="list" className={styles.work} aria-label={label}>
        <Step kind="task" k={0}>
          <span className={styles.taskName}>{d.task}</span>
        </Step>
        {children}
      </ol>
    </article>
  );
}

function Step({ kind, k, children }: { kind: "task" | "entity" | "stage" | "branch" | "result"; k: number; children: ReactNode }) {
  return (
    <li className={styles.step} data-kind={kind} style={{ "--k": k } as CSSProperties}>
      <span className={styles.node} aria-hidden="true" />
      {children}
    </li>
  );
}
