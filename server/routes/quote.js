import express from "express";
import db from "../config/db.js";
import { sendQuoteNotification } from "../utils/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      serviceSlug,
      subTypeId,
      techIds,
      tierId,
      referenceLink,
      referenceFileName,
      referenceImageRef,
    } = req.body;
    if (!name?.trim() || !email?.trim() || !serviceSlug?.trim()) {
      return res.status(400).json({ error: "Name, email and service are required" });
    }
    const techJson = techIds ? JSON.stringify(Array.isArray(techIds) ? techIds : [techIds]) : null;
    const [result] = await db.execute(
      `INSERT INTO quote_submissions (name, email, phone, service_slug, sub_type_id, tech_ids, tier_id, reference_link, reference_file_name, reference_image_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim(),
        phone?.trim() || null,
        serviceSlug.trim(),
        subTypeId?.trim() || null,
        techJson,
        tierId?.trim() || null,
        referenceLink?.trim() || null,
        referenceFileName || null,
        referenceImageRef?.trim()?.slice(0, 32) || null,
      ]
    );
    const id = result.insertId;

    if (process.env.SMTP_USER && process.env.SMTP_APP_PASSWORD) {
      try {
        await sendQuoteNotification({
          name,
          email,
          phone,
          service_slug: serviceSlug,
          sub_type_id: subTypeId,
          tech_ids: techIds,
          tier_id: tierId,
          reference_link: referenceLink,
        });
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
