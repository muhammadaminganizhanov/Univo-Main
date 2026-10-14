/** Lead model shared by every UNIVO form. Validation codes are localized by the UI. */

export const INTERESTS = ["tech", "production", "retail", "slot", "unsure"] as const;
export type Interest = (typeof INTERESTS)[number];

export const EARLY_ACCESS_PRODUCTS = ["retail", "slot"] as const;
export type EarlyAccessProduct = (typeof EARLY_ACCESS_PRODUCTS)[number];

export interface ContactLead {
  kind: "contact";
  name: string;
  company: string | null;
  contact: string;
  interest: Interest;
  message: string;
}

export interface EarlyAccessLead {
  kind: "early-access";
  product: EarlyAccessProduct;
  name: string;
  contact: string;
  business: string;
  comment: string | null;
}

export type Lead = (ContactLead | EarlyAccessLead) & {
  locale: string;
  source: string; // which app sent it, e.g. "univo"
  consent: true;
  receivedAt: string;
};

export type FieldError = "required" | "too_short" | "too_long" | "invalid_contact" | "invalid_choice" | "consent_required";

export type FormState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, FieldError>; values: Record<string, string> }
  /** Accepted by a real channel. */
  | { status: "sent" }
  /** Validated on the server but NOT delivered anywhere (staging). The UI must say so. */
  | { status: "staged" }
  /** Delivery channel failed or is not configured. Input is kept. */
  | { status: "failed"; values: Record<string, string> };
