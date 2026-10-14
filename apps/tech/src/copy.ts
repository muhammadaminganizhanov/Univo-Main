import type { Localized } from "@univo/content";

/** Placeholder copy. Kyrgyz falls back to Russian until translated (TODO(translation)). */
export const COPY = {
  title: { ru: "Сайт {name} готовится", en: "The {name} site is in progress" } as Localized,
  body: {
    ru: "Пока здесь только заглушка. Обсудить задачу можно уже сейчас — через общую форму группы UNIVO.",
    en: "This is a placeholder for now. You can already discuss a project through the UNIVO group form.",
  } as Localized,
  discuss: { ru: "Обсудить задачу", en: "Discuss a project" } as Localized,
  back: { ru: "Вернуться в UNIVO", en: "Back to UNIVO" } as Localized,
  partOf: { ru: "Направление группы UNIVO", en: "A direction of the UNIVO group" } as Localized,
};
