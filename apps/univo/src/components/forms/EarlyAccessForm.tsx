"use client";

import { Button, Checkbox, Icon, TextArea, TextField } from "@univo/ui";
import { useActionState } from "react";
import { earlyAccessAction, type ActionState } from "@/app/actions";
import type { Dictionary } from "@/i18n";
import styles from "./Form.module.css";
import { FormResult } from "./FormResult";
import { useFormFocus } from "./useFormFocus";

export function EarlyAccessForm({
  labels,
  locale,
  product,
  title,
  lead,
  staging,
}: {
  labels: Dictionary["forms"];
  locale: string;
  product: "retail" | "slot";
  title: string;
  lead: string;
  staging: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(earlyAccessAction, { status: "idle" });
  const root = useFormFocus(state);
  const done = state.status === "staged" || state.status === "sent";
  const values = state.status === "invalid" || state.status === "failed" ? state.values : {};
  const errors = state.status === "invalid" ? state.errors : {};
  const err = (k: string) => (errors[k] ? labels.errors[errors[k]] : undefined);

  return (
    <div ref={root} className={styles.card}>
      <div>
        <h2 id="early-access-title" className="t-h2">
          {title}
        </h2>
        <p className={styles.lead}>{lead}</p>
      </div>
      <FormResult state={state} labels={labels} />
      {done ? (
        <a className={styles.again} href="">
          {labels.again}
        </a>
      ) : (
        <form key={state.key} action={action} className={styles.form} aria-labelledby="early-access-title" noValidate>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="product" value={product} />
          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <TextField name="name" label={labels.name} autoComplete="name" required defaultValue={values.name} error={err("name")} />
          <TextField
            name="contact"
            label={labels.contact}
            hint={labels.contactHint}
            placeholder={labels.contactPlaceholder}
            autoComplete="on"
            spellCheck={false}
            autoCapitalize="off"
            required
            defaultValue={values.contact}
            error={err("contact")}
          />
          <TextField
            name="business"
            label={labels.business}
            hint={labels.businessHint}
            autoComplete="organization"
            required
            defaultValue={values.business}
            error={err("business")}
          />
          <TextArea
            name="comment"
            label={labels.comment}
            optionalLabel={labels.optional}
            placeholder={labels.commentPlaceholder}
            rows={3}
            defaultValue={values.comment}
            error={err("comment")}
          />
          <Checkbox name="consent" required error={err("consent")}>
            {labels.consent}
          </Checkbox>

          <div className={styles.footer}>
            <Button type="submit" icon="arrowRight" disabled={pending} aria-disabled={pending}>
              {pending ? labels.submitting : labels.submitEarlyAccess}
            </Button>
            {staging ? (
              <p className={styles.staging}>
                <Icon name="info" size={16} />
                {labels.stagingNote}
              </p>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
