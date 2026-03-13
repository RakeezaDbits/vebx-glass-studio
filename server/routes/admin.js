import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import { authMiddleware, createToken } from "../middleware/auth.js";

const router = express.Router();

// Seed first admin (only if no admin exists)
router.post("/seed", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id FROM admin_users LIMIT 1");
    if (rows.length > 0) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const email = "admin@vebx.run";
    const password = "admin123";
    const hash = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)", [
      email,
      hash,
      "Admin",
    ]);
    res.json({ message: "Admin created. Email: admin@vebx.run, Password: admin123" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seed failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const [rows] = await db.execute("SELECT id, email, password_hash FROM admin_users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = createToken(rows[0].id);
    res.json({ token, admin: { id: rows[0].id, email: rows[0].email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// All routes below require auth
router.use(authMiddleware);

// Contact submissions list
router.get("/contacts", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, subject, message, created_at FROM contact_submissions ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Quote submissions list
router.get("/quotes", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, phone, service_slug, sub_type_id, tech_ids, tier_id, reference_link, reference_file_name, created_at FROM quote_submissions ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Settings - get all
router.get("/settings", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT `key`, value FROM site_settings");
    const settings = {};
    rows.forEach((r) => (settings[r.key] = r.value));
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Settings - update
router.put("/settings", async (req, res) => {
  try {
    const body = req.body;
    for (const key of Object.keys(body)) {
      await db.execute("INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?", [
        key,
        String(body[key]),
        String(body[key]),
      ]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

// Projects CRUD
router.get("/projects", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM projects ORDER BY sort_order, id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const { slug, title, category, description, image_url, sort_order } = req.body;
    if (!slug?.trim() || !title?.trim()) {
      return res.status(400).json({ error: "slug and title required" });
    }
    const [r] = await db.execute(
      "INSERT INTO projects (slug, title, category, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [slug.trim(), title.trim(), category?.trim() || null, description?.trim() || null, image_url?.trim() || null, sort_order ?? 0]
    );
    res.status(201).json({ id: r.insertId, slug, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create" });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { slug, title, category, description, image_url, sort_order } = req.body;
    await db.execute(
      "UPDATE projects SET slug=?, title=?, category=?, description=?, image_url=?, sort_order=? WHERE id=?",
      [slug?.trim(), title?.trim(), category?.trim() || null, description?.trim() || null, image_url?.trim() || null, sort_order ?? 0, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM projects WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Services CRUD
router.get("/services", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM services ORDER BY sort_order, id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { slug, title, short_desc, long_desc, icon_name, features, highlights, sort_order } = req.body;
    if (!slug?.trim() || !title?.trim()) {
      return res.status(400).json({ error: "slug and title required" });
    }
    const [r] = await db.execute(
      "INSERT INTO services (slug, title, short_desc, long_desc, icon_name, features, highlights, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        slug.trim(),
        title.trim(),
        short_desc?.trim() || null,
        long_desc?.trim() || null,
        icon_name?.trim() || null,
        JSON.stringify(features || []),
        JSON.stringify(highlights || []),
        sort_order ?? 0,
      ]
    );
    res.status(201).json({ id: r.insertId, slug, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create" });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { slug, title, short_desc, long_desc, icon_name, features, highlights, sort_order } = req.body;
    await db.execute(
      "UPDATE services SET slug=?, title=?, short_desc=?, long_desc=?, icon_name=?, features=?, highlights=?, sort_order=? WHERE id=?",
      [
        slug?.trim(),
        title?.trim(),
        short_desc?.trim() || null,
        long_desc?.trim() || null,
        icon_name?.trim() || null,
        JSON.stringify(features || []),
        JSON.stringify(highlights || []),
        sort_order ?? 0,
        id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM services WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Expertise CRUD
router.get("/expertise", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM expertise ORDER BY category, sort_order, id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.post("/expertise", async (req, res) => {
  try {
    const { category, name, description, sort_order } = req.body;
    if (!category?.trim() || !name?.trim()) {
      return res.status(400).json({ error: "category and name required" });
    }
    const [r] = await db.execute(
      "INSERT INTO expertise (category, name, description, sort_order) VALUES (?, ?, ?, ?)",
      [category.trim(), name.trim(), description?.trim() || null, sort_order ?? 0]
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create" });
  }
});

router.put("/expertise/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { category, name, description, sort_order } = req.body;
    await db.execute(
      "UPDATE expertise SET category=?, name=?, description=?, sort_order=? WHERE id=?",
      [category?.trim(), name?.trim(), description?.trim() || null, sort_order ?? 0, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

router.delete("/expertise/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM expertise WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
