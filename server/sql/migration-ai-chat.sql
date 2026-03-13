-- AI Chat: device credits + generated images + quote reference
USE vebx_studio;

-- Credits per device per day (device_id = fingerprint hash, period_start = date)
CREATE TABLE IF NOT EXISTS device_credits (
  device_id VARCHAR(64) NOT NULL,
  period_start DATE NOT NULL,
  credits_used INT NOT NULL DEFAULT 0,
  PRIMARY KEY (device_id, period_start)
);

-- Generated images (ref = unique id, file_path = filename in server/generated/)
CREATE TABLE IF NOT EXISTS ai_generated_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref VARCHAR(32) NOT NULL UNIQUE,
  file_path VARCHAR(255) NOT NULL,
  device_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote can attach an AI-generated image ref (image stays on server, linked to quote)
-- Run once; ignore error if column already exists.
ALTER TABLE quote_submissions ADD COLUMN reference_image_ref VARCHAR(32) NULL;
