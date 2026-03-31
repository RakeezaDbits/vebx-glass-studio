import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";
import livechatRoutes from "./routes/livechat.js";
import { ensureLiveChatTables } from "./utils/ensureLiveChatTables.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
// Larger limit for /api/chat (save-reference-image sends base64 image)
app.use(express.json({ limit: "10mb" }));

app.use("/api/contact", contactRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/livechat", livechatRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

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
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
