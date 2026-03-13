import express from "express";
import db from "../config/db.js";
import { sendContactNotification } from "../utils/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    const [result] = await db.execute(
      "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim(), subject?.trim() || null, message.trim()]
    );
    const id = result.insertId;

    if (process.env.SMTP_USER && process.env.SMTP_APP_PASSWORD) {
      try {
        await sendContactNotification({ name, email, subject, message });
      } catch (err) {
        console.error("Email send failed:", err.message);
      }
    }

    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit" });
  }
});

export default router;
