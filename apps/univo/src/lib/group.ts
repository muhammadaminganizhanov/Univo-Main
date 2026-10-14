import "server-only";
import type { Locale } from "@univo/config";
import { STATUS_SHORT, getEntity, getMembers, pick } from "@univo/content";
import type { GroupSwitcherItem } from "@univo/ui";
import type { Dictionary } from "@/i18n";
import { resolveEntityLink } from "./entities";
import { localeHref } from "./routes";

/** Items for the shared GroupSwitcher, as seen from the master site. */
export function groupSwitcherItems(locale: Locale, t: Dictionary): GroupSwitcherItem[] {
  const univo = getEntity("univo");
  return [
    { id: univo.id, name: univo.name, href: localeHref(locale), current: true },
    ...getMembers().map((e): GroupSwitcherItem => {
      const link = resolveEntityLink(e, locale, t);
      const soon = STATUS_SHORT[e.status];
      if (e.type === "product") {
        return { id: e.id, name: e.name, href: link.href, note: soon ? pick(soon, locale) : undefined };
      }
      return link.available
        ? { id: e.id, name: e.name, href: link.href, external: link.external }
        : { id: e.id, name: e.name, href: null, note: t.common.group.siteSoon };
    }),
  ];
}
