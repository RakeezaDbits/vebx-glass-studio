#!/usr/bin/env node
/**
 * Fills locale JSON strings that still match English (en.json) using free MT endpoints (no API key).
 * Preserves {{interpolation}} tokens. Skips URLs, realtimeIntroInstructions, and tiny strings.
 *
 * Usage:
 *   node scripts/lingva-fill-untranslated.mjs              # all locales except en
 *   node scripts/lingva-fill-untranslated.mjs --lang=ar   # Arabic only
 *   node scripts/lingva-fill-untranslated.mjs --lang=ar --max=80
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "src", "locales");
const GOOGLE_GTX = "https://translate.googleapis.com/translate_a/single";
const LINGVA = "https://lingva.ml/api/v1";

/** File slug → Lingva Google target code */
const LINGVA_TARGET = {
  ar: "ar",
  ur: "ur",
  de: "de",
  fr: "fr",
  es: "es",
  pt: "pt",
  hi: "hi",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  tr: "tr",
  ru: "ru",
  it: "it",
  nl: "nl",
  pl: "pl",
  sv: "sv",
  da: "da",
  no: "no",
  fi: "fi",
  th: "th",
  vi: "vi",
  id: "id",
  ms: "ms",
  he: "iw",
  fa: "fa",
  ro: "ro",
  hu: "hu",
  cs: "cs",
  el: "el",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function shouldSkipPath(p) {
  if (p.includes("realtimeIntroInstructions")) return true;
  return false;
}

function shouldSkipValue(s) {
  if (!s || typeof s !== "string") return true;
  if (s.length < 3) return true;
  if (/^https?:\/\//i.test(s) || /^mailto:/i.test(s)) return true;
  return false;
}

function protectInterpolation(s) {
  const slots = [];
  const masked = s.replace(/\{\{[^}]+\}\}/g, (m) => {
    slots.push(m);
    return `__PH_${slots.length - 1}__`;
  });
  return { masked, slots };
}

function restoreInterpolation(s, slots) {
  let out = s;
  for (let i = 0; i < slots.length; i++) {
    out = out.split(`__PH_${i}__`).join(slots[i]);
  }
  return out;
}

async function lingvaOnce(text, target) {
  const tl = LINGVA_TARGET[target];
  if (!tl) throw new Error(`No Lingva code for ${target}`);
  const url = `${LINGVA}/en/${tl}/${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const j = await res.json();
  if (j.error) throw new Error(j.error);
  return j.translation ?? j.translatedText ?? "";
}

async function googleOnce(text, target) {
  const tl = LINGVA_TARGET[target];
  if (!tl) throw new Error(`No target code for ${target}`);
  const url = `${GOOGLE_GTX}?client=gtx&sl=en&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Unexpected Google response");
  return data[0].map((item) => (Array.isArray(item) ? item[0] : "")).join("");
}

/** URL length limit — chunk long strings */
async function translateString(text, target, delayMs) {
  const { masked, slots } = protectInterpolation(text);
  const maxChunk = 380;
  const parts = [];
  let rest = masked;
  while (rest.length) {
    let chunk = rest.slice(0, maxChunk);
    if (rest.length > maxChunk) {
      const cut = chunk.lastIndexOf(" ");
      if (cut > 120) chunk = chunk.slice(0, cut);
    }
    let tr = "";
    try {
      tr = await googleOnce(chunk, target);
    } catch {
      // Fallback endpoint when Google throttles.
      tr = await lingvaOnce(chunk, target);
    }
    parts.push(tr);
    rest = rest.slice(chunk.length).trimStart();
    await sleep(delayMs);
  }
  return restoreInterpolation(parts.join(""), slots);
}

function collectEqualStrings(enNode, locNode, path, out) {
  if (shouldSkipPath(path)) return;
  if (typeof enNode === "string" && typeof locNode === "string") {
    if (enNode === locNode && !shouldSkipValue(enNode)) out.push({ path, value: enNode });
    return;
  }
  if (Array.isArray(enNode) && Array.isArray(locNode)) {
    enNode.forEach((v, i) => {
      if (locNode[i] !== undefined) collectEqualStrings(v, locNode[i], `${path}[${i}]`, out);
    });
    return;
  }
  if (
    enNode &&
    typeof enNode === "object" &&
    !Array.isArray(enNode) &&
    locNode &&
    typeof locNode === "object" &&
    !Array.isArray(locNode)
  ) {
    for (const k of Object.keys(enNode)) {
      if (locNode[k] === undefined) continue;
      const next = path ? `${path}.${k}` : k;
      collectEqualStrings(enNode[k], locNode[k], next, out);
    }
  }
}

function parsePath(pathStr) {
  return pathStr
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .map((p) => (/^\d+$/.test(p) ? Number(p) : p));
}

function setByPath(root, pathStr, value) {
  const segs = parsePath(pathStr);
  let cur = root;
  for (let i = 0; i < segs.length - 1; i++) {
    cur = cur[segs[i]];
  }
  cur[segs[segs.length - 1]] = value;
}

const args = process.argv.slice(2);
const langArg = args.find((a) => a.startsWith("--lang="))?.split("=")[1];
const maxArg = args.find((a) => a.startsWith("--max="))?.split("=")[1];
const maxJobs = maxArg ? Number(maxArg) : Infinity;
const delayMs = Number(args.find((a) => a.startsWith("--delay="))?.split("=")[1] || "450");

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const files = fs
  .readdirSync(localesDir)
  .filter((f) => f.endsWith(".json") && f !== "en.json")
  .map((f) => f.replace(".json", ""))
  .filter((code) => !langArg || code === langArg);

if (!files.length) {
  console.error("No locale files to process.");
  process.exit(1);
}

for (const lang of files) {
  if (!LINGVA_TARGET[lang]) {
    console.warn("Skip unknown Lingva target:", lang);
    continue;
  }
  const fp = path.join(localesDir, `${lang}.json`);
  const loc = JSON.parse(fs.readFileSync(fp, "utf8"));
  const jobs = [];
  collectEqualStrings(en, loc, "", jobs);
  const slice = jobs.slice(0, maxJobs);
  console.log(`\n[${lang}] ${slice.length} / ${jobs.length} strings to translate (delay ${delayMs}ms)`);
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < slice.length; i++) {
    const { path: p, value } = slice[i];
    try {
      const tr = await translateString(value, lang, delayMs);
      if (!tr || tr === value) {
        console.warn(`  [${i + 1}] unchanged/skip: ${p.slice(0, 60)}…`);
      } else {
        setByPath(loc, p, tr);
        ok++;
      }
    } catch (e) {
      console.error(`  FAIL ${p}:`, e.message);
      fail++;
    }
    if ((i + 1) % 25 === 0) console.log(`  … ${i + 1}/${slice.length}`);
  }
  fs.writeFileSync(fp, JSON.stringify(loc, null, 2) + "\n", "utf8");
  console.log(`[${lang}] done: ok=${ok} fail=${fail}`);
}
