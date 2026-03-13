import express from "express";
import db from "../config/db.js";
import { generateImage } from "../utils/gemini-image.js";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = join(__dirname, "..", "generated");
const DAILY_CREDITS = parseInt(process.env.AI_CHAT_DAILY_CREDITS || "5", 10);
const REF_TTL_DAYS = 7;

// Ensure generated dir exists
try {
  if (!existsSync(GENERATED_DIR)) {
    const { mkdirSync } = await import("fs");
    mkdirSync(GENERATED_DIR, { recursive: true });
  }
} catch (_) {}

function getRef() {
  return crypto.randomBytes(16).toString("hex");
}

function getTodayUTC() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** Get credits remaining for device (today) */
async function getCreditsForDevice(deviceId) {
  if (!deviceId || deviceId.length < 8) return { remaining: 0, limit: DAILY_CREDITS };
  const today = getTodayUTC();
  try {
    const [rows] = await db.execute(
      "SELECT COALESCE(SUM(credits_used), 0) AS used FROM device_credits WHERE device_id = ? AND period_start = ?",
      [deviceId.slice(0, 64), today]
    );
    const used = Number(rows[0]?.used ?? 0);
    const remaining = Math.max(0, DAILY_CREDITS - used);
    return { remaining, limit: DAILY_CREDITS };
  } catch (_) {
    return { remaining: DAILY_CREDITS, limit: DAILY_CREDITS };
  }
}

/** Consume one credit for device */
async function consumeCredit(deviceId) {
  const today = getTodayUTC();
  const id = deviceId?.slice(0, 64) || "unknown";
  await db.execute(
    "INSERT INTO device_credits (device_id, period_start, credits_used) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE credits_used = credits_used + 1",
    [id, today]
  );
}

const router = express.Router();

/** GET /api/chat/credits?deviceId=xxx - credits left for this device */
router.get("/credits", async (req, res) => {
  try {
    const { deviceId } = req.query;
    const cred = await getCreditsForDevice(deviceId);
    res.json(cred);
  } catch (err) {
    console.error(err);
    res.status(500).json({ remaining: 0, limit: DAILY_CREDITS });
  }
});

/** POST /api/chat/generate-image - generate image from prompt (Nano Banana), device-based credits */
router.post("/generate-image", async (req, res) => {
  try {
    const { prompt, deviceId } = req.body || {};
    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const cred = await getCreditsForDevice(deviceId);
    if (cred.remaining <= 0) {
      return res.status(429).json({
        error: "No credits left",
        remaining: 0,
        limit: cred.limit,
      });
    }

    const imageBuffer = await generateImage(prompt.trim());
    const ref = getRef();
    const filename = `${ref}.png`;
    const filepath = join(GENERATED_DIR, filename);
    writeFileSync(filepath, imageBuffer);

    await db.execute(
      "INSERT INTO ai_generated_images (ref, file_path, device_id, created_at) VALUES (?, ?, ?, NOW())",
      [ref, filename, (deviceId || "").slice(0, 64)]
    );
    await consumeCredit(deviceId);

    const newCred = await getCreditsForDevice(deviceId);
    res.json({
      ref,
      creditsLeft: newCred.remaining,
      limit: newCred.limit,
    });
  } catch (err) {
    console.error("Generate image error:", err.message);
    res.status(500).json({
      error: err.message || "Image generation failed",
    });
  }
});

/** GET /api/chat/generated-image/:ref - serve image (protected: no download, inline only, optional token) */
router.get("/generated-image/:ref", (req, res) => {
  const { ref } = req.params;
  if (!ref || !/^[a-f0-9]{32}$/.test(ref)) {
    return res.status(404).end();
  }
  const filepath = join(GENERATED_DIR, `${ref}.png`);
  if (!existsSync(filepath)) {
    return res.status(404).end();
  }
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "inline"); // do not offer as download
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    const buf = readFileSync(filepath);
    res.send(buf);
  } catch (_) {
    res.status(404).end();
  }
});

export default router;
