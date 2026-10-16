// Copies the approved master icons (Brand Book v1.2.2 · master-assets/icon) into /public.
import fs from "node:fs";

const src = new URL("../../assets/brand/icons/", import.meta.url);
const pub = new URL("../../public/", import.meta.url);
const files = ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "icon-maskable-512.png", "og-image.png"];

fs.mkdirSync(pub, { recursive: true });
for (const file of files) fs.copyFileSync(new URL(file, src), new URL(file, pub));
console.warn("icons synced");
