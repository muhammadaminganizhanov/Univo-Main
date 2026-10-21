import type { EntityStatus, EntityType, Market } from "./ecosystem";
import type { Localized } from "./localized";

/** Labels shared by every UNIVO site (master, TECH, PRODUCTION …). */
export const STATUS_LABEL: Record<EntityStatus, Localized> = {
  live: { ru: "Работает", en: "Live", ky: "Иштеп жатат" },
  launching: { ru: "Скоро запуск", en: "Launching soon", ky: "Жакында ишке кирет" },
  development: { ru: "В разработке", en: "In development", ky: "Иштелип чыгууда" },
  private: { ru: "Закрытый доступ", en: "Private", ky: "Жабык" },
  archived: { ru: "В архиве", en: "Archived", ky: "Архивде" },
};

/** Short form for tight places (footer, switcher). */
export const STATUS_SHORT: Partial<Record<EntityStatus, Localized>> = {
  launching: { ru: "Скоро", en: "Soon", ky: "Жакында" },
};

export const TYPE_LABEL: Record<EntityType, Localized> = {
  masterbrand: { ru: "Группа", en: "Group", ky: "Топ" },
  service: { ru: "Направление", en: "Direction", ky: "Багыт" },
  product: { ru: "Продукт", en: "Product", ky: "Продукт" },
};

export const MARKET_LABEL: Record<Market, Localized> = {
  kg: { ru: "Кыргызстан", en: "Kyrgyzstan", ky: "Кыргызстан" },
  international: { ru: "Открыты к международным проектам", en: "Open to international projects", ky: "Эл аралык долбоорлорго ачыкпыз" },
};
