# Novora — HR & Finance on autopilot

A premium HR + Finance automation platform built for **TechnovaHub**. One workspace for your
people (onboarding, leave, payroll, performance) and your money (invoicing, expenses, reports),
with role-based access, a live dashboard, a dark award-style UI, installable PWA, native iOS/Android
shells, and an optional real Supabase backend.

**Stack:** React + TypeScript + Vite + Tailwind CSS + Recharts · Supabase (optional) · PWA (Workbox) · Capacitor (iOS/Android) · Vitest.

---

## 1. Quick start (web)

Requires **Node.js 18+** ([nodejs.org](https://nodejs.org)).

```bash
cd D:\technovahub\novora
npm install      # first run only
npm run dev      # http://localhost:5173
```

Log in with the demo buttons or `admin@novora.app / admin123`.

Other commands:

```bash
npm run build    # production build -> /dist  (also generates the PWA service worker)
npm run preview  # preview the production build
npm test         # run the unit tests (Vitest)
```

### Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@novora.app | admin123 |
| Manager | aarav@novora.app | manager123 |
| Employee | rohan@novora.app | employee123 |

Each role sees a different app (Admin = everything, Manager = approvals + team + finance,
Employee = self-service). Every action updates the store live and re-renders the charts — nothing
is hard-coded. **Settings → Reset demo data** restores the seed. The demo book is intentionally
profitable so the dashboard and P&L look healthy.

---

## 2. Modules

**People** — Employees & Onboarding (search, filter, add/edit/delete, checklist), Leave &
Attendance (request + approve, auto balance), Payroll (generate run, approve → paid, payslip
download), Performance (star reviews + goals).

**Finance** — Invoices (line items, live totals, filters, download), Expenses (receipt upload,
approval flow), Reports (cash flow, budget vs spend, live P&L, CSV export).

**Overview** — Dashboard with KPI cards, revenue-vs-expense trend, expense donut, headcount chart
and activity feed. Dark premium theme by default with a light-mode toggle.

---

## 3. Going live with the PostgreSQL backend

Novora runs on browser storage out of the box. To make it a real, multi-device app, run the
included **Node + Express + PostgreSQL** backend (folder `server/`).

**Prereqs:** PostgreSQL 14+ running locally (e.g. via pgAdmin). In pgAdmin, create an empty
database named **`novora`**.

```bash
cd server
npm install
cp .env.example .env        # then edit DATABASE_URL to match your Postgres
npm run setup               # creates tables (migrate) + loads demo data (seed)
npm start                   # API on http://localhost:4000
```

`server/.env` (gitignored) example:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/novora
JWT_SECRET=change-me
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

Then in the project root, `.env` already points the frontend at the API:

```
VITE_API_URL=http://localhost:4000
```

Start the frontend (`npm run dev`) with the backend running and Novora is fully live: real
Postgres storage, JWT auth (bcrypt-hashed passwords), and every create/approve/edit persisted to
the database. Log in with the same demo accounts (they're seeded into Postgres too).

> Robustness: if the backend is offline, the app automatically falls back to the local demo
> dataset so it never hard-crashes. Passwords are per-role RLS-style gated in the API
> (employees only see their own leave/expenses/payslips; managers approve; admin sees all).

---

## 4. Install as an app (PWA)

The production build ships a service worker and manifest, so Novora installs like a native app:

- **Desktop (Chrome/Edge):** open the site → install icon in the address bar.
- **Android (Chrome):** menu → *Add to Home screen*.
- **iOS (Safari):** Share → *Add to Home Screen*.

It then launches full-screen, works offline, and updates automatically.

---

## 5. Native iOS & Android (Capacitor)

The project is Capacitor-ready (`capacitor.config.ts`, appId `com.technovahub.novora`).

```bash
npm run build
npx cap add ios          # one-time (needs macOS + Xcode)
npx cap add android      # one-time (needs Android Studio)
npm run cap:ios          # build + sync + open Xcode
npm run cap:android      # build + sync + open Android Studio
```

From Xcode / Android Studio you run on a simulator/device or archive for the stores.

> **Publishing** to the App Store / Play Store requires your own paid developer accounts
> (Apple Developer $99/yr, Google Play $25 one-time) and signing certificates — those steps happen
> under your accounts and can't be automated here. Everything up to "open in Xcode/Android Studio"
> is done for you.

---

## 6. Tests

```bash
npm test
```

Vitest covers the money/HR logic — payroll gross/tax/PF/net, inclusive leave-day counting, invoice
subtotal/tax/total, net-profit and INR formatting (`src/lib/calc.test.ts`). All green.

---

## 7. Project structure

```
src/
  lib/        types, seed, store (API + local), auth, theme, api client, calc (+ tests), format
  components/ Layout (sidebar + topbar + notifications), reusable UI kit
  pages/      Login, Dashboard, Employees, OrgChart, Leave, Payroll,
              Performance, Invoices, Expenses, Reports, Settings
server/       Express + PostgreSQL API — schema.sql, migrate, seed, auth (JWT), routes
capacitor.config.ts, vite.config.ts (PWA + Vitest), .env.example
```

## 8. Push to GitHub

The repo is already initialised and committed locally. To publish to
`github.com/Sriharsan/novora`, create the empty repo on GitHub (no README), then:

```bash
cd D:\technovahub\novora
git push -u origin main    # authenticate with your GitHub login / token when prompted
```

© 2026 Novora · A TechnovaHub product
