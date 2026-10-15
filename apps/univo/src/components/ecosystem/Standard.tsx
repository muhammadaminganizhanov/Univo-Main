import { getProducts, getServices } from "@univo/content";
import { ArrowLink } from "@univo/ui";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Standard.module.css";

/*
 * The common standard. Not a selector (that is the Home's): one quiet architectural moment. Every part
 * of the group — and the next one, dashed — comes in as its own line; the lines become one flow, and the
 * flow passes five checkpoints, one standard each: the line breaks, a short perpendicular marker
 * holds it, and past every checkpoint the flow is a little heavier — the system settles as it passes.
 * Past the last one the line runs on, dotted and open: whatever joins the group next passes the same.
 */
const FAN = { w: 96, h: 200, spread: 26, mid: 100 };

export function Standard({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const s = t.ecosystem.standard;
  const parts = [...getServices(), ...getProducts()];
  const lines = [...parts.map((e) => ({ id: e.id, name: e.word!, c: `var(${e.accent})`, live: e.status === "live" })), { id: "next", name: s.next, c: "", live: false }];
  const top = FAN.mid - ((lines.length - 1) * FAN.spread) / 2;

  return (
    <section id="standard" className={styles.section} data-surface="white" data-scene="eco-standard" aria-labelledby="eco-standard">
      <div className="container">
        <div className={styles.head}>
          <h2 id="eco-standard" className={styles.title} data-reveal>
            {s.title}
          </h2>
          <ArrowLink href={localeHref(locale, ROUTES.about)} className={styles.more}>
            {s.more}
          </ArrowLink>
        </div>

        <div className={styles.figure} style={{ "--top": `${top}px` } as CSSProperties}>
          <ul role="list" className={styles.parts} aria-label={s.parts}>
            {lines.map((l, i) => (
              <li key={l.id} className={styles.part} data-next={l.id === "next" ? "" : undefined} style={{ "--c": l.c, "--i": i } as CSSProperties}>
                <span className={styles.partNode} data-state={l.id === "next" ? "next" : l.live ? "live" : "launching"} aria-hidden="true" />
                <span translate={l.id === "next" ? undefined : "no"}>
                  {l.id === "next" ? null : <span className="visually-hidden">UNIVO </span>}
                  {l.name}
                </span>
              </li>
            ))}
          </ul>
          {/* desktop: the parts' lines become one */}
          <svg className={styles.fan} viewBox={`0 0 ${FAN.w} ${FAN.h}`} aria-hidden="true" focusable="false">
            {lines.map((l, i) => {
              const y = top + i * FAN.spread;
              return (
                <path
                  key={l.id}
                  className={l.id === "next" ? styles.fanNext : styles.fanLine}
                  d={`M6 ${y} L18 ${y} C54 ${y} 58 ${FAN.mid} ${FAN.w} ${FAN.mid}`}
                  pathLength={l.id === "next" ? undefined : 1}
                  style={{ "--i": i } as CSSProperties}
                />
              );
            })}
          </svg>
          <div className={styles.rail}>
            <ol role="list" className={styles.gates}>
              {t.standards.map((st, i) => (
                <li key={st.title} className={styles.gate} style={{ "--i": i } as CSSProperties}>
                  <span className={styles.post} aria-hidden="true" />
                  <h3 className={styles.name}>
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    {st.title}
                  </h3>
                  <p className={styles.check}>{st.check}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
