import { MARKET_LABEL, STATUS_LABEL, TYPE_LABEL, getEntity, getProducts, getServices, pick, type Entity } from "@univo/content";
import { ButtonLink } from "@univo/ui";
import type { CSSProperties, ReactNode } from "react";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import { groupLevels } from "../group";
import styles from "./Sheets.module.css";

/**
 * One drawing sheet per member. Every sheet has the same frame and title block (entity, type, status,
 * market, sheet number) and a key plan — where this part sits in the building. Only the drawing
 * inside differs: each part of the group is a different kind of work.
 */
export function Sheets({ ctx }: { ctx: LocaleContext }) {
  const e = ctx.t.v2.ecosystem;
  const members = [...getServices(), ...getProducts()];
  const drawings: Record<string, (ctx: LocaleContext) => ReactNode> = {
    tech: TechGrid,
    production: ProductionChain,
    retail: RetailFlow,
    slot: SlotDay,
  };
  return (
    <section className={styles.section} data-surface="paper" data-scene="sheets" aria-labelledby="eco-sheets">
      <div className="container">
        <div className={styles.head}>
          <h2 id="eco-sheets" className="t-h1">
            {e.sheets}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{e.sheetsLead}</p>
        </div>
        <div className={styles.set}>
          {members.map((m, i) => (
            <Sheet key={m.id} e={m} ctx={ctx} index={i + 1} total={members.length}>
              {drawings[m.id]?.(ctx)}
            </Sheet>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sheet({ e, ctx, index, total, children }: { e: Entity; ctx: LocaleContext; index: number; total: number; children: ReactNode }) {
  const { t, locale } = ctx;
  const f = t.common.entity.fields;
  const link = resolveEntityLink(e, locale, t);
  const segments = e.segments ? pick(e.segments, locale) : null;
  const num = (n: number) => String(n).padStart(2, "0");
  return (
    <article
      id={e.slug}
      className={styles.sheet}
      data-entity={e.id}
      aria-labelledby={`${e.slug}-title`}
      style={{ "--c": `var(${e.accent})` } as CSSProperties}
    >
      <div className={styles.body}>
        <div className={styles.about}>
          <h3 id={`${e.slug}-title`} className={styles.role}>
            <span className="visually-hidden">{e.name}. </span>
            {pick(e.role, locale)}
          </h3>
          <p className={styles.desc}>{pick(e.description, locale)}</p>
          {segments ? (
            <p className={styles.segments}>
              <span className={styles.label}>{f.segments}</span>
              {segments.join(", ")}
            </p>
          ) : null}
          <div className={styles.cta}>
            <ButtonLink href={link.href} variant="secondary" icon={link.external ? "arrowUpRight" : "arrowRight"}>
              {link.label}
            </ButtonLink>
            {!link.available ? <p className={styles.note}>{t.common.entity.siteSoon}</p> : null}
          </div>
        </div>
        <div className={styles.drawing}>{children}</div>
      </div>

      <TitleBlock e={e} ctx={ctx} sheet={num(index)} total={num(total)} />
    </article>
  );
}

/** Title block, as on any drawing sheet: key plan, name, type, status, market, sheet. */
export function TitleBlock({ e, ctx, sheet, total }: { e: Entity; ctx: LocaleContext; sheet: string; total?: string }) {
  const { t, locale } = ctx;
  const f = t.common.entity.fields;
  const markets = e.markets.map((m) => pick(MARKET_LABEL[m], locale));
  return (
    <dl className={styles.block} style={{ "--c": `var(${e.accent})` } as CSSProperties}>
      <div className={styles.keyCell}>
        <dt className={styles.label}>{t.v2.ecosystem.keyPlan}</dt>
        <dd>
          <KeyPlan active={e.id} />
        </dd>
      </div>
      <div className={styles.nameCell}>
        <dt className="visually-hidden">{e.name}</dt>
        <dd className={styles.word} translate="no">
          <span className={styles.dot} data-state={e.status === "live" ? "filled" : "ring"} aria-hidden="true" />
          <span className={styles.brand}>UNIVO</span> {e.word}
        </dd>
      </div>
      <div>
        <dt className={styles.label}>{f.type}</dt>
        <dd>{pick(TYPE_LABEL[e.type], locale)}</dd>
      </div>
      <div>
        <dt className={styles.label}>{f.status}</dt>
        <dd>{pick(STATUS_LABEL[e.status], locale)}</dd>
      </div>
      <div>
        <dt className={styles.label}>{f.market}</dt>
        <dd>{markets.length ? markets.join(", ") : t.v2.ecosystem.noMarket}</dd>
      </div>
      <div className={styles.numCell}>
        <dt className={styles.label}>{t.v2.ecosystem.sheet}</dt>
        <dd className={styles.num}>
          {sheet} {total ? <span>/ {total}</span> : null}
        </dd>
      </div>
    </dl>
  );
}

/** Where the part sits: the building in elevation, this part drawn solid. */
function KeyPlan({ active }: { active: string }) {
  const levels = groupLevels();
  const W = 132;
  const H = 12;
  const G = 7;
  return (
    <svg className={styles.key} viewBox={`-1 -1 ${W + 2} ${levels.length * (H + G) - G + 2}`} aria-hidden="true" focusable="false">
      {levels.map((lv, i) => {
        const parts = lv.ghost ? [null] : lv.members;
        const w = W / parts.length;
        return parts.map((m, k) => (
          <rect
            key={`${lv.id}-${k}`}
            x={k * w}
            y={i * (H + G)}
            width={w}
            height={H}
            className={lv.ghost ? styles.keyGhost : m?.id === active ? styles.keyOn : styles.keyOff}
          />
        ));
      })}
    </svg>
  );
}

/** A specification table, as on a drawing: number and item. */
function Spec({ title, items, ctx }: { title: string; items: string[]; ctx: LocaleContext }) {
  const e = ctx.t.v2.ecosystem;
  return (
    <table className={styles.spec}>
      <caption className={styles.label}>{title}</caption>
      <thead className="visually-hidden">
        <tr>
          <th scope="col">{e.specNo}</th>
          <th scope="col">{e.specItem}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((s, i) => (
          <tr key={s}>
            <td>{String(i + 1).padStart(2, "0")}</td>
            <td>{s}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** TECH — a structural grid: columns lettered, every capability a bay with a node on its grid line. */
function TechGrid(ctx: LocaleContext) {
  const items = pick(getEntity("tech").scope, ctx.locale);
  const cols = 4;
  const letters = "ABCDEFGH";
  return (
    <div className={styles.tech}>
      <p className={styles.label}>{ctx.t.v2.ecosystem.techGrid}</p>
      <div className={styles.axes} aria-hidden="true">
        {Array.from({ length: cols }, (_, i) => (
          <span key={i} className={styles.bubble} data-col={i}>
            {letters[i]}
          </span>
        ))}
      </div>
      <ol role="list" className={styles.bays}>
        {items.map((s, i) => (
          <li
            key={s}
            className={styles.bay}
            data-d={`${letters[i % cols]}${Math.floor(i / cols) + 1}`}
            data-m={`${letters[i % 2]}${Math.floor(i / 2) + 1}`}
          >
            <span className={styles.bayNode} aria-hidden="true" />
            <span className={styles.bayName}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** PRODUCTION — the process as a dimension chain: script | shoot | edit, the result at the end. */
function ProductionChain(ctx: LocaleContext) {
  const p = ctx.t.ecosystem.profiles;
  return (
    <div className={styles.production}>
      <p className={styles.label}>{p.process}</p>
      <ol role="list" className={styles.chain} data-route="production">
        {p.processSteps.map((s, i) => (
          <li key={s} className={styles.link}>
            <span className={styles.linkNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.linkName}>{s}</span>
          </li>
        ))}
      </ol>
      <Spec title={p.formats} items={p.formatItems} ctx={ctx} />
    </div>
  );
}

/** RETAIL — the movement of goods in plan: four stations on one route, the rest of the system as a specification. */
function RetailFlow(ctx: LocaleContext) {
  const p = ctx.t.ecosystem.products;
  const flow = p.retailFlowSteps;
  const rest = pick(getEntity("retail").scope, ctx.locale).filter((s) => !flow.includes(s));
  return (
    <div className={styles.retail}>
      <p className={styles.label}>{p.retailFlow}</p>
      <ol role="list" className={styles.stations} data-route="retail-flow">
        {flow.map((s) => (
          <li key={s} className={styles.station}>
            <span className={styles.room} aria-hidden="true" />
            <span className={styles.stationName}>{s}</span>
          </li>
        ))}
      </ol>
      <Spec title={p.retailLedger} items={rest} ctx={ctx} />
    </div>
  );
}

/** Abstract day: which slots are taken, which are free. An illustration of the idea, not data. */
const DAY = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1] as const;

/** SLOT — time as a scale: a day of slots, booked and free. */
function SlotDay(ctx: LocaleContext) {
  const p = ctx.t.ecosystem.products;
  return (
    <div className={styles.slot}>
      <p className={styles.label}>{ctx.t.v2.ecosystem.slotDay}</p>
      <div className={styles.scale} aria-hidden="true" data-route="slot-axis">
        {DAY.map((booked, i) => (
          <span key={i} className={styles.tick} data-booked={booked ? "" : undefined}>
            <span className={styles.hour}>{String(9 + i).padStart(2, "0")}</span>
          </span>
        ))}
      </div>
      <p className={styles.legend}>
        <span>
          <span className={styles.swBooked} aria-hidden="true" /> {p.slotBooked}
        </span>
        <span>
          <span className={styles.swFree} aria-hidden="true" /> {p.slotFree}
        </span>
      </p>
      <Spec title={p.slotModules} items={pick(getEntity("slot").scope, ctx.locale)} ctx={ctx} />
    </div>
  );
}
