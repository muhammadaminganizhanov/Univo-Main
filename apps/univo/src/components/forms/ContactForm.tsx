"use client";

import { INTERESTS } from "@univo/leads";
import { Button, Checkbox, ChoiceGroup, Icon, TextArea, TextField } from "@univo/ui";
import { useActionState } from "react";
import { contactAction, type ActionState } from "@/app/actions";
import type { Dictionary } from "@/i18n";
import styles from "./ContactForm.module.css";
import { FormResult } from "./FormResult";
import { useFormFocus } from "./useFormFocus";

// "Let UNIVO decide" first: not knowing the right direction is the default, not a fallback.
const ORDER = ["unsure", ...INTERESTS.filter((i) => i !== "unsure")] as const;

/**
 * The form is a route: entry ring → 01 task → 02 contact → 03 direction (optional) → submit.
 * Each group is a node on the line ([data-node]) for the motion pass.
 */
export function ContactForm({
  labels,
  groups,
  locale,
  defaultInterest,
  staging,
}: {
  labels: Dictionary["forms"];
  groups: Dictionary["contact"]["groups"];
  locale: string;
  defaultInterest: string;
  staging: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(contactAction, { status: "idle" });
  const root = useFormFocus(state);
  const done = state.status === "staged" || state.status === "sent";
  const values = state.status === "invalid" || state.status === "failed" ? state.values : {};
  const errors = state.status === "invalid" ? state.errors : {};
  const err = (k: string) => (errors[k] ? labels.errors[errors[k]] : undefined);

  return (
    <div ref={root} className={styles.root} data-done={done || undefined}>
      <span className={styles.entry} aria-hidden="true" data-node="entry" />
      <FormResult state={state} labels={labels} />
      {done ? (
        <a className={styles.again} href="">
          {labels.again}
        </a>
      ) : (
        <form key={state.key} action={action} className={styles.form} noValidate data-route="contact">
          <input type="hidden" name="locale" value={locale} />
          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div role="group" aria-labelledby="g-task" className={styles.group} data-node="task">
            <h2 id="g-task" className={styles.groupTitle}>
              <span className="t-meta">01</span> {groups.task}
            </h2>
            <TextArea
              name="message"
              label={labels.messageLong}
              placeholder={labels.messagePlaceholder}
              rows={4}
              required
              defaultValue={values.message}
              error={err("message")}
            />
          </div>

          <div role="group" aria-labelledby="g-contact" className={styles.group} data-node="contact">
            <h2 id="g-contact" className={styles.groupTitle}>
              <span className="t-meta">02</span> {groups.contact}
            </h2>
            <div className={styles.pair}>
              <TextField name="name" label={labels.name} autoComplete="name" required defaultValue={values.name} error={err("name")} />
              <TextField
                name="company"
                label={labels.company}
                optionalLabel={labels.optional}
                autoComplete="organization"
                defaultValue={values.company}
                error={err("company")}
              />
            </div>
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
          </div>

          <div role="group" aria-labelledby="g-direction" className={styles.group} data-node="direction">
            <h2 id="g-direction" className={styles.groupTitle}>
              <span className="t-meta">03</span> {groups.direction}{" "}
              <span className={styles.optional}>{labels.optional}</span>
            </h2>
            <p className={`t-meta ${styles.hint}`}>{groups.directionHint}</p>
            <ChoiceGroup
              name="interest"
              legend={labels.interest}
              defaultValue={values.interest ?? defaultInterest}
              options={ORDER.map((v) => ({ value: v, label: labels.interests[v], color: `var(--accent-${v === "unsure" ? "univo" : v})` }))}
              error={err("interest")}
              hideLegend
            />
          </div>

          <div className={styles.submit}>
            <Checkbox name="consent" required error={err("consent")}>
              {labels.consent}
            </Checkbox>
            {staging ? (
              <p className={styles.staging}>
                <Icon name="info" size={16} />
                {labels.stagingNote}
              </p>
            ) : null}
            {/* The route arrives here: the button is the last node. */}
            <Button type="submit" icon="arrowRight" disabled={pending} aria-disabled={pending}>
              {pending ? labels.submitting : labels.submitContact}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
