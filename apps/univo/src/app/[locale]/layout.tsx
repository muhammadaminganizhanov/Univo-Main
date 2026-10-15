import { LOCALES, LOCALE_META } from "@univo/config";
import { onest } from "@univo/brand/font";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionHeadScript, MotionRoot } from "@/components/layout/MotionRoot";
import { groupSwitcherItems } from "@/lib/group";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { siteOrigin } from "@/lib/seo";
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
  const mainLang = ctx.contentLang === htmlLang ? undefined : ctx.contentLang;

  return (
    <html lang={htmlLang} className={onest.variable} suppressHydrationWarning>
      <head>
        <MotionHeadScript />
      </head>
      <body>
        <MotionRoot />
        <a href="#main" className="skip-link" lang={mainLang}>
          {ctx.t.common.skipToContent}
        </a>
        {ctx.fallbackNotice ? (
          <div className="locale-notice" role="note">
            <p className="container">{ctx.fallbackNotice}</p>
          </div>
        ) : null}
        <Header ctx={ctx} groupItems={groupSwitcherItems(ctx.locale, ctx.t)} />
        <main id="main" tabIndex={-1} lang={mainLang}>
          {children}
        </main>
        <Footer ctx={ctx} />
      </body>
    </html>
  );
}
