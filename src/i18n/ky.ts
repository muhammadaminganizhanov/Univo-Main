import type { Dictionary } from "./ru";

type DeepPartial<T> = T extends readonly unknown[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/**
 * Kyrgyz — structure is complete, copy is NOT.
 * Only short, unambiguous interface words are translated here. Everything else falls back to
 * Russian (rendered with lang="ru") until a professional translator delivers the Kyrgyz copy.
 *
 * TODO(translation): full Kyrgyz copy for meta, home, ecosystem, about, contact, forms, notFound,
 * including the main CTA «Обсудить задачу» (localize only with a confident translation).
 */
export const ky: DeepPartial<Dictionary> = {
  common: {
    nav: {
      home: "Башкы бет",
      ecosystem: "Экосистема",
      about: "Биз жөнүндө",
      contact: "Байланыш",
    },
    menu: {
      open: "Меню",
      title: "Меню",
    },
    locale: {
      label: "Сайттын тили",
    },
  },
};

/** Shown on every Kyrgyz page while the translation is incomplete. */
export const KY_FALLBACK_NOTICE = "Кыргызча котормо даярдалып жатат. Азырынча тексттин бир бөлүгү орус тилинде.";
