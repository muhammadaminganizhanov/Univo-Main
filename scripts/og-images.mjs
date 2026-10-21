// Generates the per-page share images (OpenGraph / Twitter): public/og/<locale>/<page>.png, 1200×630.
// Each card is drawn inside the live page, so it uses the site's own Onest, logo and accents, and the
// headline is the page's own <h1> — the images always match the copy.
// Usage: run the site (pnpm dev or pnpm start), then: BASE_URL=http://localhost:3100 node scripts/og-images.mjs
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = new URL("../public/og/", import.meta.url);
const LOCALES = ["ru", "en", "ky"];
// page key → path, and the accent of "who speaks" on it
const PAGES = [
  { key: "home", path: "", accent: "--accent-univo" },
  { key: "ecosystem", path: "/ecosystem", accent: "--accent-univo" },
  { key: "about", path: "/about", accent: "--accent-univo" },
  { key: "contact", path: "/contact", accent: "--accent-univo" },
  { key: "retail", path: "/ecosystem/retail", accent: "--accent-retail", kicker: "UNIVO RETAIL" },
  { key: "slot", path: "/ecosystem/slot", accent: "--accent-slot", kicker: "UNIVO SLOT" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });

for (const locale of LOCALES) {
  fs.mkdirSync(new URL(`${locale}/`, OUT), { recursive: true });
  for (const p of PAGES) {
    await page.goto(`${BASE}/${locale}${p.path}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(({ accent, kicker: given }) => {
      const h1 = document.querySelector("h1");
      const clean = (text) => (text ?? "").replace(/\s+/g, " ").replace(/\.$/, "").trim();
      // a heading with its own kicker (Ecosystem: "UNIVO ecosystem" + statement) keeps the two apart
      const kickerEl = h1?.querySelector("[class*='kicker']");
      const kicker = given ?? (kickerEl ? clean(kickerEl.textContent) : null);
      const title = clean(h1 ? h1.innerText.replace(kickerEl?.innerText ?? "", "") : "UNIVO") || "UNIVO";
      const logo = document.querySelector("header svg")?.outerHTML ?? "";
      const font = getComputedStyle(document.body).fontFamily;
      document.documentElement.className = document.documentElement.className.replace(/\bmotion\b/, "");
      document.body.innerHTML = `
        <div id="og" style="position:fixed;inset:0;z-index:2147483647;background:var(--univo-brand-ink);color:#fff;
          font-family:${font.replace(/"/g, "'")};overflow:hidden">
          <div style="position:absolute;left:72px;top:64px;height:52px;display:flex;color:#fff">${logo}</div>
          <div style="position:absolute;left:72px;right:96px;bottom:176px">
            ${kicker ? `<p style="margin:0 0 18px;font-size:30px;font-weight:600;letter-spacing:0.01em;color:var(${accent})">${kicker}</p>` : ""}
            <h1 style="margin:0;font-size:${title.length > 48 ? 64 : 76}px;line-height:1.04;font-weight:600;letter-spacing:-0.025em;
              text-wrap:balance">${title}</h1>
          </div>
          <div style="position:absolute;left:0;bottom:120px;width:900px;height:14px;border-radius:0 7px 7px 0;background:#fff"></div>
          <div style="position:absolute;left:920px;bottom:116px;width:22px;height:22px;border-radius:50%;background:var(${accent})"></div>
        </div>`;
      const svg = document.querySelector("#og svg");
      if (svg) {
        svg.removeAttribute("class");
        svg.style.height = "52px";
        svg.style.width = "auto";
      }
    }, p);
    await page.screenshot({ path: new URL(`${locale}/${p.key}.png`, OUT).pathname });
    console.warn(`og/${locale}/${p.key}.png`);
  }
}
await browser.close();
