import type { CSSProperties, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";
import { Icon } from "./Icon";

type Base = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  optionalLabel?: string;
};

const ids = (name: string) => ({ id: `f-${name}`, err: `f-${name}-error`, hint: `f-${name}-hint` });

function describedBy(name: string, error?: string, hint?: string) {
  const i = ids(name);
  return [hint && i.hint, error && i.err].filter(Boolean).join(" ") || undefined;
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.error}>
      <Icon name="error" size={16} />
      <span>{children}</span>
    </p>
  );
}

function Label({ name, label, optionalLabel }: Pick<Base, "name" | "label" | "optionalLabel">) {
  return (
    <label htmlFor={ids(name).id} className={styles.label}>
      <span>{label}</span>
      {optionalLabel ? <span className={styles.optional}>{optionalLabel}</span> : null}
    </label>
  );
}

export function TextField({
  name,
  label,
  error,
  hint,
  optionalLabel,
  ...rest
}: Base & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id">) {
  const i = ids(name);
  return (
    <div className={styles.field}>
      <Label name={name} label={label} optionalLabel={optionalLabel} />
      {hint ? (
        <p id={i.hint} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      <input
        id={i.id}
        name={name}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        {...rest}
      />
      {error ? <FieldError id={i.err}>{error}</FieldError> : null}
    </div>
  );
}

export function TextArea({
  name,
  label,
  error,
  hint,
  optionalLabel,
  ...rest
}: Base & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "id">) {
  const i = ids(name);
  return (
    <div className={styles.field}>
      <Label name={name} label={label} optionalLabel={optionalLabel} />
      {hint ? (
        <p id={i.hint} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      <textarea
        id={i.id}
        name={name}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        {...rest}
      />
      {error ? <FieldError id={i.err}>{error}</FieldError> : null}
    </div>
  );
}

export function ChoiceGroup({
  name,
  legend,
  options,
  defaultValue,
  error,
  hideLegend,
}: {
  name: string;
  legend: string;
  /** Keep the legend for assistive tech when a visible heading already names the group. */
  hideLegend?: boolean;
  /** `color`: identity dot colour for this option (ring at rest, filled when chosen). */
  options: { value: string; label: string; color?: string }[];
  defaultValue?: string;
  error?: string;
}) {
  const i = ids(name);
  return (
    <fieldset className={styles.fieldset} aria-describedby={error ? i.err : undefined}>
      <legend className={hideLegend ? "visually-hidden" : styles.legend}>{legend}</legend>
      <div className={styles.choices}>
        {options.map((o) => (
          <label key={o.value} className={styles.choice}>
            <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} />
            <span className={styles.choiceLabel}>
              <span
                className={styles.mark}
                aria-hidden="true"
                style={o.color ? ({ "--mark": o.color } as CSSProperties) : undefined}
              />
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {error ? <FieldError id={i.err}>{error}</FieldError> : null}
    </fieldset>
  );
}

export function Checkbox({
  name,
  children,
  error,
  ...rest
}: { name: string; children: ReactNode; error?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type">) {
  const i = ids(name);
  return (
    <div className={styles.field}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          id={i.id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? i.err : undefined}
          {...rest}
        />
        <span>{children}</span>
      </label>
      {error ? <FieldError id={i.err}>{error}</FieldError> : null}
    </div>
  );
}
