import { MARKET_LABEL, STATUS_LABEL, getProducts, getServices, pick, type Entity } from "@univo/content";
import { Dot, Icon } from "@univo/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./Plan.module.css";

/**
 * The same floors seen from above (plan view). Plates on one level share their edge; the axis mark
 * sits on that edge. Dense, dark, factual.
 */
function Plate({ e, ctx }: { e: Entity; ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const link = resolveEntityLink(e, locale, t);
  const facts = e.status === "launching" ? pick(STATUS_LABEL[e.status], locale) : e.markets.map((m) => pick(MARKET_LABEL[m], locale)).join(" · ");
  return (
    <li className={styles.plateItem} data-entity={e.id}>
      <Link href={link.href} className={styles.plate} style={{ "--c": `var(${e.accent})` } as CSSProperties}>
        <span className={styles.head}>
          <Dot color="var(--c)" state={e.status === "live" ? "filled" : "ring"} size={14} node={e.id} />
          <span className={styles.word} translate="no">
            <span className="visually-hidden">UNIVO </span>
            {e.word}
          </span>
          <Icon name={link.external ? "arrowUpRight" : "arrowRight"} size={20} className={styles.go} />
        </span>
        <span className={styles.role}>{pick(e.role, locale)}</span>
        <span className={styles.desc}>{pick(e.shortDescription, locale)}</span>
        <span className={styles.facts}>
          {e.status === "launching" ? <Icon name="clock" size={14} /> : null}
          {facts}
        </span>
      </Link>
    </li>
  );
}

export function Plan({ ctx }: { ctx: LocaleContext }) {
  const p = ctx.t.v2.plan;
  const levels = [
    { id: "services", title: p.services, items: getServices() },
    { id: "products", title: p.products, items: getProducts() },
  ];
  return (
    <section className={styles.section} data-surface="ink" data-scene="plan" aria-labelledby="v2-plan">
      <div className="container">
        <div className={styles.intro}>
          <h2 id="v2-plan" className="t-h1">
            {p.title}
          </h2>
          <p className={`t-lead ${styles.lead}`}>{p.lead}</p>
        </div>
        <div className={styles.levels}>
          {levels.map((lv, i) => (
            <section key={lv.id} className={styles.level} aria-labelledby={`plan-${lv.id}`}>
              <h3 id={`plan-${lv.id}`} className={styles.levelTitle}>
                <span className={styles.levelNum}>{String(i + 1).padStart(2, "0")}</span>
                {lv.title}
              </h3>
              <ul role="list" className={styles.plates}>
                {lv.items.map((e) => (
                  <Plate key={e.id} e={e} ctx={ctx} />
                ))}
              </ul>
            </section>
          ))}
          <p className={styles.next}>
            <span className={styles.levelNum}>03</span>
            {p.next}
          </p>
        </div>
      </div>
    </section>
  );
}
