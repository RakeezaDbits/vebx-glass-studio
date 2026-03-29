/**
 * Makes dark/near-black pixels transparent in service hero PNGs (public/services/hero-png).
 * Run: node scripts/knockout-hero-png-bg.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "../public/services/hero-png");

/** Fully transparent if max RGB below this; feather between low and high */
const LOW = 38;
const HIGH = 88;

function processBuffer(px, len) {
  for (let i = 0; i < len; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const a = px[i + 3];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const sat = mx - mn;

    if (mx <= LOW) {
      px[i + 3] = 0;
      continue;
    }

    // Very dark but saturated (crimson line) — keep
    if (mx < HIGH && sat > 35) {
      px[i + 3] = a;
      continue;
    }

    if (mx < HIGH) {
      const t = (mx - LOW) / (HIGH - LOW);
      const smooth = t * t;
      px[i + 3] = Math.round(a * smooth);
    }
  }
}

async function run() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".png"));
  if (files.length === 0) {
    console.error("No PNG files in", DIR);
    process.exit(1);
  }

  for (const file of files) {
    const inputPath = path.join(DIR, file);
    const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const px = new Uint8ClampedArray(data);
    processBuffer(px, px.length);

    const outPath = inputPath + ".new.png";
    await sharp(Buffer.from(px), {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    fs.renameSync(outPath, inputPath);
    console.log("OK", file, `${info.width}x${info.height}`);
  }
  console.log("Done:", files.length, "files");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
