import { isLocale, negotiateLocale } from "@univo/config";
import { NextResponse, type NextRequest } from "next/server";

/** Every page lives under /ru, /en or /ky. Anything else is redirected to the visitor's locale. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();
  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (icons, robots.txt, sitemap.xml …).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
