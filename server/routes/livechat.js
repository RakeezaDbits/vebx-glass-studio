import express from "express";
import fs from "fs";
import path from "path";
import db from "../config/db.js";
import {
  createSession,
  getSessionByToken,
  listMessages,
  insertMessage,
  getMessageWithSession,
  updateSessionProfile,
  shouldSendVisitorNotifyEmail,
} from "../utils/liveChatDb.js";
import { liveChatUpload } from "../middleware/livechatUpload.js";
import { sendLiveChatNotification } from "../utils/email.js";
import {
  LIVE_CHAT_UPLOAD_ROOT,
  ensureLiveChatUploadDirs,
  inferMsgTypeFromMime,
  finalizeLiveChatUpload,
} from "../utils/liveChatFiles.js";
import { liveChatNotifySubscribe, liveChatNotifyPublish } from "../utils/liveChatNotify.js";

ensureLiveChatUploadDirs();

const router = express.Router();

router.post("/session", express.json(), async (req, res) => {
  try {
    // Visitor display name is always server-generated (Guest·XXXX); ignore client name/email.
    const session = await createSession();
    res.json({ token: session.public_token, sessionId: session.id });
  } catch (err) {
    console.error(err);
    const code = err.code;
    let message = "Could not start chat";
    if (code === "ECONNREFUSED") message = "Cannot connect to MySQL. Start the database and check DB_HOST in server/.env.";
    else if (code === "ER_ACCESS_DENIED_ERROR") message = "Database login failed. Check DB_USER and DB_PASSWORD in server/.env.";
    else if (code === "ER_BAD_DB_ERROR") message = `Database "${process.env.DB_NAME || "vebx_studio"}" does not exist. Create it or set DB_NAME in server/.env.`;
    else if (code === "ER_NO_SUCH_TABLE") message = "Live chat tables missing. Restart the API (tables auto-create) or run: cd server && npm run db:livechat";
    res.status(500).json({ error: message });
  }
});

router.patch("/session/:token", express.json(), async (req, res) => {
  try {
    const { token } = req.params;
    const updated = await updateSessionProfile(token, req.body || {});
    if (!updated) return res.status(404).json({ error: "Session not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

/** SSE: push when this session gets a new message (visitor or admin). */
router.get("/:token/events", async (req, res) => {
  try {
    const session = await getSessionByToken(req.params.token);
    if (!session) return res.status(404).end();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    if (typeof res.flushHeaders === "function") res.flushHeaders();

    res.write(": ok\n\n");

    const push = () => {
      try {
        res.write(`data: ${JSON.stringify({ m: 1 })}\n\n`);
      } catch {
        /* client gone */
      }
    };
    const unsub = liveChatNotifySubscribe(session.id, push);

    const ka = setInterval(() => {
      try {
        res.write(": ka\n\n");
      } catch {
        /* ignore */
      }
    }, 25000);

    req.on("close", () => {
      clearInterval(ka);
      unsub();
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).end();
  }
});

router.get("/:token/messages", async (req, res) => {
  try {
    const session = await getSessionByToken(req.params.token);
    if (!session) return res.status(404).json({ error: "Session not found" });
    const afterId = Math.max(0, parseInt(String(req.query.afterId || "0"), 10) || 0);
    const messages = await listMessages(session.id, afterId);
    res.json({ messages });
  } catch (err) {
    console.error(err);
    const code = err.code;
    let message = "Could not load messages";
    if (code === "ECONNREFUSED") message = "Cannot connect to MySQL. Start MariaDB/MySQL and check DB_HOST in server/.env.";
    else if (code === "ER_ACCESS_DENIED_ERROR") message = "Database login failed. Check DB_USER and DB_PASSWORD in server/.env.";
    else if (code === "ER_BAD_DB_ERROR") message = `Database "${process.env.DB_NAME || "vebx_studio"}" missing. Create it or fix DB_NAME.`;
    else if (code === "ER_NO_SUCH_TABLE") message = "Live chat tables missing. Restart the API or run: cd server && npm run db:livechat";
    res.status(500).json({ error: message });
  }
});

router.post("/:token/messages", (req, res, next) => {
  liveChatUpload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}, async (req, res) => {
  try {
    const session = await getSessionByToken(req.params.token);
    if (!session) return res.status(404).json({ error: "Session not found" });

    let msgType = (req.body?.type || "text").toLowerCase();
    const bodyText = req.body?.body != null ? String(req.body.body).trim() : "";
    const file = req.file;

    if (file) {
      msgType = inferMsgTypeFromMime(file.mimetype);
    } else {
      if (msgType !== "text") {
        return res.status(400).json({ error: "File required for this message type" });
      }
      if (!bodyText) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }
    }

    const messageId = await insertMessage({
      sessionId: session.id,
      sender: "visitor",
      msgType,
      body: bodyText || null,
      filePath: null,
      mimeType: file?.mimetype || null,
    });

    let filePath = null;
    let mimeType = file?.mimetype || null;
    if (file) {
      try {
        const fin = await finalizeLiveChatUpload(session.id, messageId, file);
        filePath = fin.filePath;
        mimeType = fin.mimeType;
        if (filePath) {
          await db.execute("UPDATE live_chat_messages SET file_path = ?, mime_type = ? WHERE id = ?", [
            filePath,
            mimeType,
            messageId,
          ]);
        }
      } catch (e) {
        console.error("livechat finalize upload", e);
        await db.execute("DELETE FROM live_chat_messages WHERE id = ?", [messageId]);
        return res.status(500).json({ error: "Could not store file" });
      }
    }

    const fullSession = await getSessionByToken(req.params.token);
    if (await shouldSendVisitorNotifyEmail(session.id)) {
      sendLiveChatNotification({
        sessionId: session.id,
        visitorName: fullSession?.visitor_name,
        visitorEmail: fullSession?.visitor_email,
        preview: bodyText || (file ? `[${msgType}]` : ""),
        adminUrl: `${process.env.LIVE_CHAT_ADMIN_URL || "https://vebx.run/admin/live-chat"}?session=${session.id}`,
      }).catch((e) => console.error("live chat email failed", e));
    }

    liveChatNotifyPublish(session.id);

    res.status(201).json({
      id: Number(messageId),
      sender: "visitor",
      msg_type: msgType,
      body: bodyText || null,
      mime_type: mimeType,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/:token/file/:messageId", async (req, res) => {
  try {
    const session = await getSessionByToken(req.params.token);
    if (!session) return res.status(404).end();

    const messageId = parseInt(req.params.messageId, 10);
    const row = await getMessageWithSession(messageId);
    // Row uses session_id from live_chat_messages (not session_db_id).
    if (!row || Number(row.session_id) !== Number(session.id) || !row.file_path) {
      return res.status(404).end();
    }

    const abs = path.join(LIVE_CHAT_UPLOAD_ROOT, row.file_path);
    const resolved = path.resolve(abs);
    if (!resolved.startsWith(path.resolve(LIVE_CHAT_UPLOAD_ROOT)) || !fs.existsSync(resolved)) {
      return res.status(404).end();
    }

    res.setHeader("Content-Type", row.mime_type || "application/octet-stream");
    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.sendFile(resolved);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

export default router;
