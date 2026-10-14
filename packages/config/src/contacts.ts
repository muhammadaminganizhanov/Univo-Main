/**
 * Contact channels per entity. Each entity owns its own contacts; they are never mixed.
 * Only verified channels go here. `null` = not provided yet → the UI hides it.
 *
 * TODO(owner): UNIVO, UNIVO TECH and UNIVO PRODUCTION phone / email / Telegram / WhatsApp /
 * address. Nothing was available in the source materials, so nothing is published.
 */
export interface ContactChannels {
  email: string | null;
  phone: string | null;
  telegram: string | null;
  whatsapp: string | null;
  city: string | null;
}

export type ContactOwner = "univo" | "tech" | "production" | "retail" | "slot";

const EMPTY: ContactChannels = { email: null, phone: null, telegram: null, whatsapp: null, city: null };

export const CONTACTS: Record<ContactOwner, ContactChannels> = {
  univo: { ...EMPTY },
  tech: { ...EMPTY },
  production: { ...EMPTY },
  // Products collect early-access leads through the site form only.
  retail: { ...EMPTY },
  slot: { ...EMPTY },
};

export const hasAnyChannel = (c: ContactChannels) =>
  Object.values(c).some((v) => typeof v === "string" && v.length > 0);

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
