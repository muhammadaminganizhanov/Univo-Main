import "server-only";
import { MARKET_LABEL, STATUS_LABEL, TYPE_LABEL, getEntity, getProducts, getServices, pick, type Entity } from "@univo/content";
import type { LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import type { ModelLevel } from "./geometry";
import type { Callout } from "./Model";

const color = (e: Entity) => `var(${e.accent})`;
const member = (e: Entity) => ({ id: e.id, state: e.status === "live" ? ("filled" as const) : ("ring" as const), color: color(e) });

/** Levels of the building, straight from the ecosystem data. A new entity = a new slab, no code. */
export function groupLevels(): ModelLevel[] {
  const univo = getEntity("univo");
  return [
    { id: "master", members: [member(univo)] },
    { id: "services", members: getServices().map(member) },
    { id: "products", members: getProducts().map(member) },
    { id: "next", members: [], ghost: true },
  ];
}

/** Callouts: what each slab is. `detail` adds type, status and market (exploded view). */
export function groupCallouts(ctx: LocaleContext, detail = false): Callout[] {
  const { t, locale } = ctx;
  const univo = getEntity("univo");
  const meta = (e: Entity) =>
    detail
      ? [pick(TYPE_LABEL[e.type], locale), pick(STATUS_LABEL[e.status], locale), ...e.markets.map((m) => pick(MARKET_LABEL[m], locale))].join(" · ")
      : e.status === "launching"
        ? pick(STATUS_LABEL[e.status], locale)
        : pick(e.role, locale);
  return [
    { id: univo.id, name: univo.name, meta: t.home.hero.sourceRole },
    ...[...getServices(), ...getProducts()].map((e) => ({
      id: e.id,
      name: (
        <>
          <span className="visually-hidden">UNIVO </span>
          <span translate="no">{e.word}</span>
        </>
      ),
      meta: detail ? (
        <>
          <b>{pick(e.role, locale)}</b>
          {meta(e)}
        </>
      ) : (
        meta(e)
      ),
      href: resolveEntityLink(e, locale, t).href,
    })),
    { id: "next", name: t.v2.model.next, meta: t.v2.model.nextMeta },
  ];
}
