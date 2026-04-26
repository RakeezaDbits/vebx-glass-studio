#!/usr/bin/env node
/**
 * After `vite build`, merges the public Node API origin into dist/api-config.json
 * so the browser can reach /api even when import.meta.env was not inlined as expected.
 *
 * Reads (first hit wins): process.env.VITE_API_URL, process.env.API_PUBLIC_ORIGIN,
 * then root .env keys VITE_API_URL / API_PUBLIC_ORIGIN.
 *
 * Usage: VITE_API_URL=https://api.example.com npm run build
 * Never include a trailing /api (wrong: https://x.com/api).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = resolve(rootDir, "dist");
const distConfig = resolve(distDir, "api-config.json");
const publicConfig = resolve(rootDir, "public", "api-config.json");

function readRootDotEnv() {
  const p = resolve(rootDir, ".env");
  if (!existsSync(p)) return {};
  const out = {};
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function normalizeBase(raw) {
  let b = String(raw ?? "")
    .trim()
    .replace(/\/+$/, "");
  if (!b) return "";
  const lower = b.toLowerCase();
  if (lower.endsWith("/api")) {
    b = b.replace(/\/api$/i, "");
    console.warn("[sync-api-config] Removed trailing /api from base URL (should be origin only).");
  }
  return b.replace(/\/+$/, "");
}

const fileEnv = readRootDotEnv();
const fromEnv = normalizeBase(
  process.env.VITE_API_URL || process.env.API_PUBLIC_ORIGIN || fileEnv.VITE_API_URL || fileEnv.API_PUBLIC_ORIGIN
);

if (!fromEnv) {
  console.log(
    "[sync-api-config] No VITE_API_URL / API_PUBLIC_ORIGIN — dist/api-config.json not overwritten.\n" +
      "  Fix 404 analytics: set VITE_API_URL in root .env (Node public origin, no /api), then npm run build.\n" +
      "  Or proxy https://your-domain/api → Node and keep VITE empty."
  );
  process.exit(0);
}

if (!existsSync(distDir)) {
  console.error("[sync-api-config] dist/ missing — run vite build first.");
  process.exit(1);
}

let base = { apiBase: "", setupHint: "" };
if (existsSync(distConfig)) {
  try {
    base = JSON.parse(readFileSync(distConfig, "utf8"));
  } catch {
    /* use defaults */
  }
} else if (existsSync(publicConfig)) {
  try {
    base = JSON.parse(readFileSync(publicConfig, "utf8"));
  } catch {
    /* use defaults */
  }
}

const next = {
  ...base,
  apiBase: fromEnv,
  setupHint:
    typeof base.setupHint === "string" && base.setupHint.trim()
      ? base.setupHint
      : "apiBase was set at build from VITE_API_URL. To change it, edit root .env and rebuild.",
};

mkdirSync(dirname(distConfig), { recursive: true });
writeFileSync(distConfig, `${JSON.stringify(next, null, 2)}\n`, "utf8");
console.log(`[sync-api-config] Wrote ${distConfig} with apiBase=${fromEnv}`);
