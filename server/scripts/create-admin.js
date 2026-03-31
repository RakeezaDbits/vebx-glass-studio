/**
 * Create the first admin user for /admin (or reset password with --reset).
 * Uses server/.env for DB. Optional: INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_NAME.
 *
 *   cd server && npm run admin:create
 *   cd server && npm run admin:create -- --reset
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const email = (process.env.INITIAL_ADMIN_EMAIL || "admin@vebx.run").trim().toLowerCase();
const password = process.env.INITIAL_ADMIN_PASSWORD || "admin123";
const name = (process.env.INITIAL_ADMIN_NAME || "Admin").trim() || "Admin";
const reset = process.argv.includes("--reset");

async function main() {
  const [existing] = await db.execute("SELECT id, email FROM admin_users ORDER BY id ASC");

  if (reset) {
    if (existing.length === 0) {
      console.error("No admin user in the database. Run without --reset to create one.");
      process.exit(1);
    }
    let row;
    if (process.env.INITIAL_ADMIN_EMAIL) {
      row = existing.find((r) => String(r.email).toLowerCase() === email);
      if (!row) {
        console.error(`No admin with INITIAL_ADMIN_EMAIL=${process.env.INITIAL_ADMIN_EMAIL.trim()}`);
        process.exit(1);
      }
    } else {
      row = existing[0];
    }
    const hash = await bcrypt.hash(password, 10);
    await db.execute("UPDATE admin_users SET password_hash = ?, name = ? WHERE id = ?", [hash, name, row.id]);
    console.log(`Password updated for: ${row.email}`);
    console.log("Log in at /admin/login with that account.");
    await db.end();
    process.exit(0);
  }

  if (existing.length > 0) {
    console.log("Admin user(s) already exist:", existing.map((r) => r.email).join(", "));
    console.log("Open /admin/login. To set a new password: INITIAL_ADMIN_PASSWORD=... npm run admin:create -- --reset");
    await db.end();
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  await db.execute("INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)", [email, hash, name]);
  console.log("Admin created.");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password === "admin123" ? "admin123 (change after first login — set INITIAL_ADMIN_PASSWORD for custom)" : "(value from INITIAL_ADMIN_PASSWORD)"}`);
  console.log("Log in at /admin/login");
  await db.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err.message || err);
  if (err.code === "ER_NO_SUCH_TABLE") {
    console.error("Run: mysql ... < server/sql/schema.sql   or   cd server && npm run db:schema");
  }
  if (err.code === "ECONNREFUSED" || err.code === "ER_ACCESS_DENIED_ERROR") {
    console.error("Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in server/.env");
  }
  process.exit(1);
});
