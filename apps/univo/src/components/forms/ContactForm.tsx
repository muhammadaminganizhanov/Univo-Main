"use client";

import { INTERESTS, isValidContact, type FieldError } from "@univo/leads";
import { ArrowLink, Button, Icon } from "@univo/ui";
import { useActionState, useState, type ChangeEvent, type CSSProperties, type FocusEvent } from "react";
import { contactAction, type ActionState } from "@/app/actions";
import type { Dictionary } from "@/i18n";
import styles from "./ContactForm.module.css";
import { useFormFocus } from "./useFormFocus";

// "UNIVO decides" first: not knowing the right direction is the default, not a fallback.
const ORDER = ["unsure", ...INTERESTS.filter((i) => i !== "unsure")] as const;

/** What the reader can be told before submitting: only the two required fields, only after they leave them. */
function check(name: string, value: string): FieldError | undefined {
  const v = value.trim();
  if (name === "message") return !v ? "required" : v.length < 10 ? "too_short" : undefined;
  if (name === "contact") return !v ? "required" : isValidContact(v) ? undefined : "invalid_contact";
  if (name === "name") return v && v.length < 2 ? "too_short" : undefined;
  return undefined;
}

export interface ContactPart {
  id: string;
  word: string;
  accent: string;
}

/**
 * The quick way into UNIVO: say what needs doing, leave a way to reply. Everything else is optional —
 * by default UNIVO decides the route. Errors appear only once a field has been left, or after a submit.
 * A successful submit replaces the form with its own state.
 */
export function ContactForm({
  labels,
  copy,
  locale,
  defaultInterest,
  staging,
  homeHref,
  parts,
}: {
  labels: Dictionary["forms"];
  copy: Dictionary["contact"];
  locale: string;
  defaultInterest: string;
  staging: boolean;
  homeHref: string;
  parts: ContactPart[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(contactAction, { status: "idle" });
  const root = useFormFocus(state);
  // fields the reader has left, with their value — tied to the server response they belong to: a new
  // response starts a fresh form, and what the server said wins until a field is left again
  const [left, setLeft] = useState<{ key?: string; values: Record<string, string> }>({ values: {} });
  const touched = left.key === state.key ? left.values : {};
  const setTouched = (update: (t: Record<string, string>) => Record<string, string>) =>
    setLeft((l) => ({ key: state.key, values: update(l.key === state.key ? l.values : {}) }));

  const done = state.status === "staged" || state.status === "sent";
  const values = state.status === "invalid" || state.status === "failed" ? state.values : {};
  const serverErrors = state.status === "invalid" ? state.errors : {};
  const err = (k: string) => {
    const code = k in touched ? check(k, touched[k]!) : serverErrors[k];
    return code ? labels.errors[code] : undefined;
  };
  const leave = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => setTouched((t) => ({ ...t, [e.target.name]: e.target.value }));
  const edit = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in touched) setTouched((t) => ({ ...t, [name]: value }));
  };

  if (done) {
    const staged = state.status === "staged";
    return (
      <div ref={root} className={styles.root} data-done="">
        <div className={styles.success} data-result="" tabIndex={-1} role="status" aria-live="polite">
          <span className={styles.successNode} aria-hidden="true" />
          <h2 className={styles.successTitle}>{staged ? labels.staged.title : copy.success.title}</h2>
          <p className={styles.successBody}>{staged ? labels.staged.body : copy.success.body}</p>
          <ArrowLink href={homeHref} className={styles.home}>
            {copy.success.home}
          </ArrowLink>
        </div>
      </div>
    );
  }

  const field = (name: string, error: string | undefined, hint?: boolean) => ({
    id: `cf-${name}`,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [hint ? `cf-${name}-hint` : null, error ? `cf-${name}-err` : null].filter(Boolean).join(" ") || undefined,
    onBlur: leave,
    onChange: edit,
  });

  const message = err("message");
  const contact = err("contact");
  const name = err("name");
  const consent = serverErrors.consent ? labels.errors[serverErrors.consent] : undefined;

  return (
    <div ref={root} className={styles.root}>
      <form key={state.key} action={action} className={styles.form} noValidate>
        <input type="hidden" name="locale" value={locale} />
        <div className={styles.honeypot} aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* the two things that matter */}
        <div className={styles.field} data-weight="main">
          <label htmlFor="cf-message" className={styles.label}>
            {copy.form.task}
          </label>
          <textarea
            {...field("message", message)}
            className={styles.control}
            rows={3}
            required
            placeholder={copy.form.taskPlaceholder}
            defaultValue={values.message}
          />
          <FieldErr name="message">{message}</FieldErr>
        </div>

        <div className={styles.field} data-weight="main">
          <label htmlFor="cf-contact" className={styles.label}>
            {copy.form.contact}
          </label>
          <p id="cf-contact-hint" className={styles.hint}>
            {copy.form.contactHint}
          </p>
          <input
            {...field("contact", contact, true)}
            className={styles.control}
            type="text"
            required
            autoComplete="on"
            spellCheck={false}
            autoCapitalize="off"
            placeholder={copy.form.contactPlaceholder}
            defaultValue={values.contact}
          />
          <FieldErr name="contact">{contact}</FieldErr>
        </div>

        {/* everything else is optional */}
        <div className={styles.pair}>
          <div className={styles.field}>
            <label htmlFor="cf-name" className={styles.labelSmall}>
              {labels.name} <span className={styles.optional}>{labels.optional}</span>
            </label>
            <input {...field("name", name)} className={styles.control} data-size="small" type="text" autoComplete="name" defaultValue={values.name} />
            <FieldErr name="name">{name}</FieldErr>
          </div>
          <div className={styles.field}>
            <label htmlFor="cf-company" className={styles.labelSmall}>
              {labels.company} <span className={styles.optional}>{labels.optional}</span>
            </label>
            <input id="cf-company" name="company" className={styles.control} data-size="small" type="text" autoComplete="organization" defaultValue={values.company} />
          </div>
        </div>

        <fieldset className={styles.directions}>
          <legend className={styles.labelSmall}>
            {copy.form.direction} <span className={styles.optional}>{labels.optional}</span>
          </legend>
          <div className={styles.chips}>
            {ORDER.map((v) => {
              const part = parts.find((p) => p.id === v);
              return (
                <label key={v} className={styles.chip} style={{ "--c": part ? `var(${part.accent})` : "var(--accent-univo)" } as CSSProperties}>
                  <input type="radio" name="interest" value={v} defaultChecked={v === (values.interest ?? defaultInterest)} />
                  <span className={styles.chipDot} aria-hidden="true" />
                  {part ? (
                    <span translate="no">
                      <span className="visually-hidden">UNIVO </span>
                      {part.word}
                    </span>
                  ) : (
                    <span>{copy.form.unsure}</span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label className={styles.consent}>
            <input type="checkbox" id="cf-consent" name="consent" required aria-invalid={consent ? true : undefined} aria-describedby={consent ? "cf-consent-err" : undefined} />
            <span>{labels.consent}</span>
          </label>
          <FieldErr name="consent">{consent}</FieldErr>
        </div>

        {state.status === "invalid" || state.status === "failed" ? (
          <p className={styles.alert} role="alert">
            <Icon name="error" size={16} />
            <span>
              {state.status === "invalid" ? (
                labels.invalidSummary
              ) : (
                <>
                  <strong>{labels.failed.title}.</strong> {labels.failed.body}
                </>
              )}
            </span>
          </p>
        ) : null}

        <div className={styles.submit}>
          <Button type="submit" icon="arrowRight" disabled={pending} aria-disabled={pending}>
            {pending ? labels.submitting : copy.form.submit}
          </Button>
          {staging ? <p className={styles.staging}>{labels.stagingNote}</p> : null}
        </div>
      </form>
    </div>
  );
}

function FieldErr({ name, children }: { name: string; children?: string }) {
  return children ? (
    <p id={`cf-${name}-err`} className={styles.error}>
      <Icon name="error" size={16} />
      <span>{children}</span>
    </p>
  ) : null;
}
