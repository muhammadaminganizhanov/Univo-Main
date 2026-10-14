import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

/**
 * `external` = another app (TECH / PRODUCTION are separate Vercel services on the same domain):
 * a plain document navigation. Everything else uses the client router.
 */
export function AppLink({
  href,
  external,
  ...rest
}: { href: string; external?: boolean } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return external ? <a href={href} {...rest} /> : <Link href={href} {...rest} />;
}
