import { MARKET_LABEL, STATUS_LABEL, TYPE_LABEL, getEntity, pick, type Entity } from "@univo/content";
import { ButtonLink } from "@univo/ui";
import { EntityLockup } from "@/components/shared/EntityLockup";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Profiles.module.css";

function Top({ e, ctx }: { e: Entity; ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const f = t.common.entity.fields;
  return (
    <div className={styles.top}>
      <div className={styles.lockupWrap}>
        <h2 id={`${e.slug}-title`} className="visually-hidden">
          {e.name}
        </h2>
        <EntityLockup entity={e} className={styles.lockup} decorative />
      </div>
      <dl className={styles.facts}>
        <div>
          <dt>{f.type}</dt>
          <dd>{pick(TYPE_LABEL[e.type], locale)}</dd>
        </div>
        <div>
          <dt>{f.status}</dt>
          <dd>{pick(STATUS_LABEL[e.status], locale)}</dd>
        </div>
        <div>
          <dt>{t.ecosystem.profiles.market}</dt>
          <dd>{e.markets.map((m) => pick(MARKET_LABEL[m], locale)).join(" · ")}</dd>
        </div>
      </dl>
    </div>
  );
}

function Cta({ e, ctx }: { e: Entity; ctx: LocaleContext }) {
  const link = resolveEntityLink(e, ctx.locale);
  return (
    <div className={styles.cta}>
      <ButtonLink href={link.href} native={link.external} variant="secondary" icon={link.external ? "arrowUpRight" : "arrowRight"}>
        {link.label}
      </ButtonLink>
      {!link.available ? <p className="t-meta">{ctx.t.common.entity.siteSoon}</p> : null}
    </div>
  );
}

/**
 * TECH — digital systems. Identity column on the left; on the right the capabilities as a system
 * grid: every cell is a module with a node on the grid line. Hover/focus activates the node in TECH green.
 */
export function TechProfile({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("tech");
  const { locale } = ctx;
  return (
    <article
      id={e.slug}
      className={`${styles.profile} ${styles.tech}`}
      data-surface="white"
      data-entity={e.id}
      aria-labelledby={`${e.slug}-title`}
    >
      <div className={`container ${styles.techGrid}`}>
        <div className={styles.techId}>
          <Top e={e} ctx={ctx} />
          <p className={`t-h1 ${styles.techRole}`}>{pick(e.role, locale)}</p>
          <p className={`t-lead ${styles.desc}`}>{pick(e.description, locale)}</p>
          <Cta e={e} ctx={ctx} />
        </div>
        <ol role="list" className={styles.system} aria-label={ctx.t.ecosystem.profiles.scope} data-route="tech-grid">
          {pick(e.scope, locale).map((item, i) => (
            <li key={item} className={styles.module} data-node={`tech-${i + 1}`}>
              <span className={styles.moduleNode} aria-hidden="true" />
              <span className={`t-meta ${styles.cellIndex}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.cellName}>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

/** PRODUCTION — media made by a process. Composition: script → shoot → edit, formats as statements. */
export function ProductionProfile({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("production");
  const { t, locale } = ctx;
  const p = t.ecosystem.profiles;
  return (
    <article
      id={e.slug}
      className={`${styles.profile} ${styles.production}`}
      data-surface="ink"
      data-entity={e.id}
      aria-labelledby={`${e.slug}-title`}
    >
      <div className="container">
        <Top e={e} ctx={ctx} />
        <div className={styles.body}>
          <p className={`t-statement ${styles.role}`}>{pick(e.role, locale)}</p>
          <p className={`t-lead ${styles.desc}`}>{pick(e.description, locale)}</p>
        </div>
        <ol role="list" className={styles.pipeline} aria-label={p.process} data-route="production">
          {p.processSteps.map((step) => (
            <li key={step} className={styles.stage}>
              <span className={styles.stageNode} aria-hidden="true" />
              <span className={styles.stageName}>{step}</span>
            </li>
          ))}
        </ol>
        <div className={styles.formats}>
          <p className="t-meta">{p.formats}</p>
          <ul role="list">
            {p.formatItems.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <Cta e={e} ctx={ctx} />
      </div>
    </article>
  );
}
