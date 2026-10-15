import { MARKET_LABEL, STATUS_LABEL, getProducts, getServices, pick, type Entity } from "@univo/content";
import { ArrowLink, Icon } from "@univo/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Inside.module.css";

/**
 * Inside the group — the deeper layer (Ink). One spine runs from the UNIVO source through every part
 * and ends at the open ring of the next one. Focus or hover on a part makes it active: its route is
 * drawn down the spine from the source, piece after piece, in its colour; then its node, name and
 * arrow answer. The other parts step back but stay readable. Directions are set large; products
 * smaller and indented — they hang from the same spine.
 */
export function Inside({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const e = t.home.ecosystem;
  const tiers = [
    { id: "services", title: e.servicesTitle, note: e.servicesNote, list: getServices() },
    { id: "products", title: e.productsTitle, note: e.productsNote, list: getProducts() },
  ] as const;

  // Spine order: 0 = source, then each tier head and row in reading order.
  let k = 0;
  const order = new Map<string, number>();
  const plan = tiers.map((tier) => ({
    ...tier,
    head: ++k,
    rows: tier.list.map((entity) => {
      order.set(entity.id, ++k);
      return entity;
    }),
  }));
  const css = [...order.entries()]
    .map(([id, upto]) => {
      const on = `#inside:has([data-row="${id}"]:hover,[data-row="${id}"]:focus-visible)`;
      const trail = Array.from({ length: upto + 1 }, (_, i) => `${on} [data-k="${i}"]`).join(",");
      return (
        `${trail}{--trail:var(--accent-${id});--on:1}${on} [data-k="${upto}"]::before{bottom:50%}` +
        `${on} [data-row]:not([data-row="${id}"]){opacity:.38}`
      );
    })
    .join("");

  return (
    <section id="inside" className={styles.section} data-surface="ink" data-scene="ecosystem" aria-labelledby="home-ecosystem">
      <style>{css}</style>
      <div className="container">
        <div className={styles.head}>
          <h2 id="home-ecosystem" className={styles.title} data-reveal>
            {e.title}
          </h2>
          <p className={styles.lead}>{e.lead}</p>
        </div>

        <div className={styles.index}>
          <p className={styles.source} data-k="0" style={{ "--kk": 0 } as CSSProperties}>
            <span className={styles.sourceDot} aria-hidden="true" />
            <span className={styles.sourceName}>UNIVO</span>
            <span className={styles.sourceRole}>{t.home.hero.sourceRole}</span>
          </p>
          {plan.map((tier) => (
            <section key={tier.id} className={styles.tier} data-tier={tier.id} aria-labelledby={`idx-${tier.id}`}>
              <div className={styles.tierHead} data-k={tier.head} style={{ "--kk": tier.head } as CSSProperties}>
                <h3 id={`idx-${tier.id}`} className={styles.tierTitle}>
                  {tier.title}
                </h3>
                <p className={styles.tierNote}>{tier.note}</p>
              </div>
              <ul role="list">
                {tier.rows.map((entity) => (
                  <Row key={entity.id} e={entity} ctx={ctx} k={order.get(entity.id)!} />
                ))}
              </ul>
            </section>
          ))}
          <div className={styles.nextRow}>
            <span className={styles.nextRing} aria-hidden="true" />
            <p>{e.next}</p>
            <ArrowLink href={localeHref(locale, ROUTES.ecosystem)} className={styles.all}>
              {e.all}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ e, ctx, k }: { e: Entity; ctx: LocaleContext; k: number }) {
  const { t, locale } = ctx;
  const link = resolveEntityLink(e, locale, t);
  const href = e.type === "product" || link.available ? link.href : `${localeHref(locale, ROUTES.ecosystem)}#${e.slug}`;
  const live = e.status === "live";
  const where = e.markets.map((m) => pick(MARKET_LABEL[m], locale)).join(" · ");
  return (
    <li className={styles.item} data-k={k} style={{ "--c": `var(${e.accent})`, "--kk": k } as CSSProperties}>
      <Link href={href} className={styles.row} data-row={e.id}>
        <span className={styles.node} data-state={live ? "live" : "launching"} aria-hidden="true" />
        <span className={styles.name} translate="no">
          <span className="visually-hidden">UNIVO </span>
          {e.word}
        </span>
        <span className={styles.info}>
          <span className={styles.role}>{pick(e.role, locale)}</span>
          <span className={styles.desc}>{pick(e.shortDescription, locale)}</span>
          <span className={styles.meta}>
            {live ? (
              where
            ) : (
              <>
                <Icon name="clock" size={14} />
                {pick(STATUS_LABEL[e.status], locale)}
              </>
            )}
          </span>
        </span>
        <Icon name={link.external ? "arrowUpRight" : "arrowRight"} size={24} className={styles.go} />
      </Link>
    </li>
  );
}
