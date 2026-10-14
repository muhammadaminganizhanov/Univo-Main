import { MARKET_LABEL, STATUS_LABEL, TYPE_LABEL, getEntity, getMembers, pick, type Entity } from "@univo/content";
import { Dot, Icon, Lines } from "@univo/ui";
import type { CSSProperties } from "react";
import { entityDot, entityState } from "@/components/system/GroupStroke";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import { AppLink } from "@/components/shared/AppLink";
import styles from "./EcoMap.module.css";

/**
 * Ecosystem entry: the group as architecture. One straight master line from the UNIVO source;
 * every member hangs from it on a stem (a junction, the way n springs from the shared stem in the
 * wordmark). Groups are bracketed; the line continues dashed into the next member's place.
 * Motion: [data-route="master"] draws, [data-segment] stems drop, [data-node] activate.
 */
export function EcoMap({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const m = t.ecosystem.map;
  const univo = getEntity("univo");
  const members = getMembers();
  const count = (type: Entity["type"]) => members.filter((e) => e.type === type).length;

  return (
    <section className={styles.hero} data-surface="paper" data-scene="map" aria-labelledby="page-title">
      <div className="container">
        <div className={styles.head}>
          <h1 id="page-title" className={`t-display ${styles.title}`}>
            <Lines text={t.ecosystem.intro.title} />
          </h1>
          <p className={`t-lead ${styles.lead}`}>{t.ecosystem.intro.lead}</p>
        </div>

        <nav aria-label={m.label}>
          <div
            className={styles.map}
            style={{ "--_n": members.length, "--_s": count("service"), "--_p": count("product") } as CSSProperties}
          >
            <div className={styles.brackets} aria-hidden="true">
              <span className={styles.bracketServices}>{m.services}</span>
              <span className={styles.bracketProducts}>{m.products}</span>
            </div>

            <span className={styles.master} aria-hidden="true" data-route="master" data-draw="" />

            <ol role="list" className={styles.nodes}>
              <li className={styles.source} data-entity={univo.id}>
                <Dot color={entityDot(univo)} size={24} node={univo.id} className={styles.sourceDot} />
                <span className={styles.name} translate="no">
                  {univo.name}
                </span>
                <span className="t-meta">{m.source}</span>
              </li>
              {members.map((e, i) => {
                const link = resolveEntityLink(e, locale);
                const href = link.href;
                return (
                  <li key={e.id} className={styles.member} data-entity={e.id} data-segment={i + 1}>
                    <AppLink href={href} external={link.external} className={styles.memberLink}>
                      <span className={styles.stem} aria-hidden="true" />
                      <Dot
                        color={entityDot(e)}
                        state={entityState(e)}
                        size={22}
                        node={e.id}
                        className={styles.memberDot}
                      />
                      <span className={styles.name}>
                        <span className="visually-hidden">UNIVO </span>
                        <span translate="no">{e.word}</span>
                      </span>
                      <span className={styles.spec}>
                        <span className={styles.specType}>{pick(TYPE_LABEL[e.type], locale)}</span>
                        <span>{pick(e.role, locale)}</span>
                        <span className={styles.status}>
                          <Icon name={e.status === "live" ? "check" : "clock"} size={14} />
                          {pick(STATUS_LABEL[e.status], locale)}
                        </span>
                        {e.markets.length ? (
                          <span className={styles.specMarket}>
                            {e.markets.map((mk) => pick(MARKET_LABEL[mk], locale)).join(" · ")}
                          </span>
                        ) : null}
                      </span>
                    </AppLink>
                  </li>
                );
              })}
              <li className={styles.next}>
                <span className={styles.stem} aria-hidden="true" />
                <span className={styles.nextRing} aria-hidden="true" />
                <span className="t-meta">{m.openEnd}</span>
              </li>
            </ol>
          </div>
        </nav>

        <p className={`t-meta ${styles.legend}`}>
          <span>
            <Dot color="var(--color-fg)" size={10} /> {m.legendLive}
          </span>
          <span>
            <Dot color="var(--color-fg)" state="ring" size={10} /> {m.legendLaunching}
          </span>
        </p>
      </div>
    </section>
  );
}
