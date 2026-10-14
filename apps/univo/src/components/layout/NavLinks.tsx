"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Nav list that marks the current section with aria-current (also for nested routes). */
export function NavLinks({
  items,
  listClassName,
  linkClassName,
  onNavigate,
}: {
  items: { href: string; label: string }[];
  listClassName?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isCurrent = (href: string) => {
    const depth = href.split("/").filter(Boolean).length;
    if (depth === 1) return pathname === href; // locale root: exact match only
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  return (
    <ul role="list" className={listClassName}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={linkClassName}
            aria-current={isCurrent(item.href) ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
