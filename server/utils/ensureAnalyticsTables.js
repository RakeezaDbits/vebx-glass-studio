import db from "../config/db.js";

/** Run on API startup so visit analytics work without a manual migration. */
export async function ensureAnalyticsTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_visits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      path VARCHAR(512) NOT NULL DEFAULT '/',
      country_code VARCHAR(8) NOT NULL DEFAULT 'UN',
      client_ip VARCHAR(45) NULL DEFAULT NULL,
      visitor_key VARCHAR(48) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_site_visits_created (created_at),
      INDEX idx_site_visits_country_created (country_code, created_at)
    )
  `);
  try {
    await db.execute(
      `ALTER TABLE site_visits ADD COLUMN client_ip VARCHAR(45) NULL DEFAULT NULL AFTER country_code`
    );
  } catch (e) {
    const code = e && typeof e === "object" && "code" in e ? String(e.code) : "";
    if (code !== "ER_DUP_FIELDNAME") throw e;
  }
}
