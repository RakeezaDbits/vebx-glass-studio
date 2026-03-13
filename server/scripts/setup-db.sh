#!/bin/bash
# Run this once (you will be asked for sudo password):
#   chmod +x server/scripts/setup-db.sh
#   ./server/scripts/setup-db.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_DIR="$(dirname "$SCRIPT_DIR")/sql"

echo "Creating database and tables (sudo mysql)..."
sudo mysql < "$SQL_DIR/schema.sql"

echo "Creating app user vebx (sudo mysql)..."
sudo mysql < "$SQL_DIR/schema-user.sql" 2>/dev/null || echo "Note: vebx user may already exist - that's OK."

echo "Done. Use DB_USER=vebx DB_PASSWORD=vebx in server/.env and run: npm run dev"
