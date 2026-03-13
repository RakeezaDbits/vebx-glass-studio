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
   Default login: **admin@vebx.run** / **admin123**. Change password in production.

## API

- `POST /api/contact` – Contact form (saves to DB, emails to support@vebx.run, aimanmaqsoodahmed@gmail.com, rakeezasattar53@gmail.com)
- `POST /api/quote` – Get a Quote form (saves to DB, same email list)
- `GET /api/settings` – Public site settings (contact email, address, etc.)
- `POST /api/admin/seed` – Create first admin (no auth)
- `POST /api/admin/login` – Admin login (email, password) → JWT
- `GET/POST/PUT/DELETE /api/admin/*` – Projects, services, expertise, contacts list, quotes list, settings (Bearer token required)

## Frontend

- Vite proxy forwards `/api` to `http://localhost:3001` in development.
- Admin panel: **/admin** (login at /admin/login).
