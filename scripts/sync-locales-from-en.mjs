#!/usr/bin/env node
/**
 * Merges en.json into every other locale file so no keys are missing.
 * Existing translations are preserved; only missing paths get English fallbacks.
 * Run: node scripts/sync-locales-from-en.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "..", "src", "locales");

function mergeEnIntoLocale(en, loc) {
  if (loc === undefined || loc === null) {
    return structuredClone(en);
  }
  if (Array.isArray(en)) {
    if (Array.isArray(loc) && loc.length > 0) {
      return loc.map((item, i) =>
        typeof item === "object" && item !== null && !Array.isArray(item) && en[i]
          ? mergeEnIntoLocale(en[i], item)
          : item
      );
    }
    return structuredClone(en);
  }
  if (typeof en !== "object" || en === null) {
    return loc;
  }
  const out = { ...loc };
  for (const key of Object.keys(en)) {
    if (!(key in out) || out[key] === undefined) {
      out[key] = structuredClone(en[key]);
    } else if (
      typeof en[key] === "object" &&
      en[key] !== null &&
      !Array.isArray(en[key]) &&
      typeof out[key] === "object" &&
      out[key] !== null &&
      !Array.isArray(out[key])
    ) {
      out[key] = mergeEnIntoLocale(en[key], out[key]);
    }
  }
  return out;
}

const en = JSON.parse(readFileSync(join(localesDir, "en.json"), "utf8"));
const files = readdirSync(localesDir).filter((f) => f.endsWith(".json") && f !== "en.json");

for (const f of files) {
  const path = join(localesDir, f);
  const locale = JSON.parse(readFileSync(path, "utf8"));
  const merged = mergeEnIntoLocale(en, locale);
  writeFileSync(path, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log("Updated:", f);
}
console.log("Done. Keys aligned with en.json for", files.length, "locales.");
