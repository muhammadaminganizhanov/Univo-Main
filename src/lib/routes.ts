import type { Locale } from "@univo/config";

/** Route keys of the master site. Paths are identical across locales (/ru/about, /en/about …). */
export const ROUTES = {
  home: "/",
  ecosystem: "/ecosystem",
  about: "/about",
  contact: "/contact",
} as const;

export type RouteKey = keyof typeof ROUTES;

export function localeHref(locale: Locale, path: string = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Same page in another locale: swap the first path segment. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}
