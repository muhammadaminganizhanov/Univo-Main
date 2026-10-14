import type { EntityStatus, EntityType, Market } from "./ecosystem";
import type { Localized } from "./localized";

/** Labels shared by every UNIVO site (master, TECH, PRODUCTION …). */
export const STATUS_LABEL: Record<EntityStatus, Localized> = {
  live: { ru: "Работает", en: "Live" },
  launching: { ru: "Скоро запуск", en: "Launching soon" },
  development: { ru: "В разработке", en: "In development" },
  private: { ru: "Закрытый доступ", en: "Private" },
  archived: { ru: "В архиве", en: "Archived" },
};

/** Short form for tight places (footer, switcher). */
export const STATUS_SHORT: Partial<Record<EntityStatus, Localized>> = {
  launching: { ru: "Скоро", en: "Soon" },
};

export const TYPE_LABEL: Record<EntityType, Localized> = {
  masterbrand: { ru: "Группа", en: "Group" },
  service: { ru: "Направление", en: "Direction" },
  product: { ru: "Продукт", en: "Product" },
};

export const MARKET_LABEL: Record<Market, Localized> = {
  kg: { ru: "Кыргызстан", en: "Kyrgyzstan" },
  international: { ru: "Открыты к международным проектам", en: "Open to international projects" },
};
