// Records a walkthrough video of the UNIVO master site (desktop + mobile).
// Usage: BASE_URL=http://localhost:3100 node scripts/record-walkthrough.mjs
// Output: qa-output/video/*.webm (raw), converted to mp4 afterwards.
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = new URL("../qa-output/video/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Smooth scroll through the whole page at a readable pace. */
async function tour(page, { step = 6, pause = 0 } = {}) {
  await page.evaluate(async ({ step, pause }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const max = document.documentElement.scrollHeight - innerHeight;
    for (let y = scrollY; y < max; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await sleep(16);
    }
    window.scrollTo({ top: max, behavior: "instant" });
    await sleep(pause);
  }, { step, pause });
}

async function record(name, viewport, script) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size: viewport },
  });
  const page = await context.newPage();
  await script(page);
  const video = page.video();
  await context.close();
  const file = `${OUT}${name}.webm`;
  await video.saveAs(file);
  await video.delete();
  await browser.close();
  console.warn(`recorded ${file}`);
}

await record("desktop", { width: 1440, height: 900 }, async (page) => {
  await page.goto(`${BASE}/ru`, { waitUntil: "networkidle" });
  await wait(2500); // hero: line draws, dot completes
  await tour(page, { step: 7, pause: 800 });

  await page.goto(`${BASE}/ru/ecosystem`, { waitUntil: "networkidle" });
  await wait(1500);
  await tour(page, { step: 8, pause: 800 });

  await page.goto(`${BASE}/ru/ecosystem/retail`, { waitUntil: "networkidle" });
  await wait(1500);
  await page.fill("#f-name", "Айбек");
  await page.fill("#f-contact", "+996 555 123 456");
  await page.fill("#f-business", "Магазин стройматериалов, 2 филиала");
  await page.check("#f-consent");
  await wait(600);
  await page.click("form button[type=submit]");
  await wait(2500); // honest staging result

  await page.goto(`${BASE}/ru/about`, { waitUntil: "networkidle" });
  await wait(1200);
  await tour(page, { step: 9, pause: 600 });

  await page.goto(`${BASE}/ru/contact?direction=tech`, { waitUntil: "networkidle" });
  await wait(2000);
  await page.click("form button[type=submit]"); // show validation
  await wait(2500);

  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  await wait(3000);
});

await record("mobile", { width: 390, height: 844 }, async (page) => {
  await page.goto(`${BASE}/ru`, { waitUntil: "networkidle" });
  await wait(2500);
  await page.click("button[aria-haspopup=dialog]");
  await wait(2500);
  await page.keyboard.press("Escape");
  await wait(800);
  await tour(page, { step: 8, pause: 800 });

  await page.goto(`${BASE}/ru/ecosystem/slot`, { waitUntil: "networkidle" });
  await wait(1500);
  await tour(page, { step: 8, pause: 1200 });

  await page.goto(`${BASE}/ky`, { waitUntil: "networkidle" });
  await wait(3000);
});
