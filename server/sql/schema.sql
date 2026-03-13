-- vebx-glass-studio database schema (MySQL)
-- Run: mysql -u root -p < server/sql/schema.sql
-- Or create database first: CREATE DATABASE IF NOT EXISTS vebx_studio;

CREATE DATABASE IF NOT EXISTS vebx_studio;
USE vebx_studio;

-- Admin users (login for admin panel)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Get a Quote / Custom requirement submissions
CREATE TABLE IF NOT EXISTS quote_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service_slug VARCHAR(100) NOT NULL,
  sub_type_id VARCHAR(50),
  tech_ids JSON,
  tier_id VARCHAR(50),
  reference_link VARCHAR(500),
  reference_file_name VARCHAR(255),
  reference_image_ref VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device credits (AI chat: per device per day)
CREATE TABLE IF NOT EXISTS device_credits (
  device_id VARCHAR(64) NOT NULL,
  period_start DATE NOT NULL,
  credits_used INT NOT NULL DEFAULT 0,
  PRIMARY KEY (device_id, period_start)
);

-- AI-generated images (Nano Banana); ref used in chat + quote reference
CREATE TABLE IF NOT EXISTS ai_generated_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref VARCHAR(32) NOT NULL UNIQUE,
  file_path VARCHAR(255) NOT NULL,
  device_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects (Our Work portfolio)
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services (manageable from admin; frontend can still use static or fetch)
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  short_desc VARCHAR(500),
  long_desc TEXT,
  icon_name VARCHAR(100),
  features JSON,
  highlights JSON,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Expertise (categories / tech stack items)
CREATE TABLE IF NOT EXISTS expertise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Site settings (contact email, address, phone, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default admin: run server once and use POST /api/admin/seed to create admin@vebx.run / admin123

-- Seed default site settings
INSERT INTO site_settings (`key`, value) VALUES
  ('contact_email', 'support@vebx.run'),
  ('contact_address', '117 S Lexington Street STN 100, Harrisonville MO 64701'),
  ('contact_phone', ''),
  ('business_hours', 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed')
ON DUPLICATE KEY UPDATE `key` = `key`;

