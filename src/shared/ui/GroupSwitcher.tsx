"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./GroupSwitcher.module.css";
import { Icon } from "./Icon";

export interface GroupSwitcherItem {
  id: string;
  name: string;
  /** null → not linkable yet (rendered as text with `note`). */
  href: string | null;
  note?: string;
  current?: boolean;
  external?: boolean;
}

function Items({ items, currentLabel }: { items: GroupSwitcherItem[]; currentLabel: string }) {
  return (
    <ul className={styles.list} role="list">
      {items.map((item) => {
        const meta = item.current ? (
          <span className={styles.meta}>
            <Icon name="check" size={16} />
            {currentLabel}
          </span>
        ) : item.note ? (
          <span className={styles.meta}>{item.note}</span>
        ) : item.external ? (
          <Icon name="arrowUpRight" size={16} />
        ) : null;
        return (
          <li key={item.id}>
            {item.href && !item.current ? (
              <a className={styles.item} href={item.href}>
                <span>{item.name}</span>
                {meta}
              </a>
            ) : (
              <span className={styles.item} aria-current={item.current ? "page" : undefined}>
                <span>{item.name}</span>
                {meta}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Group / ecosystem switcher, shared by every UNIVO site.
 * - `disclosure`: a quiet button that opens the list (Esc / outside click closes, focus returns).
 * - `inline`: the plain list (mobile menu, footer).
 */
export function GroupSwitcher({
  label,
  heading,
  items,
  currentLabel,
  variant = "disclosure",
  placement = "above",
}: {
  label: string;
  heading?: string;
  items: GroupSwitcherItem[];
  currentLabel: string;
  variant?: "disclosure" | "inline";
  placement?: "above" | "below";
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <nav aria-label={label} className={`${styles.root} ${styles.inline}`}>
        <Items items={items} currentLabel={currentLabel} />
      </nav>
    );
  }

  return (
    <div ref={root} className={`${styles.root} ${placement === "below" ? styles.below : ""}`}>
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <Icon name="chevronDown" size={16} />
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        {heading ? <p className={`t-label ${styles.heading}`}>{heading}</p> : null}
        <Items items={items} currentLabel={currentLabel} />
      </div>
    </div>
  );
}
