import { MARKET_LABEL, STATUS_LABEL, getProducts, getServices, pick, type Entity } from "@univo/content";
import { ArrowLink, Dot, Icon, Lines } from "@univo/ui";
import { AppLink } from "@/components/shared/AppLink";
import { entityState } from "@/components/system/GroupStroke";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./EcosystemIndex.module.css";

function Row({ e, ctx }: { e: Entity; ctx: LocaleContext }) {
  const { locale } = ctx;
  const link = resolveEntityLink(e, locale);
  const href = link.href;
  const where = e.markets.map((m) => pick(MARKET_LABEL[m], locale)).join(" · ");
  return (
    <li data-entity={e.id}>
      <AppLink href={href} external={link.external} className={styles.row} data-node-row={e.id}>
        <Dot className={styles.dot} color="var(--row-dot)" state={entityState(e)} size={20} node={e.id} />
        <span className={styles.segment} aria-hidden="true" data-route="segment" />
        <span className={styles.main}>
          <span className={styles.nameRow}>
            <span className={styles.name} translate="no">
              <span className="visually-hidden">UNIVO </span>
              {e.word}
            </span>
            {e.status === "launching" ? (
              <span className={styles.tag}>
                <Icon name="clock" size={14} />
                {pick(STATUS_LABEL[e.status], locale)}
              </span>
            ) : null}
          </span>
          <span className={styles.info}>
            <span className={styles.role}>{pick(e.role, locale)}</span>
            <span className={styles.detailText}>{pick(e.shortDescription, locale)}</span>
            {e.status === "live" ? <span className={styles.where}>{where}</span> : null}
          </span>
        </span>
        <Icon name={link.external ? "arrowUpRight" : "arrowRight"} size={24} className={styles.go} />
      </AppLink>
    </li>
  );
}

export function EcosystemIndex({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const e = t.home.ecosystem;
  return (
    <section className={styles.section} data-surface="ink" data-scene="ecosystem" aria-labelledby="home-ecosystem">
      <div className="container">
        <div className={styles.head}>
          <h2 id="home-ecosystem" className={`t-h1 ${styles.title}`}>
            <Lines text={e.title} />
          </h2>
          <p className={`t-lead ${styles.lead}`}>{e.lead}</p>
        </div>

        <div className={styles.index}>
          {(
            [
              ["services", e.servicesTitle, e.servicesNote, getServices()],
              ["products", e.productsTitle, e.productsNote, getProducts()],
            ] as const
          ).map(([key, title, note, list]) => (
            <section key={key} className={styles.group} aria-labelledby={`idx-${key}`}>
              <div className={styles.groupHead}>
                <h3 id={`idx-${key}`} className={styles.groupTitle}>
                  {title}
                </h3>
                <p className="t-meta">{note}</p>
              </div>
              <ul role="list">
                {list.map((entity) => (
                  <Row key={entity.id} e={entity} ctx={ctx} />
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
