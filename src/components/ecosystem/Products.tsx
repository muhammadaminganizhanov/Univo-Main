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
 * RETAIL is one trading business in three tiers: where operations happen (goods move warehouse →
 * stock → branches → sales), the one system every operation is recorded in, and what the owner
 * controls from it. Read top-down: an operation happens → the system records it → the business is seen
 * whole.
 * SLOT is time: a timeline, the staff's lanes, services of different lengths booked and windows still
 * free; a client takes one free window and it becomes an appointment — availability updates.
 * An illustration of the idea, not data. On entrance each figure plays its logic once, then rests.
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
    <article id={e.slug} className={styles.product} data-product={e.id} data-scene="eco-product" style={{ "--c": `var(${e.accent})` } as CSSProperties} aria-labelledby={`${e.slug}-title`}>
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

/* ── RETAIL: operations → the system → control ── */
function Retail({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("retail");
  const p = ctx.t.ecosystem.products;
  const flow = p.retailFlowSteps;
  const ledger = pick(e.scope, ctx.locale).filter((s) => !flow.includes(s));
  return (
    <Product
      e={e}
      ctx={ctx}
      figure={
        <div className={styles.retail}>
          <p className={styles.tier} data-row="flow">
            {p.retailFlow}
          </p>
          <ol role="list" className={styles.ops} aria-label={p.retailFlow}>
            {flow.map((s, i) => (
              <li key={s} className={styles.op} style={{ "--k": i } as CSSProperties}>
                <span className={styles.opName}>{s}</span>
                <span className={styles.opNode} aria-hidden="true" />
              </li>
            ))}
          </ol>
          <span className={styles.bus} aria-hidden="true" />
          <p className={styles.tier} data-row="control">
            {p.retailLedger}
          </p>
          <ul role="list" className={styles.controls} aria-label={p.retailLedger}>
            {ledger.map((s, i) => (
              <li key={s} className={styles.control} style={{ "--k": i } as CSSProperties}>
                <span className={styles.controlNode} aria-hidden="true" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

/* ── SLOT: time, availability, a booking ── */
const SW = 640;
const SH = 240;
const X0 = 124; // the day starts here; left of it, the lanes' names
const X1 = 628;
const SLOTS = 10;
const SLOT_W = (X1 - X0) / SLOTS;
const AXIS_Y = 50;
const LANES = [108, 158, 208];
type Seg = readonly [start: number, length: number, kind: "taken" | "free" | "booking"];
/**
 * One abstract day per staff lane, in slots: services of different lengths already booked, windows
 * still free, and the one free window a client is booking now. Illustration, not data.
 */
const DAY: readonly (readonly Seg[])[] = [
  [[0, 2, "taken"], [2, 1, "free"], [3, 1, "taken"], [4, 2, "free"], [6, 3, "taken"], [9, 1, "free"]],
  [[0, 1, "taken"], [1, 2, "taken"], [3, 1, "free"], [4, 1, "taken"], [5, 2, "booking"], [7, 1, "taken"], [8, 2, "free"]],
  [[0, 1, "free"], [1, 3, "taken"], [4, 1, "free"], [5, 1, "taken"], [6, 1, "free"], [7, 2, "taken"], [9, 1, "free"]],
];
const BOOK = { lane: 1, start: 5, length: 2 };
const BOOK_X = X0 + (BOOK.start + BOOK.length / 2) * SLOT_W;
const CLIENT_Y = 16;

function Slot({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("slot");
  const p = ctx.t.ecosystem.products;
  const scope = pick(e.scope, ctx.locale);
  // scope order: schedule, staff, services, clients, appointments, free slots
  const [schedule, staff, , clients] = scope;
  return (
    <Product
      e={e}
      ctx={ctx}
      figure={
        <div className={styles.stage}>
          <div className={styles.figure} data-figure="slot">
            <svg className={styles.svg} viewBox={`0 0 ${SW} ${SH}`} aria-hidden="true" focusable="false">
              {/* time: the day as one axis with its cadence */}
              <path className={styles.axis} d={`M${X0} ${AXIS_Y} L${X1} ${AXIS_Y}`} pathLength={1} />
              {Array.from({ length: SLOTS + 1 }, (_, i) => (
                <path key={i} className={styles.tick} d={`M${X0 + i * SLOT_W} ${AXIS_Y - 4} L${X0 + i * SLOT_W} ${AXIS_Y + 4}`} style={{ "--i": i } as CSSProperties} />
              ))}
              {/* the staff: one lane each */}
              {LANES.map((y, l) => (
                <g key={y}>
                  <path className={styles.lane} d={`M${X0 - 22} ${y} L${X1} ${y}`} pathLength={1} style={{ "--l": l } as CSSProperties} />
                  <circle className={styles.laneNode} cx={X0 - 28} cy={y} r={6} style={{ "--l": l } as CSSProperties} />
                </g>
              ))}
              {DAY.map((row, l) =>
                row.map(([start, length, kind]) => (
                  <rect
                    key={`${l}-${start}`}
                    className={kind === "taken" ? styles.taken : kind === "free" ? styles.free : styles.window}
                    x={X0 + start * SLOT_W + 3}
                    y={LANES[l]! - 9}
                    width={length * SLOT_W - 6}
                    height={18}
                    rx={9}
                    style={{ "--t": start, "--l": l } as CSSProperties}
                  />
                )),
              )}
              {/* a client takes the free window: it becomes an appointment */}
              <path className={styles.bookPath} d={`M${BOOK_X} ${CLIENT_Y + 9} L${BOOK_X} ${LANES[BOOK.lane]! - 12}`} pathLength={1} />
              <rect
                className={styles.booking}
                x={X0 + BOOK.start * SLOT_W + 3}
                y={LANES[BOOK.lane]! - 9}
                width={BOOK.length * SLOT_W - 6}
                height={18}
                rx={9}
              />
              <circle className={styles.client} cx={BOOK_X} cy={CLIENT_Y} r={9} />
            </svg>
            <p className={styles.note} style={pct(X0 - 46, AXIS_Y, SW, SH)} data-note="schedule">
              {schedule}
            </p>
            <p className={styles.note} style={pct(X0 - 46, LANES[1]!, SW, SH)} data-note="staff">
              {staff}
            </p>
            <p className={styles.note} style={pct(BOOK_X + 18, CLIENT_Y, SW, SH)} data-note="client">
              {clients}
            </p>
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
          <div className={styles.inside}>
            <p className={styles.insideTitle}>{p.slotModules}</p>
            <ul role="list" className={styles.insideList}>
              {scope.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  );
}
