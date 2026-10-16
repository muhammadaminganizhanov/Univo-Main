import { Notice } from "@univo/ui";
import type { ActionState } from "@/app/actions";
import type { Dictionary } from "@/i18n";

/** Honest outcome. "staged" never claims delivery. */
export function FormResult({ state, labels }: { state: ActionState; labels: Dictionary["forms"] }) {
  if (state.status === "staged")
    return (
      <div data-result tabIndex={-1}>
        <Notice tone="info" title={labels.staged.title} role="status">
          {labels.staged.body}
        </Notice>
      </div>
    );
  if (state.status === "sent")
    return (
      <div data-result tabIndex={-1}>
        <Notice tone="success" title={labels.sent.title} role="status">
          {labels.sent.body}
        </Notice>
      </div>
    );
  if (state.status === "failed")
    return (
      <div data-result tabIndex={-1}>
        <Notice tone="error" title={labels.failed.title} role="alert">
          {labels.failed.body}
        </Notice>
      </div>
    );
  if (state.status === "invalid")
    return <Notice tone="error" title={labels.invalidSummary} role="alert" />;
  return null;
}
