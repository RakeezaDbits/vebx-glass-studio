import "dotenv/config";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "sql", "schema.sql");

async function run() {
  const sql = readFileSync(schemaPath, "utf8");
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });
  try {
    await conn.query(sql);
    console.log("Schema applied: vebx_studio database and tables created.");
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
