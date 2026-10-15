import { STATUS_LABEL, getProducts, getServices, pick, type Entity } from "@univo/content";
import { ArrowLink, ButtonLink, Lines } from "@univo/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Source.module.css";

/*
 * Signature 1 — the source. The group is one continuous stroke in the wordmark's geometry (u and n,
 * turns only by semicircles). It starts at the source — the stem with the UNIVO point, the tallest —
 * and descends by rank: directions are high, heavy arches; products lower and lighter; the next part a
 * dashed arch. Height and weight carry the hierarchy before any label is read. Every part is a node on
 * the crest of its arch, its name set beside it as an annotation — the arch is never a box around text.
 * The stroke stays black in every state: focus/hover lights the node and sends a short trace of the
 * part's colour up its arch to the crest (colour as signal, not paint). Phones: the same stroke, turned 90°.
 */

// Geometry in "desktop" screen units (phones: the same stroke, turned 90°, with its own proportions).
// Baseline B; every valley touches it.
type Rank = "master" | "services" | "products" | "next";
type Part = Exclude<Rank, "master">;
interface Geo {
  B: number;
  RV: number;
  stem: number;
  weight: Record<Rank, number>;
  height: Record<Part, number>;
  radius: Record<Part, number>;
}
const DESKTOP: Geo = {
  B: 400,
  RV: 34,
  stem: 360,
  weight: { master: 14, services: 10, products: 7, next: 2.5 },
  height: { services: 260, products: 190, next: 120 },
  radius: { services: 104, products: 76, next: 56 },
};
const PHONE: Geo = {
  B: 250,
  RV: 18,
  stem: 226,
  weight: { master: 11, services: 8, products: 5.5, next: 2 },
  height: { services: 150, products: 112, next: 72 },
  radius: { services: 54, products: 40, next: 30 },
};

type Pt = [number, number];
type Seg = { id: string; rank: Rank; d: string; crest?: string; node?: Pt; label: Pt; color?: string; live?: boolean };

const nodeR = (g: Geo, rank: Rank) => (rank === "master" ? g.weight.master * 0.95 : g.weight[rank] * 1.15 + 1.5);
const X0 = 30;
const r1 = (v: number) => Math.round(v * 10) / 10;
const fmt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

/**
 * The stroke as one segment per part, joined at the valleys. `turn` maps a desktop point to the
 * phone orientation (90° clockwise + shift): orientation is preserved, so arc sweeps stay valid.
 */
function build(services: Entity[], products: Entity[], g: Geo, turn: boolean) {
  const { B, RV } = g;
  const m = (p: Pt): Pt => (turn ? [B + 8 - p[1], p[0]] : p);
  const segs: Seg[] = [];
  const x0 = X0;
  segs.push({
    id: "univo",
    rank: "master",
    d: `M${fmt(m([x0, B - g.stem]))} L${fmt(m([x0, B - RV]))} A${RV} ${RV} 0 0 0 ${fmt(m([x0 + RV, B]))}`,
    node: m([x0, B - g.stem - g.weight.master * 1.45]),
    label: m([x0, B - g.stem - g.weight.master * 1.45]),
  });
  let xL = x0 + 2 * RV;
  const add = (id: string, rank: Part, color?: string, live?: boolean) => {
    const r = g.radius[rank];
    const h = g.height[rank];
    const top = B - h;
    const left = xL;
    segs.push({
      id,
      rank,
      color,
      live,
      d:
        `M${fmt(m([left - RV, B]))} A${RV} ${RV} 0 0 0 ${fmt(m([left, B - RV]))} L${fmt(m([left, top + r]))} ` +
        `A${r} ${r} 0 0 1 ${fmt(m([left + 2 * r, top + r]))} L${fmt(m([left + 2 * r, B - RV]))} ` +
        `A${RV} ${RV} 0 0 0 ${fmt(m([left + 2 * r + RV, B]))}`,
      // the crest alone — the path the colour trace runs along
      crest: `M${fmt(m([left, top + r]))} A${r} ${r} 0 0 1 ${fmt(m([left + 2 * r, top + r]))}`,
      // the node sits on the crest, on the line
      node: rank === "next" ? undefined : m([left + r, top]),
      // annotation beside the node: above-right on desktop, to the right of the crest on phones
      label: turn ? m([left + r, top - nodeR(g, rank) - 9]) : m([left + r + nodeR(g, rank) + 8, top - 10]),
    });
    xL = left + 2 * r + 2 * RV;
  };
  services.forEach((e) => add(e.id, "services", `var(${e.accent})`, e.status === "live"));
  products.forEach((e) => add(e.id, "products", `var(${e.accent})`, e.status === "live"));
  add("next", "next");
  const length = xL - RV + 24;
  return { segs, view: turn ? { w: B + 8 + 24, h: length } : { w: length, h: B + 4 } };
}

export function Source({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const h = t.home.hero;
  const services = getServices();
  const products = getProducts();
  const all = [...services, ...products];
  const geos = { d: build(services, products, DESKTOP, false), p: build(services, products, PHONE, true) };

  // focus / hover on a part: its node lights, a trace of its colour runs up to the crest; the rest steps back
  const css = all
    .map((e) => {
      const on = `#source:has([data-part="${e.id}"]:hover,[data-part="${e.id}"]:focus-visible)`;
      return (
        `${on} [data-trace="${e.id}"]{stroke-dashoffset:-.34}` +
        `${on} [data-node="${e.id}"]{transform:scale(1.3)}` +
        `${on} [data-node]:not([data-node="${e.id}"]){opacity:.35}` +
        `${on} [data-part]:not([data-part="${e.id}"]){opacity:.42}`
      );
    })
    .join("");

  const figure = (mode: "d" | "p") => {
    const { segs, view } = geos[mode];
    const g = mode === "d" ? DESKTOP : PHONE;
    return (
      <svg className={mode === "d" ? styles.svgDesktop : styles.svgPhone} viewBox={`0 0 ${view.w} ${view.h}`} aria-hidden="true" focusable="false">
        {segs.map((s, i) => (
          <path
            key={s.id}
            className={s.rank === "next" ? styles.next : styles.stroke}
            data-rank={s.rank}
            d={s.d}
            pathLength={s.rank === "next" ? undefined : 1}
            style={{ strokeWidth: g.weight[s.rank], "--i": i } as CSSProperties}
          />
        ))}
        {segs
          .filter((s) => s.color && s.crest)
          .map((s) => (
            <path key={s.id} className={styles.trace} d={s.crest} pathLength={1} data-trace={s.id} style={{ stroke: s.color, strokeWidth: g.weight[s.rank] }} />
          ))}
        {/* the source stem's round top (the stroke itself has butt ends, so the valley joins stay clean) */}
        <circle className={styles.cap} cx={mode === "d" ? X0 : g.stem + 8} cy={mode === "d" ? g.B - g.stem : X0} r={g.weight.master / 2} />
        {segs.map((s) => {
          if (!s.node) return null;
          const [cx, cy] = s.node;
          const r = nodeR(g, s.rank);
          return s.rank === "master" ? (
            <circle key={s.id} className={styles.source} data-motion="source" cx={r1(cx)} cy={r1(cy)} r={r} />
          ) : (
            <circle
              key={s.id}
              className={styles.node}
              data-node={s.id}
              data-state={s.live ? "live" : "launching"}
              cx={r1(cx)}
              cy={r1(cy)}
              r={r}
              style={{ "--c": s.color, "--i": segs.indexOf(s) } as CSSProperties}
            />
          );
        })}
      </svg>
    );
  };

  const pos = (id: string, mode: "d" | "p") => {
    const { segs, view } = geos[mode];
    const [x, y] = segs.find((s) => s.id === id)!.label;
    return { x: `${(x / view.w) * 100}%`, y: `${(y / view.h) * 100}%` };
  };
  const segs = geos.d.segs;

  return (
    <section id="source" className={styles.hero} data-surface="paper" data-scene="source" aria-labelledby="page-title">
      <style>{css}</style>
      <div className={`container ${styles.grid}`}>
        <h1 id="page-title" className={styles.title}>
          <Lines text={h.title} />
        </h1>
        <div className={styles.side}>
          <p className={styles.lead}>{h.lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={localeHref(locale, ROUTES.contact)} icon="arrowRight">
              {t.common.cta.discuss}
            </ButtonLink>
            <ArrowLink href={localeHref(locale, ROUTES.ecosystem)}>{t.common.cta.ecosystem}</ArrowLink>
          </div>
        </div>
      </div>

      <nav className={styles.figure} aria-label={h.structure}>
        <div className={styles.stage}>
          {figure("d")}
          {figure("p")}
          <ul role="list" className={styles.labels}>
            {segs.map((s) => {
              const d = pos(s.id, "d");
              const p = pos(s.id, "p");
              const style = { "--dx": d.x, "--dy": d.y, "--px": p.x, "--py": p.y } as CSSProperties;
              if (s.id === "univo") {
                return (
                  <li key={s.id} className={`${styles.label} ${styles.master}`} style={style}>
                    <span className={styles.name}>UNIVO</span>
                    <span className={styles.role}>{h.sourceRole}</span>
                  </li>
                );
              }
              if (s.id === "next") {
                return (
                  <li key={s.id} className={`${styles.label} ${styles.nextLabel}`} style={style} aria-hidden="true">
                    <span className={styles.role}>{h.next}</span>
                  </li>
                );
              }
              const e = all.find((x) => x.id === s.id)!;
              const link = resolveEntityLink(e, locale, t);
              return (
                <li key={s.id} className={styles.label} data-rank={s.rank} style={style}>
                  <Link href={link.href} className={styles.link} data-part={e.id}>
                    <span className={styles.name} translate="no">
                      <span className="visually-hidden">UNIVO </span>
                      {e.word}
                    </span>
                    <span className={styles.role}>
                      <span className="visually-hidden">{s.rank === "services" ? h.services : h.products}. </span>
                      {e.status === "live" ? pick(e.role, locale) : pick(STATUS_LABEL[e.status], locale)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </section>
  );
}
