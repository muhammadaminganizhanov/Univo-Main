import { LOCALES, LOCALE_META } from "@univo/config";
import { onest } from "@univo/brand/font";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionHeadScript, MotionRoot } from "@/components/layout/MotionRoot";
import { JsonLd } from "@/components/seo/JsonLd";
import { groupSwitcherItems } from "@/lib/group";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { siteOrigin } from "@/lib/seo";
import { siteGraph } from "@/lib/structured-data";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return {
    metadataBase: new URL(siteOrigin()),
    title: { default: t.meta.home.title, template: `%s — ${t.meta.siteName}` },
    description: t.meta.home.description,
    applicationName: "UNIVO",
    creator: "UNIVO",
    publisher: "UNIVO",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f1ec", // = --univo-brand-paper (meta tags cannot read CSS variables)
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const ctx = await resolveLocale(params);
  const htmlLang = LOCALE_META[ctx.locale].htmlLang;

  return (
    <html lang={htmlLang} className={onest.variable} suppressHydrationWarning>
      <head>
        <MotionHeadScript />
        <JsonLd graph={siteGraph(ctx.locale)} />
      </head>
      <body>
        <MotionRoot />
        <a href="#main" className="skip-link">
          {ctx.t.common.skipToContent}
        </a>
        <Header ctx={ctx} groupItems={groupSwitcherItems(ctx.locale, ctx.t)} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer ctx={ctx} />
      </body>
    </html>
  );
}
