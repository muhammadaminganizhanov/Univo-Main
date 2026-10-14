import { STATUS_LABEL, getEntity, pick, type Entity } from "@univo/content";
import { ButtonLink, StatusLabel } from "@univo/ui";
import type { ReactNode } from "react";
import { EntityLockup } from "@/components/shared/EntityLockup";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Products.module.css";

function Identity({ e, ctx }: { e: Entity; ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const link = resolveEntityLink(e, locale);
  const segments = e.segments ? pick(e.segments, locale) : null;
  return (
    <div className={styles.identity}>
      <div className={styles.id}>
        <EntityLockup entity={e} className={styles.lockup} />
        <StatusLabel status={e.status}>{pick(STATUS_LABEL[e.status], locale)}</StatusLabel>
      </div>
      <div>
        <p className="t-meta">{t.ecosystem.products.problem}</p>
        <h3 id={`${e.slug}-title`} className={`t-h2 ${styles.problem}`}>
          {pick(e.role, locale)}
        </h3>
      </div>
      <p className={styles.desc}>{pick(e.description, locale)}</p>
      {segments ? (
        <div>
          <p className="t-meta">{t.ecosystem.products.segments}</p>
          <p className={styles.segments}>{segments.join(", ")}</p>
        </div>
      ) : null}
      <div>
        <ButtonLink href={link.href} variant="secondary" icon="arrowRight">
          {link.label}
        </ButtonLink>
      </div>
    </div>
  );
}

function Block({ e, children }: { e: Entity; children: ReactNode }) {
  return (
    <article id={e.slug} className={styles.block} data-entity={e.id} aria-labelledby={`${e.slug}-title`}>
      {children}
    </article>
  );
}

/** RETAIL — operations: goods move warehouse → stock → branches → sales; the rest is a control ledger. */
function Retail({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("retail");
  const p = ctx.t.ecosystem.products;
  const flow = p.retailFlowSteps;
  const ledger = pick(e.scope, ctx.locale).filter((s) => !flow.includes(s));
  return (
    <Block e={e}>
      <Identity e={e} ctx={ctx} />
      <div className={styles.system}>
        <p className="t-meta">{p.retailFlow}</p>
        <ol role="list" className={styles.flow} data-route="retail-flow">
          {flow.map((s, i) => (
            <li key={s} data-node={`retail-${i + 1}`}>
              <span className={styles.flowNode} aria-hidden="true" />
              <span className={styles.flowName}>{s}</span>
            </li>
          ))}
        </ol>
        <p className={`t-meta ${styles.ledgerTitle}`}>{p.retailLedger}</p>
        <ol role="list" className={styles.ledger}>
          {ledger.map((s, i) => (
            <li key={s}>
              <span className="t-meta">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </Block>
  );
}

/** Abstract day: which slots are taken, which are free. Illustration of the idea, not data. */
const DAY = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1] as const;

/** SLOT — time: an axis of slots (booked / free), then the schedule's parts as a grid. */
function Slot({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("slot");
  const p = ctx.t.ecosystem.products;
  return (
    <Block e={e}>
      <Identity e={e} ctx={ctx} />
      <div className={styles.system}>
        <p className="t-meta">{p.slotAxis}</p>
        <div className={styles.axis} aria-hidden="true" data-route="slot-axis">
          {DAY.map((booked, i) => (
            <span key={i} className={booked ? styles.booked : styles.free} data-node={`slot-${i + 1}`} />
          ))}
        </div>
        <p className={`t-meta ${styles.legend}`}>
          <span>
            <span className={styles.booked} aria-hidden="true" /> {p.slotBooked}
          </span>
          <span>
            <span className={styles.free} aria-hidden="true" /> {p.slotFree}
          </span>
        </p>
        <p className={`t-meta ${styles.ledgerTitle}`}>{p.slotModules}</p>
        <ul role="list" className={styles.schedule}>
          {pick(e.scope, ctx.locale).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </Block>
  );
}

export function Products({ ctx }: { ctx: LocaleContext }) {
  const p = ctx.t.ecosystem.products;
  return (
    <section className={styles.section} data-surface="paper" data-scene="products" aria-labelledby="eco-products">
      <div className="container">
        <div className={styles.head}>
          <h2 id="eco-products" className={`t-statement ${styles.title}`}>
            {p.title}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{p.lead}</p>
        </div>
        <Retail ctx={ctx} />
        <Slot ctx={ctx} />
      </div>
    </section>
  );
}
