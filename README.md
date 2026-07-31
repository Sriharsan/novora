# Novora — HR & Finance on autopilot

A full HR + Finance platform built for **TechnovaHub**: a public marketing site, real sign-up/sign-in,
role-aware workspace (Admin / Manager / Employee), a live PostgreSQL backend, and a working
**automation engine** that notifies the right person — in-app and by real email — the moment
something needs attention.

**Stack:** React + TypeScript + Vite + Tailwind CSS + Recharts + Framer Motion (frontend) ·
Node + Express + PostgreSQL + JWT auth + Nodemailer (backend) · PWA (Workbox) · Capacitor
(iOS/Android) · Vitest.

---

## 1. What's in the product

**Public site**
- **Landing page** (`/`) — hero, feature grid, "how it works," module showcase, FAQ, footer.
- **Sign up** (`/signup`) — real account creation (name/email/password → straight into the app),
  or **"View live demo"** for one-click access with no form.
- **Sign in** (`/login`) — real login, or one-click demo-role buttons.

**Workspace** (role-aware — Admin sees everything, Manager approves + sees team/finance,
Employee is self-service)
- **Dashboard** — KPIs, revenue-vs-expense trend, expense breakdown, headcount chart, activity feed
  (a focused self-service view for employees).
- **Employees** — directory, search, add/edit/delete, onboarding checklist per hire.
- **Org Chart** — reporting structure as a real connected flowchart.
- **Leave & Attendance** — request + approve, automatic leave-balance deduction.
- **Payroll** — generate a run, approve → paid, payslip figures (gross/tax/PF/net).
- **Performance** — review cycles, ratings, goals.
- **Invoices** — line items, live tax/total calculation, status tracking.
- **Expenses** — submit with receipt, approval flow.
- **Reports** — cash flow, budget vs. spend, live P&L.
- **Settings** — profile, theme, reset demo data.
- **Live search** (topbar) — type to get instant matching employees/invoices/expenses with
  click-to-navigate suggestions.
- **Notifications** — a real bell with unread counts and "mark all read," backed by the
  automation engine below.

**Automation engine** (the part that makes this more than a CRUD app)
| Trigger | Who gets notified |
|---|---|
| Leave request submitted | Admin + Manager |
| Leave approved / rejected | The employee |
| Expense claim submitted | Admin + Manager |
| Expense approved / rejected | The employee |
| Payroll run generated | Admin |
| New sign-up | Admin (new hire alert) + the new employee (welcome) |
| Invoice passes its due date | Auto-flips to *overdue* + Admin notified |
| Onboarding checklist stale (3+ days) | The employee + Admin |

Every notification is stored in-app **and** attempts real email delivery via SMTP. If no SMTP
credentials are configured, email is a graceful no-op (logged, not sent) — the rest of the app
works identically either way. Time-based checks (overdue invoices, stale onboarding) run on an
interval, configurable via `AUTOMATION_INTERVAL_MINUTES` in `server/.env` (defaults to 60).

---

## 2. Quick start

Requires **Node.js 18+** and **PostgreSQL 14+** running locally.

**Backend** (terminal 1):
```bash
cd server
npm install
cp .env.example .env        # edit DATABASE_URL to match your Postgres
npm run setup                # creates the DB + tables (migrate) + demo data (seed)
npm start                    # API on http://localhost:4000
```

**Frontend** (terminal 2, from the project root):
```bash
npm install
npm run dev                  # http://localhost:5173
```

Open `http://localhost:5173` — you'll land on the marketing page. Click **View live demo** for
instant access, or **Get started free** to create a real account.

### Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@novora.app | admin123 |
| Manager | aarav@novora.app | manager123 |
| Employee | rohan@novora.app | employee123 |

> If the backend isn't running, the app automatically falls back to a local in-browser demo
> dataset instead of crashing — useful for a quick UI look, but automation/email only run with
> the real backend up.

---

## 3. Turning on real email

By default the automation engine only shows notifications in-app. To also send real emails, add
this to `server/.env` (gitignored — never committed):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-char-gmail-app-password   # Google Account → Security → App passwords (needs 2FA on)
MAIL_FROM=you@gmail.com
```

Restart the backend and every notification also sends a real email to the relevant employee's
address. No code changes needed.

---

## 4. Tests

```bash
npm test
```

Vitest covers the money/HR calculation logic — payroll gross/tax/PF/net, inclusive leave-day
counting, invoice subtotal/tax/total, net-profit and currency formatting
(`src/lib/calc.test.ts`). Run `npx tsc --noEmit` for a type-check.

---

## 5. Install as an app (PWA) / native shells

The production build (`npm run build`) ships a service worker + manifest, installable from any
modern browser (desktop install icon, Android "Add to Home screen," iOS Share → "Add to Home
Screen").

The project is also Capacitor-ready for native iOS/Android builds:
```bash
npm run cap:ios       # needs macOS + Xcode
npm run cap:android   # needs Android Studio
```
Publishing to the App Store / Play Store requires your own developer accounts and happens outside
this repo.

---

## 6. Project structure

```
src/
  pages/        Landing, Login, Signup, Dashboard, Employees, OrgChart, Leave,
                Payroll, Performance, Invoices, Expenses, Reports, Settings
  components/   Layout (sidebar + topbar + live search + notifications), shared UI kit
  lib/          auth, store (API + local-demo fallback), api client, notifications hook,
                theme, calc (+ tests), format, types

server/
  index.js      Express app — REST API, auth, notification endpoints
  schema.sql    PostgreSQL schema (source of truth — `npm run setup` applies it fresh)
  notify.js     notify()/notifyRole() — writes a notification row + sends email
  mailer.js     Nodemailer wrapper (no-ops gracefully without SMTP config)
  scheduler.js  Interval-based checks: overdue invoices, stale onboarding
  migrate.js / seed.js / ensureDb.js   setup pipeline (`npm run setup`)
```

---

## 7. Repository

Live at [github.com/Sriharsan/novora](https://github.com/Sriharsan/novora).

```bash
git clone https://github.com/Sriharsan/novora.git
```

© 2026 Novora · A TechnovaHub product
