import express from "express";
import db from "../config/db.js";

const router = express.Router();

/** Which env vars power each platform (values never sent to client — only set/not set). */
export const SOCIAL_AUTOMATION_ENV = {
  facebook: [
    "FACEBOOK_APP_ID",
    "FACEBOOK_APP_SECRET",
    "FACEBOOK_PAGE_ACCESS_TOKEN",
    "FACEBOOK_PAGE_ID",
    "FACEBOOK_WEBHOOK_VERIFY_TOKEN",
  ],
  instagram: ["INSTAGRAM_BUSINESS_ACCOUNT_ID", "INSTAGRAM_ACCESS_TOKEN"],
  linkedin: [
    "LINKEDIN_CLIENT_ID",
    "LINKEDIN_CLIENT_SECRET",
    "LINKEDIN_ACCESS_TOKEN",
    "LINKEDIN_ORGANIZATION_URN",
  ],
  twitter: [
    "TWITTER_API_KEY",
    "TWITTER_API_SECRET",
    "TWITTER_BEARER_TOKEN",
    "TWITTER_ACCESS_TOKEN",
    "TWITTER_ACCESS_SECRET",
  ],
};

const SETTING_KEYS = [
  "social_auto_master_enabled",
  "social_auto_fb_enabled",
  "social_auto_ig_enabled",
  "social_auto_li_enabled",
  "social_auto_tw_enabled",
  "social_auto_cross_post",
  "social_auto_default_hashtags",
  "social_auto_post_window_utc",
  "social_auto_digest_weekly",
  "social_auto_reply_suggestions",
];

function envSnapshot() {
  const platforms = {};
  for (const [id, keys] of Object.entries(SOCIAL_AUTOMATION_ENV)) {
    platforms[id] = keys.map((k) => ({
      key: k,
      configured: Boolean(String(process.env[k] ?? "").trim()),
    }));
  }
  return platforms;
}

router.get("/", async (req, res) => {
  try {
    const placeholders = SETTING_KEYS.map(() => "?").join(",");
    const [rows] = await db.execute(
      `SELECT \`key\`, value FROM site_settings WHERE \`key\` IN (${placeholders})`,
      SETTING_KEYS
    );
    const settings = {};
    for (const k of SETTING_KEYS) settings[k] = "";
    rows.forEach((r) => {
      settings[r.key] = r.value ?? "";
    });
    res.json({
      envPlatforms: envSnapshot(),
      settings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load social automation" });
  }
});

router.put("/", async (req, res) => {
  try {
    const body = req.body?.settings ?? req.body ?? {};
    const allowed = new Set(SETTING_KEYS);
    for (const key of Object.keys(body)) {
      if (!allowed.has(key)) continue;
      const val = String(body[key] ?? "");
      await db.execute("INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?", [
        key,
        val,
        val,
      ]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save" });
  }
});

/** Placeholder — real Graph/LinkedIn/X calls go here after credentials are set. */
router.post("/test", (req, res) => {
  const platform = String(req.body?.platform ?? "unknown").toLowerCase();
  const ok = ["facebook", "instagram", "linkedin", "twitter"].includes(platform);
  res.json({
    ok,
    platform,
    message: ok
      ? "Test hook received. Publishing APIs are not enabled in this build — configure server/.env, then wire Meta/LinkedIn/X SDKs in socialAutomationAdmin.js."
      : "Unknown platform.",
  });
});

router.post("/queue/dry-run", (req, res) => {
  res.json({
    ok: true,
    wouldPublish: [],
    message:
      "Queue is empty (dry run). When automation is implemented, drafts scheduled here will preview without posting.",
  });
});

export default router;
