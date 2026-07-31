# Running Novora locally — handoff

Two ways to run it. Easiest first.

## Option A — one-click (Windows)

1. Make sure **PostgreSQL is running** (you already have PG16 via pgAdmin) and **Node.js 18+** is installed.
2. If your Postgres password isn't `tmlzs`, edit `server\.env` → `DATABASE_URL`.
3. Double-click **`setup.bat`** (installs everything, creates the `novora` database, tables and demo data).
4. Double-click **`start.bat`** (opens the API + the web app; browser opens to http://localhost:5173).

Log in: `admin@novora.app / admin123` (or the Admin/Manager/Employee demo buttons).

## Option B — hand it to Claude Code

Open a terminal in `D:\technovahub\novora`, run `claude`, and paste this prompt:

> Set up and run this project locally. It's a Vite + React frontend at the repo root and a
> Node + Express + PostgreSQL backend in `server/`. Steps:
> 1. Confirm PostgreSQL is running locally; the connection string is in `server/.env`.
> 2. `cd server && npm install && npm run setup` (this auto-creates the `novora` database,
>    runs migrations, and seeds demo data). Then start it with `npm start` (API on :4000).
> 3. In the repo root: `npm install && npm run dev` (web app on :5173).
> 4. Run `npm test` in the root and report results.
> 5. If any command errors, read the error, fix the cause (e.g. wrong DB password in
>    `server/.env`, missing Postgres service, port in use), and retry until both servers are up.
> Then tell me the URLs and the demo logins.

## Manual commands (reference)

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

## Push to GitHub

```bash
git push -u origin main   # sign in with your GitHub account when prompted
```
