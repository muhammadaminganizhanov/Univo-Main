import { getProducts, getServices } from "@univo/content";
import { ArrowLink } from "@univo/ui";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Standard.module.css";

/*
 * The common standard. Not a selector (that is the Home's): one compact architectural layer. Every
 * part of the group is a line — the next part's line dashed; the lines gather into one bundle, and the
 * five standards hold it like clamps, each named with the check that shows it is met. The parts are
 * held together not only by the name. Colour stays on the parts' own nodes.
 */
const FAN = { w: 120, h: 180, spread: 26, gap: 8, top: 38 };

export function Standard({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const s = t.ecosystem.standard;
  const parts = [...getServices(), ...getProducts()];
  const lines = [...parts.map((e) => ({ id: e.id, name: e.word!, c: `var(${e.accent})`, live: e.status === "live" })), { id: "next", name: s.next, c: "", live: false }];
  const mid = FAN.top + ((lines.length - 1) * FAN.spread) / 2;
  const bundleTop = mid - ((lines.length - 1) * FAN.gap) / 2;

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

        <div className={styles.bundle} style={{ "--n": lines.length } as CSSProperties}>
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
          {/* desktop: the parts' lines gather into the bundle */}
          <svg className={styles.fan} viewBox={`0 0 ${FAN.w} ${FAN.h}`} aria-hidden="true" focusable="false">
            {lines.map((l, i) => {
              const y = FAN.top + i * FAN.spread;
              const c = bundleTop + i * FAN.gap;
              return <path key={l.id} className={l.id === "next" ? styles.fanNext : styles.fanLine} d={`M8 ${y} L28 ${y} C60 ${y} 60 ${c} 92 ${c} L${FAN.w} ${c}`} pathLength={l.id === "next" ? undefined : 1} />;
            })}
          </svg>
          <div className={styles.rail}>
            <span className={styles.cable} aria-hidden="true">
              {lines.map((l, i) => (
                <span key={l.id} data-next={l.id === "next" ? "" : undefined} style={{ "--c": l.c, "--i": i } as CSSProperties} />
              ))}
            </span>
            <ol role="list" className={styles.clamps}>
              {t.standards.map((st, i) => (
                <li key={st.title} className={styles.clamp} style={{ "--i": i } as CSSProperties}>
                  <span className={styles.bar} aria-hidden="true" />
                  <h3 className={styles.name}>{st.title}</h3>
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
