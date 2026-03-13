-- Run after schema.sql: creates user vebx/vebx so Node can connect (root often uses socket auth on Ubuntu/WSL)
-- Run: sudo mysql < server/sql/schema-user.sql
-- If "user already exists", ignore and use DB_USER=vebx DB_PASSWORD=vebx in server/.env

CREATE USER 'vebx'@'localhost' IDENTIFIED BY 'vebx';
GRANT ALL PRIVILEGES ON vebx_studio.* TO 'vebx'@'localhost';
FLUSH PRIVILEGES;
