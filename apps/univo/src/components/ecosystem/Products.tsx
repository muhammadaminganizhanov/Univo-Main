import { STATUS_LABEL, getEntity, pick, type Entity } from "@univo/content";
import { ArrowLink, StatusLabel } from "@univo/ui";
import type { CSSProperties, ReactNode } from "react";
import { EntityLockup } from "@/components/shared/EntityLockup";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Products.module.css";

/*
 * Products are systems a business uses every day, so each one is a closed loop — the u and n of the
 * wordmark joined into one cycle (turns only by semicircles). Its entry point is the product's
 * colour; everything on the loop is black. RETAIL: goods move round it (warehouse → stock → branches →
 * sales → warehouse); inside, business control. SLOT: the loop is a day cut into slots — taken or
 * free (an illustration of the idea, not data); inside, what the schedule is made of.
 * On entrance the loop draws once round from its entry point, then rests.
 */

// one loop for both products: a stadium, radius R, entry at the left apex, running clockwise
const VW = 640;
const VH = 300;
const R = 110;
const L = { x1: 150, x2: 490, top: 40, bottom: 260, mid: 150 };
const LOOP = `M${L.x1 - R} ${L.mid} A${R} ${R} 0 0 1 ${L.x1} ${L.top} L${L.x2} ${L.top} A${R} ${R} 0 0 1 ${L.x2} ${L.bottom} L${L.x1} ${L.bottom} A${R} ${R} 0 0 1 ${L.x1 - R} ${L.mid} Z`;
const ARC = (Math.PI * R) / 2;
const STRAIGHT = L.x2 - L.x1;
const TOTAL = 4 * ARC + 2 * STRAIGHT;
/** Distance along the loop (0…1) of a point on its top or bottom straight. */
const along = (x: number, side: "top" | "bottom") => (side === "top" ? ARC + (x - L.x1) : 3 * ARC + STRAIGHT + (L.x2 - x)) / TOTAL;
const pct = (x: number, y: number) => ({ "--x": `${(x / VW) * 100}%`, "--y": `${(y / VH) * 100}%` }) as CSSProperties;

/** Abstract day: which slots are taken, which are free. Illustration of the idea, not data. */
const DAY = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1] as const;
/** The taken slots as one dash pattern on the loop (pathLength 120: 10 per slot), clear of the entry point. */
const slotDashes = () => {
  const out: number[] = [];
  let gap = 2.4;
  DAY.forEach((taken, i) => {
    const start = i === 0 ? 2.4 : 0;
    if (taken) {
      out.push(gap, 10 - 1.6 - start);
      gap = 1.6;
    } else gap += 10 - start;
  });
  // dasharray starts with a dash: lead with an empty one
  return [0, ...out, gap].join(" ");
};

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
      {figure}
    </article>
  );
}

function Loop({ children, labels, inside, after }: { children?: ReactNode; labels?: ReactNode; inside: ReactNode; after?: ReactNode }) {
  return (
    <div className={styles.system}>
      <div className={styles.stage}>
        <div className={styles.figure}>
          <svg className={styles.svg} viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true" focusable="false">
            {children}
            <circle className={styles.entry} cx={L.x1 - R} cy={L.mid} r={13} />
          </svg>
          {labels}
        </div>
        <div className={styles.inside}>{inside}</div>
      </div>
      {after}
    </div>
  );
}

/** RETAIL — goods move round the loop; inside it, the business is kept under control. */
function Retail({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("retail");
  const p = ctx.t.ecosystem.products;
  const flow = p.retailFlowSteps;
  const ledger = pick(e.scope, ctx.locale).filter((s) => !flow.includes(s));
  const stops = [
    { x: 230, side: "top" },
    { x: 410, side: "top" },
    { x: 410, side: "bottom" },
    { x: 230, side: "bottom" },
  ] as const;
  const inside = (
    <>
      <p className={styles.insideTitle}>{p.retailLedger}</p>
      <ul role="list" className={styles.insideList}>
        {ledger.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </>
  );
  return (
    <Product
      e={e}
      ctx={ctx}
      figure={
        <Loop
          inside={inside}
          labels={
            <ol role="list" className={styles.stops} aria-label={p.retailFlow}>
              {flow.map((s, i) => {
                const stop = stops[i]!;
                return (
                  <li key={s} className={styles.stop} data-side={stop.side} style={pct(stop.x, stop.side === "top" ? L.top : L.bottom)}>
                    {s}
                  </li>
                );
              })}
            </ol>
          }
        >
          <path className={styles.track} d={LOOP} pathLength={1} />
          {stops.map((stop, i) => (
            <circle
              key={i}
              className={styles.stopNode}
              cx={stop.x}
              cy={stop.side === "top" ? L.top : L.bottom}
              r={8}
              style={{ "--at": along(stop.x, stop.side) } as CSSProperties}
            />
          ))}
        </Loop>
      }
    />
  );
}

/** SLOT — the loop is a day: slots taken and free. Inside it, what the schedule is made of. */
function Slot({ ctx }: { ctx: LocaleContext }) {
  const e = getEntity("slot");
  const p = ctx.t.ecosystem.products;
  const inside = (
    <>
      <p className={styles.insideTitle}>{p.slotModules}</p>
      <ul role="list" className={styles.insideList}>
        {pick(e.scope, ctx.locale).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </>
  );
  return (
    <Product
      e={e}
      ctx={ctx}
      figure={
        <Loop
          inside={inside}
          after={
            <p className={styles.legend}>
              <span className={styles.legendLabel}>{p.slotAxis}</span>
              <span className={styles.legendItem}>
                <span className={styles.keyTaken} aria-hidden="true" /> {p.slotBooked}
              </span>
              <span className={styles.legendItem}>
                <span className={styles.keyFree} aria-hidden="true" /> {p.slotFree}
              </span>
            </p>
          }
        >
          <defs>
            <mask id="eco-slot-reveal" maskUnits="userSpaceOnUse" x="-20" y="-20" width={VW + 40} height={VH + 40}>
              <path className={styles.reveal} d={LOOP} pathLength={1} />
            </mask>
          </defs>
          <path className={styles.day} d={LOOP} pathLength={1} />
          <path className={styles.taken} d={LOOP} pathLength={120} strokeDasharray={slotDashes()} mask="url(#eco-slot-reveal)" />
        </Loop>
      }
    />
  );
}
