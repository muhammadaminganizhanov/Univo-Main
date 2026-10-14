"use client";

import type { Locale } from "@univo/config";
import { Logo } from "@univo/brand";
import { ButtonLink, GroupSwitcher, Icon, type GroupSwitcherItem } from "@univo/ui";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./MobileMenu.module.css";
import { NavLinks } from "./NavLinks";

/**
 * Native <dialog> + showModal(): focus is trapped, Esc closes, the page behind is inert.
 * Closes itself on navigation and returns focus to the trigger.
 */
export function MobileMenu({
  locale,
  nav,
  labels,
  contactHref,
  groupItems,
}: {
  locale: Locale;
  nav: { href: string; label: string }[];
  labels: {
    open: string;
    close: string;
    title: string;
    navLabel: string;
    locale: string;
    group: string;
    groupCurrent: string;
    cta: string;
  };
  contactHref: string;
  groupItems: GroupSwitcherItem[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = () => dialog.current?.close();

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      document.documentElement.style.removeProperty("overflow");
      trigger.current?.focus();
    };
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    document.documentElement.style.overflow = "hidden";
    dialog.current?.showModal();
  };

  return (
    <>
      <button ref={trigger} type="button" className={styles.trigger} onClick={open} aria-haspopup="dialog">
        {labels.open}
        <Icon name="menu" size={24} />
      </button>
      <dialog ref={dialog} className={styles.dialog} aria-label={labels.title}>
        <div className={styles.sheet}>
          <div className={`container ${styles.top}`}>
            <Logo title="UNIVO" className={styles.logo} />
            <button type="button" className={styles.trigger} onClick={close}>
              {labels.close}
              <Icon name="close" size={24} />
            </button>
          </div>
          <div className={`container ${styles.body}`}>
            <nav aria-label={labels.navLabel} className={styles.nav}>
              <NavLinks items={nav} linkClassName={styles.navLink} onNavigate={close} />
            </nav>
            <div className={styles.block}>
              <p className="t-label">{labels.group}</p>
              <GroupSwitcher variant="inline" label={labels.group} items={groupItems} currentLabel={labels.groupCurrent} />
            </div>
            <div className={styles.block}>
              <p className="t-label">{labels.locale}</p>
              <LocaleSwitcher locale={locale} label={labels.locale} size="lg" />
            </div>
          </div>
          <div className={`container ${styles.bottom}`}>
            <ButtonLink href={contactHref} block onClick={close}>
              {labels.cta}
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
