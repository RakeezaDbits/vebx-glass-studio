import crypto from "crypto";
import db from "../config/db.js";

export function genPublicToken() {
  return crypto.randomBytes(24).toString("hex");
}

/** Anonymous label for admin + emails, e.g. Guest·A3F2B1 (no PII from the client). */
export function genGuestDisplayName() {
  const id = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `Guest·${id}`;
}

export async function createSession({ name, email } = {}) {
  const public_token = genPublicToken();
  const visitor_name = name?.trim() || genGuestDisplayName();
  const visitor_email = email?.trim() || null;
  const [r] = await db.execute(
    "INSERT INTO live_chat_sessions (public_token, visitor_name, visitor_email) VALUES (?, ?, ?)",
    [public_token, visitor_name, visitor_email]
  );
  return { id: r.insertId, public_token };
}

export async function updateSessionProfile(token, { name, email }) {
  const session = await getSessionByToken(token);
  if (!session) return null;
  await db.execute("UPDATE live_chat_sessions SET visitor_name = ?, visitor_email = ? WHERE id = ?", [
    name?.trim() || null,
    email?.trim() || null,
    session.id,
  ]);
  return getSessionByToken(token);
}

export async function getSessionByToken(token) {
  const [rows] = await db.execute("SELECT * FROM live_chat_sessions WHERE public_token = ?", [token]);
  return rows[0] || null;
}

export async function getSessionById(id) {
  const [rows] = await db.execute("SELECT * FROM live_chat_sessions WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function listSessions() {
  const [rows] = await db.execute(`
    SELECT s.*,
      (SELECT msg_type FROM live_chat_messages WHERE session_id = s.id ORDER BY id DESC LIMIT 1) AS last_msg_type,
      (SELECT body FROM live_chat_messages WHERE session_id = s.id ORDER BY id DESC LIMIT 1) AS last_preview
    FROM live_chat_sessions s
    ORDER BY s.updated_at DESC
  `);
  return rows;
}

export async function listMessages(sessionId, afterId = 0) {
  const [rows] = await db.execute(
    "SELECT id, sender, msg_type, body, mime_type, created_at FROM live_chat_messages WHERE session_id = ? AND id > ? ORDER BY id ASC",
    [sessionId, afterId]
  );
  return rows;
}

export async function getMessageWithSession(messageId) {
  const [rows] = await db.execute(
    `SELECT m.*, s.public_token
     FROM live_chat_messages m
     JOIN live_chat_sessions s ON s.id = m.session_id
     WHERE m.id = ?`,
    [messageId]
  );
  return rows[0] || null;
}

export async function insertMessage({ sessionId, sender, msgType, body, filePath, mimeType }) {
  const [r] = await db.execute(
    "INSERT INTO live_chat_messages (session_id, sender, msg_type, body, file_path, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
    [sessionId, sender, msgType, body || null, filePath || null, mimeType || null]
  );
  const messageId = r.insertId;
  if (sender === "visitor") {
    await db.execute(
      "UPDATE live_chat_sessions SET updated_at = CURRENT_TIMESTAMP, last_visitor_message_at = CURRENT_TIMESTAMP WHERE id = ?",
      [sessionId]
    );
  } else {
    await db.execute("UPDATE live_chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", [sessionId]);
  }
  return messageId;
}

export async function shouldSendVisitorNotifyEmail(sessionId) {
  const cooldown = Number(process.env.LIVE_CHAT_EMAIL_COOLDOWN_MS) || 120000;
  const [rows] = await db.execute("SELECT last_notify_email_at FROM live_chat_sessions WHERE id = ?", [sessionId]);
  const last = rows[0]?.last_notify_email_at;
  if (last) {
    const elapsed = Date.now() - new Date(last).getTime();
    if (elapsed < cooldown) return false;
  }
  await db.execute("UPDATE live_chat_sessions SET last_notify_email_at = CURRENT_TIMESTAMP WHERE id = ?", [sessionId]);
  return true;
}
