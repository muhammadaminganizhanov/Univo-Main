// Copies the approved master icons (Brand Book v1.2.2 · master-assets/icon) into every app's /public.
import fs from "node:fs";

const src = new URL("../assets/icons/", import.meta.url);
const apps = new URL("../../../apps/", import.meta.url);
const files = ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "icon-maskable-512.png", "og-image.png"];

for (const app of fs.readdirSync(apps)) {
  const pub = new URL(`${app}/public/`, apps);
  fs.mkdirSync(pub, { recursive: true });
  for (const file of files) fs.copyFileSync(new URL(file, src), new URL(file, pub));
}
console.warn("icons synced");
