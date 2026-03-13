import express from "express";
import db from "../config/db.js";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "generated");

const DAILY_CREDITS = parseInt(process.env.AI_CHAT_DAILY_CREDITS || "5", 10);

function ensureGeneratedDir() {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

/** GET /api/chat/credits?deviceId=xxx — remaining credits for this device today */
router.get("/credits", async (req, res) => {
  try {
    const deviceId = (req.query.deviceId || "").toString().slice(0, 64);
    if (!deviceId) {
      return res.json({ remaining: 0, limit: DAILY_CREDITS });
    }
    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await db.execute(
      "SELECT credits_used FROM device_credits WHERE device_id = ? AND period_start = ?",
      [deviceId, today]
    );
    const used = rows[0] ? rows[0].credits_used : 0;
    if (rows.length === 0) {
      await db.execute(
        "INSERT INTO device_credits (device_id, period_start, credits_used) VALUES (?, ?, 0)",
        [deviceId, today]
      );
    }
    const remaining = Math.max(0, DAILY_CREDITS - used);
    res.json({ remaining, limit: DAILY_CREDITS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ remaining: 0, limit: DAILY_CREDITS });
  }
});

/** POST /api/chat/use-credit — consume one credit for image generation */
router.post("/use-credit", async (req, res) => {
  try {
    const deviceId = (req.body?.deviceId || "").toString().slice(0, 64);
    if (!deviceId) {
      return res.status(400).json({ error: "deviceId required" });
    }
    const today = new Date().toISOString().slice(0, 10);
    await db.execute(
      "INSERT INTO device_credits (device_id, period_start, credits_used) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE device_id = device_id",
      [deviceId, today]
    );
    const [rows] = await db.execute(
      "SELECT credits_used FROM device_credits WHERE device_id = ? AND period_start = ?",
      [deviceId, today]
    );
    const used = rows[0] ? rows[0].credits_used : 0;
    if (used >= DAILY_CREDITS) {
      return res.status(402).json({ remaining: 0, limit: DAILY_CREDITS, error: "No credits left" });
    }
    await db.execute(
      "UPDATE device_credits SET credits_used = credits_used + 1 WHERE device_id = ? AND period_start = ?",
      [deviceId, today]
    );
    const remaining = DAILY_CREDITS - used - 1;
    res.json({ success: true, remaining, limit: DAILY_CREDITS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

/** POST /api/chat/save-reference-image — save base64 image for quote reference */
router.post("/save-reference-image", async (req, res) => {
  try {
    const deviceId = (req.body?.deviceId || "").toString().slice(0, 64);
    const imageData = req.body?.imageData;
    if (!imageData || typeof imageData !== "string") {
      return res.status(400).json({ error: "imageData required" });
    }
    const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(base64, "base64");
    if (buf.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image too large" });
    }
    ensureGeneratedDir();
    const ref = crypto.randomBytes(12).toString("hex");
    const ext = (imageData.match(/data:image\/(\w+);/) || [])[1] || "png";
    const filename = `${ref}.${ext}`;
    const filePath = path.join(GENERATED_DIR, filename);
    fs.writeFileSync(filePath, buf);
    await db.execute(
      "INSERT INTO ai_generated_images (ref, file_path, device_id) VALUES (?, ?, ?)",
      [ref, filename, deviceId || null]
    );
    res.json({ ref });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save image" });
  }
});

/** GET /api/chat/generated-image/:ref — serve image (inline only, no download) */
router.get("/generated-image/:ref", (req, res) => {
  const ref = (req.params.ref || "").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 32);
  if (!ref) return res.status(404).end();
  if (!fs.existsSync(GENERATED_DIR)) return res.status(404).end();
  const filePath = path.join(GENERATED_DIR, `${ref}.png`);
  if (!fs.existsSync(filePath)) {
    const files = fs.readdirSync(GENERATED_DIR);
    const alt = files.find((f) => f.startsWith(ref + "."));
    if (!alt) return res.status(404).end();
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.sendFile(path.join(GENERATED_DIR, alt));
    return;
  }
  res.setHeader("Content-Disposition", "inline");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.sendFile(filePath);
});

export default router;
