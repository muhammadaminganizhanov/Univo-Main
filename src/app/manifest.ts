import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE } from "@univo/config";
import { getDictionary } from "@/i18n";
import { localeHref } from "@/lib/routes";

export default function manifest(): MetadataRoute.Manifest {
  const { t } = getDictionary(DEFAULT_LOCALE);
  return {
    name: t.meta.home.title,
    short_name: "UNIVO",
    description: t.meta.home.description,
    start_url: localeHref(DEFAULT_LOCALE),
    display: "browser",
    background_color: "#f4f1ec",
    theme_color: "#f4f1ec",
    lang: DEFAULT_LOCALE,
    icons: [
      { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
      { src: "/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
