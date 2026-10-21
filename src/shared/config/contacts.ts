/**
 * Contact channels per entity. Each entity owns its own contacts; they are never mixed.
 * Only verified channels go here. `null` = not provided yet → the UI hides it.
 *
 * TODO(owner): UNIVO email / Telegram; TECH and PRODUCTION contacts.
 */
export interface ContactChannels {
  email: string | null;
  /** International format, shown as written: "+996 990 090 086". */
  phone: string | null;
  telegram: string | null;
  /** WhatsApp number, international format. */
  whatsapp: string | null;
  /** City per locale. */
  city: { ru: string; en: string; ky: string } | null;
  /** ISO 3166-1 alpha-2 country of the city (structured data). */
  country: string | null;
}

export type ContactOwner = "univo" | "tech" | "production" | "retail" | "slot";

const EMPTY: ContactChannels = { email: null, phone: null, telegram: null, whatsapp: null, city: null, country: null };

export const CONTACTS: Record<ContactOwner, ContactChannels> = {
  univo: {
    ...EMPTY,
    phone: "+996 990 090 086",
    whatsapp: "+996 990 090 086",
    city: { ru: "Бишкек", en: "Bishkek", ky: "Бишкек" },
    country: "KG",
  },
  tech: { ...EMPTY },
  production: { ...EMPTY },
  // Products collect early-access leads through the site form only.
  retail: { ...EMPTY },
  slot: { ...EMPTY },
};

export const hasAnyChannel = (c: ContactChannels) => !!(c.email || c.phone || c.telegram || c.whatsapp || c.city);

/** Digits and "+" only: for tel: links. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** WhatsApp chat link (wa.me wants the number without "+" or spaces). */
export const whatsappHref = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

/**
 * Legal data. Brand Book p. 64: the brand never replaces the legal name; "© [year] UNIVO" is a brand
 * signature only; ® and ™ are not used until a lawyer confirms registration.
 * TODO(owner): legal entity name, privacy policy URL, terms URL.
 */
export const LEGAL = {
  legalName: null as string | null,
  privacyPolicyUrl: null as string | null,
  termsUrl: null as string | null,
};
