import db from "../config/db.js";

/** Run on API startup so live chat works without a manual SQL migration. */
export async function ensureLiveChatTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS live_chat_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      public_token VARCHAR(48) NOT NULL UNIQUE,
      visitor_name VARCHAR(255),
      visitor_email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      last_visitor_message_at TIMESTAMP NULL,
      last_notify_email_at TIMESTAMP NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS live_chat_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      sender ENUM('visitor','admin') NOT NULL,
      msg_type ENUM('text','image','audio','video') NOT NULL DEFAULT 'text',
      body TEXT,
      file_path VARCHAR(500),
      mime_type VARCHAR(120),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_live_chat_session_created (session_id, id),
      FOREIGN KEY (session_id) REFERENCES live_chat_sessions(id) ON DELETE CASCADE
    )
  `);
}
