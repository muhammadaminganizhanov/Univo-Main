import {
  EARLY_ACCESS_PRODUCTS,
  INTERESTS,
  type ContactLead,
  type EarlyAccessLead,
  type FieldError,
} from "./types.ts";

type Result<T> = { ok: true; data: T; values: Record<string, string> } | { ok: false; errors: Record<string, FieldError>; values: Record<string, string> };

const LIMITS = { name: 120, company: 160, contact: 160, message: 3000, business: 300, comment: 2000 } as const;

const str = (form: FormData, key: string) => {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts an e-mail, a phone number (≥ 9 digits) or a messenger handle (@name). */
export function isValidContact(value: string): boolean {
  if (EMAIL.test(value)) return true;
  if (/^@[A-Za-z0-9_]{4,32}$/.test(value)) return true;
  const digits = value.replace(/[^\d]/g, "");
  return /^[+\d\s()\-.]+$/.test(value) && digits.length >= 9 && digits.length <= 15;
}

function text(
  form: FormData,
  key: keyof typeof LIMITS,
  errors: Record<string, FieldError>,
  { required, min = 1 }: { required: boolean; min?: number },
) {
  const value = str(form, key);
  if (!value) {
    if (required) errors[key] = "required";
    return null;
  }
  if (value.length < min) errors[key] = "too_short";
  else if (value.length > LIMITS[key]) errors[key] = "too_long";
  return value;
}

function common(form: FormData, errors: Record<string, FieldError>, { nameRequired = true } = {}) {
  const name = text(form, "name", errors, { required: nameRequired, min: 2 });
  const contact = text(form, "contact", errors, { required: true });
  if (contact && !errors.contact && !isValidContact(contact)) errors.contact = "invalid_contact";
  if (form.get("consent") !== "on") errors.consent = "consent_required";
  return { name, contact };
}

const snapshot = (form: FormData, keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, str(form, k)]).filter(([, v]) => v !== ""));

/** Contact: only the task and a way to reply are required — the name is optional, checked if given. */
export function validateContact(form: FormData): Result<ContactLead> {
  const errors: Record<string, FieldError> = {};
  const { name, contact } = common(form, errors, { nameRequired: false });
  const company = text(form, "company", errors, { required: false });
  const message = text(form, "message", errors, { required: true, min: 10 });
  const interestRaw = str(form, "interest") || "unsure";
  const interest = (INTERESTS as readonly string[]).includes(interestRaw) ? (interestRaw as ContactLead["interest"]) : null;
  if (!interest) errors.interest = "invalid_choice";

  const values = snapshot(form, ["name", "company", "contact", "message", "interest"]);
  if (Object.keys(errors).length || !contact || !message || !interest) return { ok: false, errors, values };
  return { ok: true, data: { kind: "contact", name, company, contact, interest, message }, values };
}

export function validateEarlyAccess(form: FormData): Result<EarlyAccessLead> {
  const errors: Record<string, FieldError> = {};
  const { name, contact } = common(form, errors);
  const business = text(form, "business", errors, { required: true, min: 2 });
  const comment = text(form, "comment", errors, { required: false });
  const productRaw = str(form, "product");
  const product = (EARLY_ACCESS_PRODUCTS as readonly string[]).includes(productRaw)
    ? (productRaw as EarlyAccessLead["product"])
    : null;
  if (!product) errors.product = "invalid_choice";

  const values = snapshot(form, ["name", "contact", "business", "comment", "product"]);
  if (Object.keys(errors).length || !name || !contact || !business || !product) return { ok: false, errors, values };
  return { ok: true, data: { kind: "early-access", product, name, contact, business, comment }, values };
}

/** Honeypot: a hidden field real people never fill. */
export const isSpam = (form: FormData) => str(form, "website") !== "";
