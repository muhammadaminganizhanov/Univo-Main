"use server";

import { isLocale } from "@univo/config";
import type { FormState } from "@univo/leads";
import { handleContact, handleEarlyAccess } from "@univo/leads/server";

/** `key` changes on every response so the form remounts with the returned values. */
export type ActionState = FormState & { key?: string };

const meta = (form: FormData) => {
  const raw = form.get("locale");
  return { locale: typeof raw === "string" && isLocale(raw) ? raw : "ru", source: "univo" };
};

export async function contactAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  return { ...(await handleContact(form, meta(form))), key: crypto.randomUUID() };
}

export async function earlyAccessAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  return { ...(await handleEarlyAccess(form, meta(form))), key: crypto.randomUUID() };
}
