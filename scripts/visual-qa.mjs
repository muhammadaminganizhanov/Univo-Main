// Visual + technical QA sweep for the UNIVO master site.
// Usage: BASE_URL=http://localhost:3100 node scripts/visual-qa.mjs [--shots] [--widths=390,1440]
// Writes screenshots and qa-output/report.json. Exit code 1 when a check fails.
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const args = process.argv.slice(2);
const SHOTS = args.includes("--shots");
const widthsArg = args.find((a) => a.startsWith("--widths="));
const WIDTHS = widthsArg
  ? widthsArg.split("=")[1].split(",").map(Number)
  : [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1728, 1920];
const PAGES = ["/ru", "/ru/ecosystem", "/ru/about", "/ru/contact", "/ru/ecosystem/retail", "/ru/ecosystem/slot", "/en", "/ky"];
const OUT = new URL("../qa-output/", import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];
let failed = 0;

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  for (const path of PAGES) {
    errors.length = 0;
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth > vw;
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed";
        })
        .filter((el) => !el.closest("dialog:not([open]), .visually-hidden, [aria-hidden='true'][class*='honeypot']"))
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`);
      const smallTargets = [...document.querySelectorAll("a[href], button, input, textarea, select, [role='button']")]
        .filter((el) => !el.closest("dialog:not([open])") && !el.closest("[class*='honeypot']"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false;
          if (el.matches("input[type='radio']")) return false; // covered by its capsule label
          const inline = getComputedStyle(el).display === "inline" && el.closest("p");
          return !inline && (r.height < 24 || r.width < 24);
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}:${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}`);
      const h1 = document.querySelectorAll("h1").length;
      const levels = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => Number(h.tagName[1]));
      const skipped = levels.some((l, i) => i > 0 && l - levels[i - 1] > 1);
      const imgsNoAlt = [...document.querySelectorAll("img:not([alt])")].length;
      const svgNoName = [...document.querySelectorAll("svg[role='img']:not([aria-label])")].length;
      const unlabeled = [...document.querySelectorAll("input:not([type=hidden]), textarea, select")]
        .filter((el) => !el.closest("[class*='honeypot']"))
        .filter((el) => !(el.labels && el.labels.length) && !el.getAttribute("aria-label")).length;
      const dots = document.querySelectorAll(".brand-dot").length;
      const todoVisible = /TODO|lorem|placeholder text/i.test(document.body.innerText);
      return { overflow, wide, smallTargets, h1, skipped, imgsNoAlt, svgNoName, unlabeled, dots, todoVisible };
    });
    const problems = [];
    if (result.overflow) problems.push(`horizontal overflow: ${result.wide.join(", ")}`);
    if (result.h1 !== 1) problems.push(`h1 count ${result.h1}`);
    if (result.skipped) problems.push("heading level skipped");
    if (result.imgsNoAlt) problems.push(`${result.imgsNoAlt} img without alt`);
    if (result.svgNoName) problems.push(`${result.svgNoName} svg role=img without name`);
    if (result.unlabeled) problems.push(`${result.unlabeled} unlabeled fields`);
    if (result.dots > 1) problems.push(`${result.dots} brand dots (max 1)`);
    if (result.todoVisible) problems.push("TODO / placeholder visible");
    if (result.smallTargets.length) problems.push(`small targets: ${result.smallTargets.join(", ")}`);
    if (errors.length) problems.push(`console: ${errors.slice(0, 3).join(" | ")}`);
    if (problems.length) failed++;
    report.push({ width, path, problems });
    if (SHOTS) {
      const name = `${path.replace(/\//g, "_").replace(/^_/, "")}-${width}.png`;
      await page.screenshot({ path: new URL(name, OUT).pathname, fullPage: true });
    }
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(new URL("report.json", OUT), JSON.stringify(report, null, 2));
for (const r of report.filter((x) => x.problems.length)) console.warn(`✗ ${r.width} ${r.path}\n   ${r.problems.join("\n   ")}`);
console.warn(`${report.length - failed}/${report.length} page × width combinations clean`);
process.exit(failed ? 1 : 0);
