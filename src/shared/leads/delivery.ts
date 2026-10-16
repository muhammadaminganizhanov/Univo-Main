import type { Lead } from "./types.ts";

/**
 * Delivery abstraction. A future adapter (CRM, e-mail, Telegram …) implements `deliver`.
 * None is connected yet: there is no verified channel or credentials in the source materials.
 */
export interface LeadDelivery {
  readonly mode: "staging" | "live";
  deliver(lead: Lead): Promise<{ delivered: boolean }>;
}

/** Staging: validates the full path but discards the lead. Never pretends it was delivered. */
export const stagingDelivery: LeadDelivery = {
  mode: "staging",
  async deliver() {
    return { delivered: false };
  },
};

/** Live mode requested but no adapter configured → fail honestly instead of dropping data silently. */
export const unconfiguredDelivery: LeadDelivery = {
  mode: "live",
  async deliver() {
    return { delivered: false };
  },
};

export type DeliveryMode = "staging" | "live";

export function resolveDeliveryMode(env: string | undefined): DeliveryMode {
  return env && env !== "staging" ? "live" : "staging";
}

export function getDelivery(env: string | undefined = process.env.LEAD_DELIVERY): LeadDelivery {
  // TODO(owner): choose the real channel per entity (UNIVO / RETAIL / SLOT) and add its adapter here.
  return resolveDeliveryMode(env) === "staging" ? stagingDelivery : unconfiguredDelivery;
}
