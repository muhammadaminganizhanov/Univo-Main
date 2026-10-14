import { LOCALES, LOCALE_META, isLocale } from "@univo/config";
import { onest } from "@univo/brand/font";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/favicon.svg", type: "image/svg+xml" }] },
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={LOCALE_META[locale].htmlLang} className={onest.variable}>
      <body>{children}</body>
    </html>
  );
}
