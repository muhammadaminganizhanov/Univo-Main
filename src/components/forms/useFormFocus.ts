"use client";

import { useEffect, useRef } from "react";
import type { ActionState } from "@/app/actions";

/** After a response: move focus to the first invalid field, or to the result message. */
export function useFormFocus(state: ActionState) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!state.key || !root.current) return;
    if (state.status === "invalid") {
      root.current.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[aria-describedby] input')?.focus();
    } else {
      root.current.querySelector<HTMLElement>("[data-result]")?.focus();
    }
  }, [state]);
  return root;
}
