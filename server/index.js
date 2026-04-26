import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";
import aiRoutes from "./routes/ai.js";
import livechatRoutes from "./routes/livechat.js";
import analyticsRoutes from "./routes/analytics.js";
import { authMiddleware } from "./middleware/auth.js";
import { sendAdminAnalyticsSummary } from "./utils/sendAdminAnalyticsSummary.js";
import { ensureLiveChatTables } from "./utils/ensureLiveChatTables.js";
import { ensureAnalyticsTables } from "./utils/ensureAnalyticsTables.js";

const app = express();
const PORT = process.env.PORT || 3001;

/** So req.ip / X-Forwarded-For work behind nginx, Cloudflare, Hostinger, etc. */
app.set("trust proxy", process.env.TRUST_PROXY === "0" ? false : 1);

app.use(cors({ origin: true, credentials: true }));
// Larger limit for /api/chat (save-reference-image sends base64 image)
app.use(express.json({ limit: "10mb" }));

/**
 * Admin traffic summary — registered on several paths so one survives bad reverse proxies
 * (some hosts only forward `/api/health` reliably until you add a full `location /api/` block).
 */
app.get("/api/health/analytics", authMiddleware, sendAdminAnalyticsSummary);
app.get("/api/summary", authMiddleware, sendAdminAnalyticsSummary);
/** Flat path so proxies cannot drop nested segments; same handler as /api/analytics/dashboard. */
app.get("/api/analytics-dashboard", authMiddleware, sendAdminAnalyticsSummary);

app.use("/api/contact", contactRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/livechat", livechatRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

/** Meta (Facebook / Instagram) webhook verification — set FACEBOOK_WEBHOOK_VERIFY_TOKEN in server/.env */
app.get("/api/social/webhooks/meta", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const verify = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;
  if (mode === "subscribe" && verify && token === verify && challenge) {
    return res.status(200).send(String(challenge));
  }
  return res.status(403).json({ error: "Webhook verification failed" });
});

app.post("/api/social/webhooks/meta", (req, res) => {
  res.status(501).json({
    error: "Webhook ingest stub — verify X-Hub-Signature-256 and process changes when automation is wired.",
  });
});

// Public settings (contact email, address, etc.)
app.get("/api/settings", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT `key`, value FROM site_settings");
    const settings = {};
    rows.forEach((r) => (settings[r.key] = r.value));
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

async function start() {
  try {
    await ensureLiveChatTables();
  } catch (err) {
    console.error("[live chat] Could not ensure DB tables:", err.message);
    console.error("Fix: MySQL running, DB_NAME correct in server/.env, then: cd server && npm run db:livechat");
  }
  try {
    await ensureAnalyticsTables();
  } catch (err) {
    console.error("[analytics] Could not ensure DB tables:", err.message);
  }
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
