import { MARKET_LABEL, STATUS_LABEL, TYPE_LABEL, getEntity, getProducts, getServices, pick, type Entity } from "@univo/content";
import { Icon, Lines } from "@univo/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./MasterMap.module.css";

/*
 * Signature — the master map. The group as architecture, read top-down: the UNIVO point and its axis;
 * from the axis two levels, by type — directions (heavier) and products (lighter); the parts stand on
 * their level; the axis runs on, dashed, to the next part. Weight carries rank before any label is read.
 * Focus/hover on a part: UNIVO answers, the part's path draws from the source in its colour, its node
 * grows, the others step back, and the answer panel says what the part is and where its link leads.
 * Desktop: one SVG with the names set beside it as an overlay. Below 1024: the same structure as a
 * vertical list with CSS lines — everything readable without hover.
 */

const W = 840;
const H = 452;
const AX = 16; // the axis
const UY = 20; // the UNIVO point
const RT = 30; // turns: quarter circles
const LEVEL = { services: 140, products: 272, next: 424 } as const;
const COLS = [340, 604];
const WEIGHT = { master: 12, services: 9, products: 6 } as const;

const pct = (x: number, y: number) => ({ "--x": `${(x / W) * 100}%`, "--y": `${(y / H) * 100}%` }) as CSSProperties;
/** From the axis, a quarter turn into a level, then along it. */
const branch = (y: number, to: number, from = y - RT) => `M${AX} ${from} L${AX} ${y - RT} A${RT} ${RT} 0 0 0 ${AX + RT} ${y} L${to} ${y}`;

export function MasterMap({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const m = t.ecosystem.map;
  const univo = getEntity("univo");
  const tiers = [
    { id: "services", title: m.services, note: m.servicesNote, list: getServices() },
    { id: "products", title: m.products, note: m.productsNote, list: getProducts() },
  ] as const;
  const members = tiers.flatMap((tier) => tier.list);
  const at = (e: Entity) => {
    const tier = tiers.find((x) => x.list.includes(e))!;
    return { x: COLS[tier.list.indexOf(e)] ?? COLS[0]!, y: LEVEL[tier.id], tier: tier.id };
  };

  // focus / hover on a part: UNIVO answers → its path draws from the source → node → panel → arrow
  const css =
    "@media (min-width:1024px){" +
    members
      .map((e) => {
        const on = `#ecomap:has([data-part="${e.id}"]:hover,[data-part="${e.id}"]:focus-visible)`;
        return (
          `${on} [data-path="${e.id}"]{stroke-dashoffset:0;transition-delay:80ms}` +
          `${on} [data-pnode="${e.id}"]{transform:scale(1.3);transition-delay:520ms}` +
          `${on} [data-pnode]:not([data-pnode="${e.id}"]),${on} [data-part]:not([data-part="${e.id}"]){opacity:.5}` +
          `${on} [data-answer]{opacity:1;transform:none}` +
          `${on} [data-read="univo"]{opacity:0;visibility:hidden;transform:translateY(-6px);transition-delay:0ms}` +
          `${on} [data-read="${e.id}"]{opacity:1;visibility:visible;transform:none;transition-delay:280ms}` +
          `${on} [data-part="${e.id}"] [data-go]{transform:translate(3px,-1px);transition-delay:600ms}`
        );
      })
      .join("") +
    "}";

  return (
    <section id="ecomap" className={styles.hero} data-surface="paper" data-scene="eco-map" aria-labelledby="page-title">
      <style>{css}</style>
      <div className={`container ${styles.head}`}>
        <h1 id="page-title" className={styles.title}>
          <span className={styles.kicker}>{t.ecosystem.intro.title}</span>
          <span className={styles.statement}>
            <Lines text={t.ecosystem.intro.statement} />
          </span>
        </h1>
      </div>

      <div className={`container ${styles.stage}`}>
        <div className={styles.aside}>
          <p className={styles.lead}>{t.ecosystem.intro.lead}</p>
          {/* the answer: what the active part is and where its link leads (the links themselves carry the text) */}
          <div className={styles.readout} aria-hidden="true">
            <div className={styles.read} data-read="univo">
              <p className={styles.readMeta}>{m.source}</p>
              <p className={styles.readName}>
                <span className={styles.readDot} style={{ "--c": `var(${univo.accent})` } as CSSProperties} />
                UNIVO
              </p>
              <p className={styles.readRole}>{pick(univo.shortDescription, locale)}</p>
              <p className={styles.readText}>{pick(univo.description, locale)}</p>
            </div>
            {members.map((e) => {
              const link = resolveEntityLink(e, locale, t);
              return (
                <div key={e.id} className={styles.read} data-read={e.id}>
                  <p className={styles.readMeta}>
                    <span>{pick(TYPE_LABEL[e.type], locale)}</span>
                    <span>{pick(STATUS_LABEL[e.status], locale)}</span>
                  </p>
                  <p className={styles.readName}>
                    <span className={styles.readDot} data-state={e.status === "live" ? "live" : "launching"} style={{ "--c": `var(${e.accent})` } as CSSProperties} />
                    {e.name}
                  </p>
                  <p className={styles.readRole}>{pick(e.role, locale)}</p>
                  <p className={styles.readText}>{pick(e.shortDescription, locale)}</p>
                  {e.markets.length ? <p className={styles.readMarket}>{e.markets.map((mk) => pick(MARKET_LABEL[mk], locale)).join(". ")}</p> : null}
                  <p className={styles.readGo}>
                    <Icon name={link.external ? "arrowUpRight" : "arrowRight"} size={18} />
                    {link.available ? link.label : t.common.entity.siteSoon}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <nav className={styles.map} aria-label={m.label}>
          <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {/* the next part: the axis runs on, dashed, and turns into a level of its own */}
            <path className={styles.next} d={branch(LEVEL.next, COLS[0]! - 13, LEVEL.products - RT)} />
            <circle className={styles.nextRing} cx={COLS[0]} cy={LEVEL.next} r={11} />
            {/* the axis and the two levels; weight by rank */}
            <path className={styles.line} data-l="axis" d={`M${AX} ${UY} L${AX} ${LEVEL.products - RT}`} style={{ strokeWidth: WEIGHT.master }} />
            {tiers.map((tier, i) => (
              <path
                key={tier.id}
                className={styles.line}
                data-l={tier.id}
                d={branch(LEVEL[tier.id], COLS[tier.list.length - 1] ?? COLS[0]!)}
                style={{ strokeWidth: WEIGHT[tier.id], "--i": i } as CSSProperties}
              />
            ))}
            {/* each part's path from the source, drawn in its colour on focus/hover */}
            {members.map((e) => {
              const p = at(e);
              return (
                <path
                  key={e.id}
                  className={styles.path}
                  data-path={e.id}
                  d={branch(p.y, p.x, UY)}
                  pathLength={1}
                  style={{ stroke: `var(${e.accent})`, strokeWidth: WEIGHT[p.tier] }}
                />
              );
            })}
            <circle className={styles.answer} data-answer="" cx={AX} cy={UY} r={23} />
            <circle className={styles.source} cx={AX} cy={UY} r={14} />
            {members.map((e, i) => {
              const p = at(e);
              return (
                <g key={e.id}>
                  {/* an opaque base: a node that steps back never shows another part's path through it */}
                  <circle className={styles.nodeBase} cx={p.x} cy={p.y} r={p.tier === "services" ? 16 : 15} />
                  <circle
                    className={styles.node}
                    data-pnode={e.id}
                    data-state={e.status === "live" ? "live" : "launching"}
                    cx={p.x}
                    cy={p.y}
                    r={p.tier === "services" ? 12 : 11}
                    style={{ "--c": `var(${e.accent})`, "--i": i } as CSSProperties}
                  />
                </g>
              );
            })}
          </svg>

          <p className={styles.sourceLabel} style={pct(AX + 30, UY)}>
            <span className={styles.sourcePoint} aria-hidden="true" />
            <span className={styles.sourceName} translate="no">
              UNIVO
            </span>
            <span className={styles.sourceRole}>{m.source}</span>
          </p>

          <ul role="list" className={styles.tiers}>
            {tiers.map((tier) => (
              <li key={tier.id} className={styles.tier} data-tier={tier.id}>
                <p className={styles.tierHead} style={pct(AX + RT + 22, LEVEL[tier.id] - 22)}>
                  <span className={styles.tierName}>{tier.title}</span>
                  <span className={styles.tierNote}>{tier.note}</span>
                </p>
                <ul role="list" className={styles.parts}>
                  {tier.list.map((e) => {
                    const p = at(e);
                    return <Part key={e.id} e={e} ctx={ctx} style={{ ...pct(p.x - 13, p.y - 18), "--c": `var(${e.accent})` } as CSSProperties} />;
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <p className={styles.nextLabel} style={pct(COLS[0]! + 26, LEVEL.next)}>
            <span className={styles.nextPoint} aria-hidden="true" />
            <span className={styles.nextName}>{m.next}</span>
            <span className={styles.nextNote}>{m.openEnd}</span>
          </p>
        </nav>

      </div>
    </section>
  );
}

function Part({ e, ctx, style }: { e: Entity; ctx: LocaleContext; style: CSSProperties }) {
  const { t, locale } = ctx;
  const link = resolveEntityLink(e, locale, t);
  // a direction without its own site yet → its section on this page
  const href = link.available || e.type === "product" ? link.href : `#${e.slug}`;
  const live = e.status === "live";
  return (
    <li className={styles.part} style={style}>
      <Link href={href} className={styles.link} data-part={e.id}>
        <span className={styles.node2} data-state={live ? "live" : "launching"} aria-hidden="true" />
        <span className={styles.name} translate="no">
          <span className="visually-hidden">UNIVO </span>
          {e.word}
          <Icon name={link.external ? "arrowUpRight" : "arrowRight"} size={18} className={styles.go} data-go="" />
        </span>
        <span className={styles.role}>{pick(e.role, locale)}</span>
        <span className={styles.status}>
          <Icon name={live ? "check" : "clock"} size={14} />
          {pick(STATUS_LABEL[e.status], locale)}
        </span>
      </Link>
    </li>
  );
}
