# vebx-glass-studio API

Backend for form submissions, admin panel, and email notifications.

## Setup

1. **MySQL**: Create database and tables.
   - If `mysql -u root -p` gives **ERROR 1698 (Access denied)** (common on Ubuntu/WSL), run from the `server` folder:
     ```bash
     cd server && npm run db:schema
     ```
     This uses root with no password to create the DB and tables.
   - Otherwise: `mysql -u root -p < server/sql/schema.sql` or run the SQL in MySQL Workbench.
   - Default database name: `vebx_studio`. Use `DB_USER=root` and `DB_PASSWORD=` in `.env` if root has no password.

2. **Environment**: Copy and edit env.
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `.env` with your DB credentials and Gmail SMTP (see below).

3. **Gmail SMTP**: Use a Gmail account and an [App Password](https://support.google.com/accounts/answer/185833).
   - `SMTP_USER=your@gmail.com`
   - `SMTP_APP_PASSWORD=your-16-char-app-password`

4. **Install and run**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server runs on http://localhost:3001.

5. **Seed projects, services, expertise** (same data as on the website):
   ```bash
   npm run db:seed
   ```

6. **Create first admin**: After DB is set up and server is running:
   ```bash
   curl -X POST http://localhost:3001/api/admin/seed
   ```
   Default login: **admin@vebxrun.com** / **admin123**. Change password in production.

## API

- `POST /api/contact` – Contact form (saves to DB, emails to support@vebxrun.com, aimanmaqsoodahmed@gmail.com, rakeezasattar53@gmail.com)
- `POST /api/quote` – Get a Quote form (saves to DB, same email list)
- `GET /api/settings` – Public site settings (contact email, address, etc.)
- `POST /api/admin/seed` – Create first admin (no auth)
- `POST /api/admin/login` – Admin login (email, password) → JWT
- `GET/POST/PUT/DELETE /api/admin/*` – Projects, services, expertise, contacts list, quotes list, settings (Bearer token required)

## Frontend

- Vite proxy forwards `/api` to `http://localhost:3001` in development.
- Admin panel: **/admin** (login at /admin/login).

## Production (Nginx + Node)

If the site shows **“Chat API not found (404)”**, the browser is not reaching the Node app on `/api/*`.

1. Run the API (e.g. PM2): `cd server && NODE_ENV=production pm2 start index.js --name vebx-api`
2. Check: `curl -s http://127.0.0.1:3001/api/health` → `{"ok":true}`
3. Check: `curl -s -X POST http://127.0.0.1:3001/api/livechat/session -H "Content-Type: application/json" -d '{}'` → JSON with `token`
4. In Nginx, **`location /api/` must come before** the SPA `try_files` rule, and use **`proxy_pass http://127.0.0.1:3001;` with no trailing slash** on the URL. A trailing slash on `proxy_pass` strips `/api` and breaks Express routes (404). See **`nginx.example.conf`** in this folder.

Public URL test (after Nginx reload):

`curl -s -X POST https://your-domain.com/api/livechat/session -H "Content-Type: application/json" -d '{}'`

Do **not** set `VITE_API_URL` if the API is on the same domain as the site (same-origin `/api` is correct). Rebuild only if you change env: `VITE_API_URL=https://other-host npm run build`.
