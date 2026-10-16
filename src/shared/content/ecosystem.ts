import type { ContactOwner } from "@univo/config";
import type { Localized } from "./localized";

/**
 * UNIVO ecosystem model. Everything that lists, links or colours an entity reads from here,
 * never from hardcoded JSX. Adding "UNIVO [NEW]" = one entry + (optionally) one app.
 *
 * Architecture (brief, 14.10.2026):
 *   UNIVO (masterbrand)
 *   ├── UNIVO TECH          service direction
 *   ├── UNIVO PRODUCTION    service direction
 *   ├── UNIVO RETAIL        own product (directly under UNIVO, not under TECH)
 *   └── UNIVO SLOT          own product (directly under UNIVO, not under TECH)
 */

export type EntityType = "masterbrand" | "service" | "product";
export type EntityStatus = "live" | "launching" | "development" | "private" | "archived";
export type EntityId = "univo" | "tech" | "production" | "retail" | "slot";
export type Market = "kg" | "international";

/** Accent = the dot colour of "who speaks" (Brand Book p. 21). A CSS custom property name. */
export type Accent = "--accent-univo" | "--accent-tech" | "--accent-production" | "--accent-retail" | "--accent-slot";

/**
 * Where the entity's primary CTA leads.
 * - `site`: its own app (URL from env; when absent the UI falls back to `fallback`).
 * - `early-access`: the pre-launch page with the early-access form on the master site.
 */
export type EntityLink =
  | { kind: "site"; app: "univo" | "tech" | "production"; fallback: "contact" }
  | { kind: "early-access"; path: `/ecosystem/${string}` };

export interface Entity {
  id: EntityId;
  slug: string;
  brand: "UNIVO";
  /** Full public name, always "UNIVO" + one word in capitals (Brand Book p. 38). */
  name: string;
  /** The word after UNIVO, used by the lockup. Null for the masterbrand. */
  word: "TECH" | "PRODUCTION" | "RETAIL" | "SLOT" | null;
  type: EntityType;
  status: EntityStatus;
  accent: Accent;
  link: EntityLink;
  contact: ContactOwner;
  markets: Market[];
  /** Locales the entity's own site/page is planned in. */
  locales: ("ru" | "en" | "ky")[];
  order: number;
  /** One line: what it is. */
  role: Localized;
  shortDescription: Localized;
  description: Localized;
  /** What the entity covers. Short, factual; not a price list. */
  scope: Localized<string[]>;
  /** Who it is for first (products). */
  segments?: Localized<string[]>;
  cta: Localized;
}

export const ENTITIES: Entity[] = [
  {
    id: "univo",
    slug: "univo",
    brand: "UNIVO",
    name: "UNIVO",
    word: null,
    type: "masterbrand",
    status: "live",
    accent: "--accent-univo",
    link: { kind: "site", app: "univo", fallback: "contact" },
    contact: "univo",
    markets: ["kg", "international"],
    locales: ["ru", "en", "ky"],
    order: 0,
    role: { ru: "Группа UNIVO", en: "UNIVO group" },
    shortDescription: {
      ru: "Одно имя для направлений и продуктов одних владельцев.",
      en: "One name for the directions and products of the same owners.",
    },
    description: {
      ru: "Мастер-бренд группы. Говорит от имени всех её частей.",
      en: "The group's masterbrand. It speaks for every part of the group.",
    },
    scope: { ru: [], en: [] },
    cta: { ru: "Обсудить задачу", en: "Discuss a project" },
  },
  {
    id: "tech",
    slug: "tech",
    brand: "UNIVO",
    name: "UNIVO TECH",
    word: "TECH",
    type: "service",
    status: "live",
    accent: "--accent-tech",
    link: { kind: "site", app: "tech", fallback: "contact" },
    contact: "tech",
    // Works internationally. Specific countries are not named until cases are published.
    markets: ["kg", "international"],
    locales: ["ru", "en", "ky"],
    order: 1,
    role: { ru: "Технологии и цифровые системы", en: "Technology and digital systems" },
    shortDescription: {
      ru: "Сайты, платформы, приложения и внутренние системы, которыми пользуются каждый день.",
      en: "Websites, platforms, apps and internal systems that people use every day.",
    },
    description: {
      ru: "Направление разработки. Проектирует и запускает цифровые продукты и системы для бизнеса — от сайта до автоматизации внутренних процессов.",
      en: "The development direction. It designs and launches digital products and systems for businesses — from a website to automated internal processes.",
    },
    scope: {
      ru: ["Сайты", "Платформы", "Мобильные приложения", "CRM", "Внутренние системы", "Автоматизация", "Боты", "Интеграции ИИ"],
      en: ["Websites", "Platforms", "Mobile apps", "CRM", "Internal systems", "Automation", "Bots", "AI integrations"],
    },
    cta: { ru: "Перейти в UNIVO TECH", en: "Go to UNIVO TECH" },
  },
  {
    id: "production",
    slug: "production",
    brand: "UNIVO",
    name: "UNIVO PRODUCTION",
    word: "PRODUCTION",
    type: "service",
    status: "live",
    accent: "--accent-production",
    link: { kind: "site", app: "production", fallback: "contact" },
    contact: "production",
    markets: ["kg"],
    locales: ["ru", "en", "ky"],
    order: 2,
    role: { ru: "Реклама и контент", en: "Advertising and content" },
    shortDescription: {
      ru: "Рекламные ролики и контент: сценарий, съёмка, монтаж.",
      en: "Commercials and content: script, shoot, edit.",
    },
    description: {
      ru: "Продакшн-направление группы. Снимает видео для брендов и бизнеса в Кыргызстане.",
      en: "The group's production direction. It makes video for brands and businesses in Kyrgyzstan.",
    },
    // Source: Brand Book p. 34, 55 ("Ролики, съёмка, монтаж"). Full service list — TODO(owner).
    scope: {
      ru: ["Рекламные ролики", "Контент для соцсетей", "Сценарий", "Съёмка", "Монтаж"],
      en: ["Commercials", "Social media content", "Script", "Shooting", "Editing"],
    },
    cta: { ru: "Перейти в UNIVO PRODUCTION", en: "Go to UNIVO PRODUCTION" },
  },
  {
    id: "retail",
    slug: "retail",
    brand: "UNIVO",
    name: "UNIVO RETAIL",
    word: "RETAIL",
    type: "product",
    status: "launching",
    accent: "--accent-retail",
    link: { kind: "early-access", path: "/ecosystem/retail" },
    contact: "retail",
    markets: [], // TODO(owner): launch market(s)
    locales: ["ru", "en", "ky"],
    order: 3,
    role: { ru: "Управление торговым бизнесом", en: "Retail business management" },
    shortDescription: {
      ru: "Товары, продажи, остатки, склад и филиалы — в одной системе.",
      en: "Products, sales, stock, warehouse and branches — in one system.",
    },
    description: {
      ru: "Система для торгового бизнеса: от учёта товара на складе до продаж в филиалах, долгов, сотрудников и отчётов.",
      en: "A system for retail businesses: from stock in the warehouse to sales across branches, debts, staff and reports.",
    },
    scope: {
      ru: ["Товары", "Продажи", "Остатки", "Склад", "Филиалы", "Долги", "Сотрудники и роли", "Аналитика", "Торговые операции"],
      en: ["Products", "Sales", "Stock", "Warehouse", "Branches", "Debts", "Staff and roles", "Analytics", "Trade operations"],
    },
    cta: { ru: "Получить ранний доступ", en: "Get early access" },
  },
  {
    id: "slot",
    slug: "slot",
    brand: "UNIVO",
    name: "UNIVO SLOT",
    word: "SLOT",
    type: "product",
    status: "launching",
    accent: "--accent-slot",
    link: { kind: "early-access", path: "/ecosystem/slot" },
    contact: "slot",
    markets: [], // TODO(owner): launch market(s)
    locales: ["ru", "en", "ky"],
    order: 4,
    role: { ru: "Онлайн-запись и сервисный бизнес", en: "Online booking for service businesses" },
    shortDescription: {
      ru: "Расписание, услуги, сотрудники и запись клиентов без звонков.",
      en: "Schedules, services, staff and client booking without phone calls.",
    },
    description: {
      ru: "Система онлайн-записи и управления для бизнеса, который работает по записи: клиенты выбирают свободное время сами, а команда видит всё расписание.",
      en: "Online booking and management for appointment-based businesses: clients pick a free slot themselves, and the team sees the whole schedule.",
    },
    scope: {
      ru: ["Расписание", "Сотрудники", "Услуги", "Клиенты", "Записи", "Свободные слоты"],
      en: ["Schedule", "Staff", "Services", "Clients", "Appointments", "Time slots"],
    },
    segments: {
      ru: ["Салоны красоты", "Стоматологии", "Сервисы по записи"],
      en: ["Beauty", "Dental", "Appointment-based services"],
    },
    cta: { ru: "Получить ранний доступ", en: "Get early access" },
  },
];

/** Statuses that may be shown publicly. development / private / archived stay hidden. */
export const PUBLIC_STATUSES: readonly EntityStatus[] = ["live", "launching"];

export const isPublic = (e: Entity) => PUBLIC_STATUSES.includes(e.status);

export const getEntity = (id: EntityId): Entity => {
  const e = ENTITIES.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown entity: ${id}`);
  return e;
};

const sorted = (list: Entity[]) => [...list].sort((a, b) => a.order - b.order);

/** Public group members (excludes the masterbrand itself). */
export const getMembers = () => sorted(ENTITIES.filter((e) => e.type !== "masterbrand" && isPublic(e)));
export const getServices = () => getMembers().filter((e) => e.type === "service");
export const getProducts = () => getMembers().filter((e) => e.type === "product");
export const getPrelaunchProducts = () => getProducts().filter((e) => e.status === "launching");
export const getEntityBySlug = (slug: string) => ENTITIES.find((e) => e.slug === slug && isPublic(e));
