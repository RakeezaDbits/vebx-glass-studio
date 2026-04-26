import express from "express";
import db from "../config/db.js";
import { getClientIp, resolveVisitCountry } from "../utils/analyticsGeo.js";
import { ensureAnalyticsTables } from "../utils/ensureAnalyticsTables.js";
import { authMiddleware } from "../middleware/auth.js";
import { sendAdminAnalyticsSummary } from "../utils/sendAdminAnalyticsSummary.js";

const router = express.Router();

/** Admin JWT — same data as GET /api/admin/analytics/summary (avoids 404 if only /api/analytics is routed). */
router.get("/dashboard", authMiddleware, sendAdminAnalyticsSummary);

function sanitizePath(p) {
  const s = String(p ?? "/").trim() || "/";
  if (s.length > 500) return s.slice(0, 500);
  return s;
}

function sanitizeVisitorKey(k) {
  const s = String(k ?? "").trim();
  if (/^[a-zA-Z0-9_-]{8,40}$/.test(s)) return s;
  return "";
}

/** Public: record a page view (used by the marketing site, not admin). */
router.post("/visit", async (req, res) => {
  try {
    await ensureAnalyticsTables();
    const path = sanitizePath(req.body?.path);
    const visitor_key = sanitizeVisitorKey(req.body?.visitorKey);
    const country = resolveVisitCountry(req, req.body?.countryCode);
    const clientIp = getClientIp(req) || null;
    await db.execute(
      "INSERT INTO site_visits (path, country_code, client_ip, visitor_key) VALUES (?, ?, ?, ?)",
      [path, country, clientIp, visitor_key || "anon"]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[analytics] visit", err);
    res.status(500).json({ error: "Failed to record" });
  }
});

export default router;
