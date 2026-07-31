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

## 3. Going live with Supabase (real database)

Novora runs on browser storage out of the box. To make it a real, multi-device backend:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase **SQL Editor**, paste and run `supabase/schema.sql` (tables, role-based RLS,
   signup trigger), then optionally `supabase/seed.sql` (departments, clients).
3. Copy `.env.example` to `.env` and fill in your project URL + anon key
   (Supabase → Project Settings → API):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Restart `npm run dev`. The app detects the keys (`src/lib/supabase.ts`) and switches to live mode.
5. Sign up in the app, then promote yourself:
   `update profiles set role = 'admin' where email = 'you@example.com';`

Row-level security is enforced per role: employees only see their own leave/expenses/payslips,
managers see their team + finance, admins see everything.

> The schema, client, and RLS are ready. Say the word once your keys are in and I'll switch the
> page-level data calls from the local store over to Supabase queries.

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
  lib/        types, seed, local store, auth, theme, supabase client, calc (+ tests), format
  components/ Layout (sidebar + topbar), reusable UI kit
  pages/      Login, Dashboard, Employees, Leave, Payroll,
              Performance, Invoices, Expenses, Reports, Settings
supabase/     schema.sql (tables + RLS + trigger), seed.sql
capacitor.config.ts, vite.config.ts (PWA + Vitest), .env.example
```

© 2026 Novora · A TechnovaHub product
