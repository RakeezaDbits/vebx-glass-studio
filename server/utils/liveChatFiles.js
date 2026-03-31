import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LIVE_CHAT_UPLOAD_ROOT = path.join(__dirname, "../uploads/live-chat");

export function ensureLiveChatUploadDirs() {
  fs.mkdirSync(LIVE_CHAT_UPLOAD_ROOT, { recursive: true });
  fs.mkdirSync(path.join(LIVE_CHAT_UPLOAD_ROOT, "tmp"), { recursive: true });
}

export function safeFileSegment(name) {
  return String(name || "file")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120);
}

export function inferMsgTypeFromMime(mime) {
  if (!mime) return "text";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  return "text";
}

export async function finalizeLiveChatUpload(sessionId, messageId, file) {
  if (!file?.path) return { filePath: null, mimeType: null };
  const ext = path.extname(file.originalname || "") || "";
  const base = safeFileSegment(path.basename(file.originalname || "file", ext));
  const rel = `${sessionId}/${messageId}-${base}${ext}`;
  const dir = path.join(LIVE_CHAT_UPLOAD_ROOT, String(sessionId));
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(LIVE_CHAT_UPLOAD_ROOT, rel);
  fs.renameSync(file.path, dest);
  return { filePath: rel, mimeType: file.mimetype || null };
}
