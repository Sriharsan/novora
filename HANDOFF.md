# Running Novora locally — handoff

## Option A — one-click (Windows)

1. Make sure **PostgreSQL is running** and **Node.js 18+** is installed.
2. If your Postgres password isn't `tmlzs`, edit `server\.env` → `DATABASE_URL`.
3. Double-click **`setup.bat`** (installs everything, creates the `novora` database, tables and demo data).
4. Double-click **`start.bat`** (opens the API + the web app; browser opens to http://localhost:5173).

Log in: `admin@novora.app / admin123` (or the Admin/Manager/Employee demo buttons on the login page).

## Option B — manual commands

```bash
# backend
cd server
npm install
npm run setup       # ensure-db + migrate + seed
npm start           # http://localhost:4000

# frontend (new terminal, repo root)
npm install
npm run dev         # http://localhost:5173
```

## Turning on real email automation

Add SMTP credentials to `server/.env` (see `server/.env.example`) and restart the backend —
notifications then also send real emails. See the main [README.md](README.md) for details.

## Push to GitHub

```bash
git push -u origin main   # sign in with your GitHub account when prompted
```
