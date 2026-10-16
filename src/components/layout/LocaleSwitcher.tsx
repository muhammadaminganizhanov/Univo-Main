"use client";

import { LOCALES, LOCALE_META, type Locale } from "@univo/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/routes";
import styles from "./LocaleSwitcher.module.css";

/** Keeps the visitor on the equivalent page: /ru/about → /en/about. */
export function LocaleSwitcher({
  locale,
  label,
  size = "md",
  names = "short",
  className,
  linkClassName,
}: {
  locale: Locale;
  label: string;
  size?: "md" | "lg";
  /** "native" shows full self-names (footer). */
  names?: "short" | "native";
  className?: string;
  linkClassName?: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  return (
    <nav aria-label={label}>
      <ul role="list" className={className ?? `${styles.list} ${size === "lg" ? styles.large : ""}`}>
        {LOCALES.map((l) => {
          const meta = LOCALE_META[l];
          return (
            <li key={l}>
              <Link
                href={switchLocalePath(pathname, l)}
                className={linkClassName ?? styles.link}
                hrefLang={meta.htmlLang}
                lang={meta.htmlLang}
                aria-current={l === locale ? "true" : undefined}
                title={names === "short" ? meta.nativeName : undefined}
              >
                {names === "native" ? (
                  meta.nativeName
                ) : (
                  <>
                    <span aria-hidden="true">{meta.shortName}</span>
                    <span className="visually-hidden">{meta.nativeName}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
