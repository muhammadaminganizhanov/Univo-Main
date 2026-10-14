import { skylineGeometry } from "@univo/brand";
import { STATUS_LABEL, getEntity, getMembers, pick, type Entity } from "@univo/content";
import { Stroke, type StrokeItem } from "@univo/ui";
import { AppLink } from "@/components/shared/AppLink";
import type { ReactNode } from "react";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import styles from "./GroupStroke.module.css";

export const entityDot = (e: Entity) => `var(${e.accent})`;
export const entityState = (e: Entity): "filled" | "ring" => (e.status === "live" ? "filled" : "ring");

/**
 * Crest height carries meaning: live members stand taller than launching ones; the source is
 * tallest; a wider valley separates directions from products. Data-driven — a new member gets a
 * crest from its type and status, nothing is hand-placed.
 */
function crestsFor(members: Entity[]) {
  // Arcade rhythm: live directions stand tall, launching products lower but complete arches.
  const live = [44, 36, 32];
  const launching = [18, 14, 10];
  let l = 0;
  let n = 0;
  return members.map((e, i) => ({
    height: e.status === "live" ? (live[l++] ?? 66) : (launching[n++] ?? 34),
    groupStart: i > 0 && members[i - 1]!.type !== e.type,
  }));
}

/** Home hero: the group as an identity path — source stem, then one crest per member. */
export function GroupStroke({ ctx, sourceMeta, id }: { ctx: LocaleContext; sourceMeta: ReactNode; id?: string }) {
  const { locale } = ctx;
  const univo = getEntity("univo");
  const members = getMembers();

  const label = (e: Entity, href: string | null, meta: ReactNode, external = false) => {
    const name = (
      <>
        {e.word ? <span className="visually-hidden">UNIVO </span> : null}
        <span className={styles.word} translate="no">
          {e.word ?? e.name}
        </span>
      </>
    );
    const body = (
      <>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </>
    );
    return href ? (
      <AppLink href={href} external={external} className={`${styles.label} ${styles.link}`} data-entity={e.id} data-node-link={e.id}>
        {body}
      </AppLink>
    ) : (
      <div className={styles.label} data-entity={e.id}>
        {body}
      </div>
    );
  };

  const source: StrokeItem = { id: univo.id, color: entityDot(univo), label: label(univo, null, sourceMeta) };
  const nodes: StrokeItem[] = members.map((e) => {
    const link = resolveEntityLink(e, locale);
    const href = link.href;
    const meta = e.status === "launching" ? pick(STATUS_LABEL[e.status], locale) : pick(e.role, locale);
    return { id: e.id, color: entityDot(e), state: entityState(e), label: label(e, href, meta, link.external) };
  });

  return (
    <Stroke
      id={id}
      className={styles.stroke}
      geometry={skylineGeometry(72, crestsFor(members), { r: 44, valley: 14, groupGap: 2, sourceGap: 2, w: 7 })}
      source={source}
      nodes={nodes}
      weight={7}
    />
  );
}
