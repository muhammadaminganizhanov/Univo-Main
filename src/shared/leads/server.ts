import "server-only";
import { getDelivery } from "./delivery.ts";
import type { FormState, Lead } from "./types.ts";
import { isSpam, validateContact, validateEarlyAccess } from "./validate.ts";

type Meta = { locale: string; source: string };

async function submit(lead: Lead, values: Record<string, string>): Promise<FormState> {
  const delivery = getDelivery();
  const { delivered } = await delivery.deliver(lead);
  if (delivery.mode === "staging") return { status: "staged" };
  return delivered ? { status: "sent" } : { status: "failed", values };
}

const envelope = (meta: Meta) => ({ ...meta, consent: true as const, receivedAt: new Date().toISOString() });

export async function handleContact(form: FormData, meta: Meta): Promise<FormState> {
  if (isSpam(form)) return { status: "staged" };
  const result = validateContact(form);
  if (!result.ok) return { status: "invalid", errors: result.errors, values: result.values };
  return submit({ ...result.data, ...envelope(meta) }, result.values);
}

export async function handleEarlyAccess(form: FormData, meta: Meta): Promise<FormState> {
  if (isSpam(form)) return { status: "staged" };
  const result = validateEarlyAccess(form);
  if (!result.ok) return { status: "invalid", errors: result.errors, values: result.values };
  return submit({ ...result.data, ...envelope(meta) }, result.values);
}
