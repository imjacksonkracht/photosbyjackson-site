// Builds the favicons from the JK mark used on the previous site.
//   node scripts/brand-assets.mjs
// (Share images are made by scripts/process-photos.mjs.)

import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const INK = { r: 11, g: 11, b: 12, alpha: 1 };

async function icon(size, out, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(path.join(ROOT, "brand", "jk-mark.png"))
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(path.join(ROOT, "app", out));
}

await icon(512, "icon.png", 0.14);
await icon(180, "apple-icon.png", 0.16);
console.log("icon.png, apple-icon.png written");
