import { Fragment, type ReactNode } from "react";

/**
 * Break a heading at sentence boundaries ("Разные дела. Один стандарт работы" → 2 lines), whatever
 * the language. Each line is its own reveal mask for the motion pass. No per-locale hardcoding.
 */
export function Lines({ text, after }: { text: string; /** Rendered at the end of the last line (e.g. the brand dot). */ after?: ReactNode }) {
  const parts = text.split(/(?<=[.!?])\s+/);
  return (
    <>
      {parts.map((line, i) => (
        <Fragment key={i}>
          <span className="reveal" data-reveal="">
            <span className="reveal__inner">
              {line}
              {i === parts.length - 1 ? after : null}
            </span>
          </span>
          {i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
