import multer from "multer";
import path from "path";
import { LIVE_CHAT_UPLOAD_ROOT, ensureLiveChatUploadDirs } from "../utils/liveChatFiles.js";

ensureLiveChatUploadDirs();
const UPLOAD_TMP = path.join(LIVE_CHAT_UPLOAD_ROOT, "tmp");

export const liveChatUpload = multer({
  dest: UPLOAD_TMP,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^(image|audio|video)\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image, audio, or video uploads are allowed"));
  },
});
