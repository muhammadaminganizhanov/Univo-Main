import localFont from "next/font/local";

/**
 * Onest — the only brand typeface (Brand Book v1.2.2, p. 23). SIL OFL 1.1, see fonts/OFL.txt.
 * Variable file from master-assets/fonts/Onest.ttf, subset to Latin + Cyrillic incl. Kyrgyz
 * (Ө Ү Ң) and Uzbek Cyrillic, converted to WOFF2 (≈48 KB). Weights used: 400 · 500 · 600.
 */
export const onest = localFont({
  src: [{ path: "./fonts/Onest-Variable.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-onest",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
