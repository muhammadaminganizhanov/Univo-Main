import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveDeliveryMode, stagingDelivery } from "../src/delivery.ts";
import { isSpam, isValidContact, validateContact, validateEarlyAccess } from "../src/validate.ts";

const form = (entries: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
};

test("contact channel accepts e-mail, phone and handle", () => {
  assert.ok(isValidContact("name@company.kg"));
  assert.ok(isValidContact("+996 555 123 456"));
  assert.ok(isValidContact("@univo_team"));
  assert.ok(!isValidContact("hello"));
  assert.ok(!isValidContact("12345"));
});

test("contact form: valid input", () => {
  const r = validateContact(
    form({ name: "Айгуль", contact: "+996 555 123 456", message: "Нужен сайт и ролик к запуску.", interest: "tech", consent: "on" }),
  );
  assert.equal(r.ok, true);
});

test("contact form: errors are codes and input is kept", () => {
  const r = validateContact(form({ name: "A", contact: "nope", message: "", interest: "food" }));
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.deepEqual(r.errors, {
    name: "too_short",
    contact: "invalid_contact",
    message: "required",
    interest: "invalid_choice",
    consent: "consent_required",
  });
  assert.equal(r.values.contact, "nope");
});

test("contact form: the task and a way to reply are enough; the name is optional", () => {
  const r = validateContact(form({ contact: "@univo_team", message: "Нужен сайт к открытию филиала.", consent: "on" }));
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.data.name, null);
});

test("early access: the name is still required", () => {
  const r = validateEarlyAccess(form({ contact: "a@b.kg", business: "Магазин, 3 филиала", product: "retail", consent: "on" }));
  assert.equal(r.ok, false);
  assert.equal(!r.ok && r.errors.name, "required");
});

test("contact form: interest defaults to unsure", () => {
  const r = validateContact(form({ name: "Ян", contact: "a@b.kg", message: "Хочу обсудить идею.", consent: "on" }));
  assert.equal(r.ok && r.data.interest, "unsure");
});

test("early access: product must be a launching product", () => {
  const base = { name: "Бек", contact: "a@b.kg", business: "Магазин, 3 филиала", consent: "on" };
  assert.equal(validateEarlyAccess(form({ ...base, product: "retail" })).ok, true);
  assert.equal(validateEarlyAccess(form({ ...base, product: "tech" })).ok, false);
});

test("honeypot", () => {
  assert.ok(isSpam(form({ website: "http://spam" })));
  assert.ok(!isSpam(form({})));
});

test("staging never reports delivery", async () => {
  assert.equal(resolveDeliveryMode(undefined), "staging");
  assert.equal(resolveDeliveryMode("staging"), "staging");
  assert.equal(resolveDeliveryMode("crm"), "live");
  const r = await stagingDelivery.deliver({} as never);
  assert.equal(r.delivered, false);
});
