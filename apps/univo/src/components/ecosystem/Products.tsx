import { STATUS_LABEL, getEntity, pick, type Entity } from "@univo/content";
import { ArrowLink, StatusLabel } from "@univo/ui";
import type { CSSProperties, ReactNode } from "react";
import { EntityLockup } from "@/components/shared/EntityLockup";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Products.module.css";

/*
 * Products are systems a business uses every day. Same grammar as the rest of the page — line, node,
 * colour only at the product's own entry point — but each product draws its own logic:
 * RETAIL is circulation: goods move along one heavy line (warehouse → stock → branches → sales) and
 * a light arc carries the business back round to the start; business control sits inside the cycle.
 * SLOT is time: one schedule, several lanes of the day; each lane a cadence of windows, taken or
 * free (an illustration of the idea, not data).
 * On entrance each figure plays its logic once — the flow runs and comes back; the windows fill in
 * time order — then rests.
 */

const pct = (x: number, y: number, w: number, h: number) => ({ "--x": `${(x / w) * 100}%`, "--y": `${(y / h) * 100}%` }) as CSSProperties;

export function Products({ ctx }: { ctx: LocaleContext }) {
  const p = ctx.t.ecosystem.products;
  return (
    <section id="products" className={styles.section} data-surface="paper" data-scene="eco-products" aria-labelledby="eco-products">
      <div className="container">
        <div className={styles.head}>
          <h2 id="eco-products" className={styles.title} data-reveal>
            {p.title}
          </h2>
          <p className={styles.lead}>{p.lead}</p>
        </div>
        <Retail ctx={ctx} />
        <Slot ctx={ctx} />
      </div>
    </section>
  );
}

function Product({ e, ctx, figure }: { e: Entity; ctx: LocaleContext; figure: ReactNode }) {
  const { t, locale } = ctx;
  const link = resolveEntityLink(e, locale, t);
  const segments = e.segments ? pick(e.segments, locale) : null;
  return (
    <article id={e.slug} className={styles.product} data-product={e.id} style={{ "--c": `var(${e.accent})` } as CSSProperties} aria-labelledby={`${e.slug}-title`}>
      <div className={styles.identity}>
        <div className={styles.id}>
          <EntityLockup entity={e} className={styles.lockup} decorative />
          <StatusLabel status={e.status}>{pick(STATUS_LABEL[e.status], locale)}</StatusLabel>
        </div>
        <h3 id={`${e.slug}-title`} className={styles.role}>
          <span className="visually-hidden">{e.name}. </span>
          {pick(e.role, locale)}
        </h3>
        <p className={styles.desc}>{pick(e.description, locale)}</p>
        {segments ? (
          <p className={styles.segments}>
            <span className={styles.label}>{t.ecosystem.products.segments}</span>
            <span>{segments.join(", ")}</span>
          </p>
        ) : null}
        <div className={styles.cta}>
          <ArrowLink href={link.href} icon={link.external ? "arrowUpRight" : "arrowRight"}>
            {link.label}
          </ArrowLink>
        </div>
      </div>
      <div className={styles.system}>{figure}</div>
    </article>
  );
}

/* ── RETAIL: circulation ── */
const RW = 580;
const RH = 214;
const FLOW_Y = 58;
const STOPS = [96, 244, 392, 540];
const FLOW = `M28 ${FLOW_Y} L${STOPS[3]!} ${FLOW_Y}`;
// the return: from the last stop, round under the flow, back to its start
const BACK = `M${STOPS[3]!} ${FLOW_Y} A${(STOPS[3]! - 28) / 2} 124 0 0 1 28 ${FLOW_Y}`;

function Retail({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("retail");
  const p = ctx.t.ecosystem.products;
  const flow = p.retailFlowSteps;
  const ledger = pick(e.scope, ctx.locale).filter((s) => !flow.includes(s));
  // a small technical arrow; --at: when the flow passes it (0…1 along the top line, 1.5 = halfway back)
  const chevron = (x: number, y: number, dir: 1 | -1, at: number) => (
    <path key={`${x}-${y}`} className={styles.chevron} d={`M${x - 5 * dir} ${y - 7} L${x + 4 * dir} ${y} L${x - 5 * dir} ${y + 7}`} style={{ "--at": at } as CSSProperties} />
  );
  return (
    <Product
      e={e}
      ctx={ctx}
      figure={
        <div className={styles.stage}>
          <div className={styles.figure} data-figure="retail">
            <svg className={styles.svg} viewBox={`0 0 ${RW} ${RH}`} aria-hidden="true" focusable="false">
              <path className={styles.back} d={BACK} pathLength={1} />
              <path className={styles.flow} d={FLOW} pathLength={1} />
              {STOPS.slice(0, -1).map((x, i) => chevron((x + STOPS[i + 1]!) / 2, FLOW_Y, 1, ((x + STOPS[i + 1]!) / 2 - 28) / (STOPS[3]! - 28)))}
              {chevron((STOPS[3]! + 28) / 2, FLOW_Y + 124, -1, 1.5)}
              {STOPS.map((x) => (
                <circle key={x} className={styles.stopNode} cx={x} cy={FLOW_Y} r={9} style={{ "--at": (x - 28) / (STOPS[3]! - 28) } as CSSProperties} />
              ))}
              {/* the cycle closes where it began */}
              <circle className={styles.closed} cx={28} cy={FLOW_Y} r={19} />
              <circle className={styles.entry} cx={28} cy={FLOW_Y} r={12} />
            </svg>
            <ol role="list" className={styles.stops} aria-label={p.retailFlow}>
              {flow.map((s, i) => (
                <li key={s} className={styles.stop} style={pct(STOPS[i]!, FLOW_Y, RW, RH)}>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.inside}>
            <p className={styles.insideTitle}>{p.retailLedger}</p>
            <ul role="list" className={styles.insideList}>
              {ledger.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  );
}

/* ── SLOT: time ── */
const SW = 640;
const SH = 196;
const STEM_X = 22;
const LANES = [40, 98, 156];
const SLOTS = 10;
const X0 = 56;
const SLOT_W = (SW - 8 - X0) / SLOTS;
/** Small irregular offsets (ms) so the day fills like a real schedule, not a checkerboard. */
const LAG = [
  [0, 30, 10, 45, 15, 0, 35, 20, 40, 10],
  [20, 0, 40, 15, 30, 5, 45, 10, 0, 35],
  [10, 40, 0, 25, 5, 45, 15, 35, 20, 0],
] as const;
/** Abstract day, one row per lane: which windows are taken, which are free. Illustration, not data. */
const DAY = [
  [1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
  [0, 1, 1, 0, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 0, 1, 0, 1, 1],
] as const;

function Slot({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("slot");
  const p = ctx.t.ecosystem.products;
  return (
    <Product
      e={e}
      ctx={ctx}
      figure={
        <div className={styles.stage}>
          <div className={styles.figure} data-figure="slot">
            <svg className={styles.svg} viewBox={`0 0 ${SW} ${SH}`} aria-hidden="true" focusable="false">
              {/* one schedule: the stem; each lane leaves it with a quarter turn */}
              <path className={styles.stem} d={`M${STEM_X} ${LANES[0]! + 16} L${STEM_X} ${LANES[2]! - 16}`} pathLength={1} />
              {LANES.map((y, l) => (
                <path
                  key={y}
                  className={styles.lane}
                  d={
                    y === LANES[1]
                      ? `M${STEM_X} ${y} L${SW - 8} ${y}`
                      : `M${STEM_X} ${y + (y < LANES[1]! ? 16 : -16)} A16 16 0 0 ${y < LANES[1]! ? 1 : 0} ${STEM_X + 16} ${y} L${SW - 8} ${y}`
                  }
                  pathLength={1}
                  style={{ "--l": l } as CSSProperties}
                />
              ))}
              {DAY.map((row, l) =>
                row.map((taken, i) => (
                  <rect
                    key={`${l}-${i}`}
                    className={taken ? styles.taken : styles.free}
                    x={X0 + i * SLOT_W + 4}
                    y={LANES[l]! - 8}
                    width={SLOT_W - 8}
                    height={16}
                    rx={8}
                    style={{ "--i": i, "--l": l, "--lag": `${LAG[l]![i]}ms` } as CSSProperties}
                  />
                )),
              )}
              <circle className={styles.entry} cx={STEM_X} cy={LANES[1]} r={12} />
            </svg>
          </div>
          <p className={styles.legend}>
            <span className={styles.legendLabel}>{p.slotAxis}</span>
            <span className={styles.legendItem}>
              <span className={styles.keyTaken} aria-hidden="true" /> {p.slotBooked}
            </span>
            <span className={styles.legendItem}>
              <span className={styles.keyFree} aria-hidden="true" /> {p.slotFree}
            </span>
          </p>
          <div className={styles.inside} data-plain="">
            <p className={styles.insideTitle}>{p.slotModules}</p>
            <ul role="list" className={styles.insideList}>
              {pick(e.scope, ctx.locale).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  );
}
