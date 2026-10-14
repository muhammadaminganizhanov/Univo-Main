import type { MetadataRoute } from "next";
import { isIndexable } from "@univo/config/server";
import { siteOrigin } from "@/lib/seo";

/** Staging (default): disallow everything. Production: allow + sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${siteOrigin()}/sitemap.xml`, host: siteOrigin() };
}
