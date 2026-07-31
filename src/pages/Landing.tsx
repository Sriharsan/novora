import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  Users,
  Wallet,
  FileText,
  Receipt,
  CalendarClock,
  Target,
  BarChart3,
  Network,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  Minus,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import { useTheme } from "../lib/theme";
import { useAuth } from "../lib/auth";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#modules", label: "Modules" },
  { href: "#workflow", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

const FEATURES = [
  {
    icon: Users,
    title: "People, unified",
    desc: "Directory, org chart, onboarding checklists and role-based access — one source of truth for every hire.",
    tone: "#6d5ef6",
  },
  {
    icon: Wallet,
    title: "Payroll that runs itself",
    desc: "Automated payroll runs, payslip generation and net-pay calculations, ready in minutes not days.",
    tone: "#12d8b6",
  },
  {
    icon: FileText,
    title: "Invoicing, done right",
    desc: "Create, send and track invoices with tax handling and live outstanding-balance visibility.",
    tone: "#f5b331",
  },
  {
    icon: BarChart3,
    title: "Finance you can see",
    desc: "Revenue, expenses and headcount trends rolled into dashboards built for decisions, not spreadsheets.",
    tone: "#3b82f6",
  },
];

const MODULES = [
  { icon: Users, name: "Employees", desc: "Full directory with departments, salaries & status." },
  { icon: Network, name: "Org Chart", desc: "Visualize reporting lines at a glance." },
  { icon: CalendarClock, name: "Leave & Attendance", desc: "Requests, approvals, clock-in tracking." },
  { icon: Wallet, name: "Payroll", desc: "Run payroll, generate payslips automatically." },
  { icon: Target, name: "Performance", desc: "Review cycles, ratings and goal tracking." },
  { icon: FileText, name: "Invoices", desc: "Client billing with tax-aware totals." },
  { icon: Receipt, name: "Expenses", desc: "Submit, approve and reconcile spend." },
  { icon: BarChart3, name: "Reports", desc: "Cross-module analytics, exportable." },
];

const STEPS = [
  { n: "01", title: "Onboard your team", desc: "Import your people, set departments and roles, and let onboarding checklists take it from there." },
  { n: "02", title: "Track the everyday", desc: "Leave, attendance, expenses and performance reviews flow through one connected system." },
  { n: "03", title: "Pay & bill with confidence", desc: "Run payroll and issue invoices with automatic tax and totals — no spreadsheet gymnastics." },
  { n: "04", title: "See it all in one view", desc: "Live dashboards turn every module into a single, always-current picture of the business." },
];

const FAQS = [
  { q: "Is Novora built for a specific company size?", a: "Novora scales from a lean 10-person team to a multi-department organization — the same modules, role-based views and dashboards adapt to your headcount." },
  { q: "Can employees, managers and admins see different things?", a: "Yes. Novora ships with role-aware access out of the box — employees get self-service tools, managers get approvals and their team's data, and admins see everything." },
  { q: "What happens if the backend is offline?", a: "Novora gracefully falls back to a local demo dataset so you can always explore the interface, then reconnects automatically once the API is back." },
  { q: "Do I need to install anything?", a: "No — Novora runs entirely in the browser, and can also be installed as a PWA or wrapped for mobile via Capacitor." },
];

function Navbar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="glass sticky top-0 z-50 shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 font-extrabold text-white shadow-lift">
            N
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Novora</span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="btn-ghost hidden sm:inline-flex">
            Sign in
          </Link>
          <Link to="/signup" className="btn-primary hidden sm:inline-flex">
            Get started <ArrowRight size={16} />
          </Link>
          <button
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass border-t border-slate-200 px-4 py-3 dark:border-white/10 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="btn-ghost flex-1">Sign in</Link>
              <Link to="/signup" className="btn-primary flex-1">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MockDashboard() {
  return (
    <div className="card noise mx-auto w-full max-w-2xl overflow-hidden !p-0 shadow-glow-lg">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs font-medium text-slate-400">app.novora.io/dashboard</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {[
          { label: "Headcount", value: "16", tone: "from-brand-500 to-brand-600" },
          { label: "Payroll", value: "₹20.6L", tone: "from-teal-500 to-teal-600" },
          { label: "Revenue", value: "₹51.9L", tone: "from-gold-500 to-gold-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
            <div className={`mb-2 h-6 w-6 rounded-lg bg-gradient-to-br ${s.tone}`} />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</div>
            <div className="text-[11px] text-slate-400">{s.label}</div>
          </div>
        ))}
        <div className="col-span-3 flex h-32 items-end gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
          {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-brand-500 to-teal-400 opacity-80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden !p-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-slate-800 dark:text-slate-100">{q}</span>
        {open ? <Minus size={18} className="shrink-0 text-brand-500" /> : <Plus size={18} className="shrink-0 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{a}</div>}
    </div>
  );
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loginAs } = useAuth();
  const [demoBusy, setDemoBusy] = useState(false);

  const viewDemo = async () => {
    setDemoBusy(true);
    await loginAs("admin");
    setDemoBusy(false);
  };

  return (
    <div id="top" className="min-h-screen">
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="dark:bg-grid-dark absolute inset-0 bg-[size:22px_22px] opacity-40" />
          <div className="animate-glow-pulse absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-500/25 blur-[120px]" />
          <div className="animate-glow-pulse absolute -right-32 top-20 h-[28rem] w-[28rem] rounded-full bg-teal-400/20 blur-[120px] [animation-delay:1.5s]" />
          <div className="animate-glow-pulse absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-gold-400/15 blur-[120px] [animation-delay:3s]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-3xl text-center">
            <motion.span variants={fadeUp} className="eyebrow">
              <Sparkles size={12} /> HR &amp; Finance, unified
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-display mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Run your people &amp; money on <span className="text-gradient">one autopilot</span> platform.
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg text-slate-500 dark:text-slate-400">
              Onboarding, leave, payroll, invoicing, expenses and live financial dashboards — crafted into a single,
              beautifully connected workspace for modern teams.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup" className="btn-primary btn-lg">
                Get started free <ArrowRight size={18} />
              </Link>
              <button onClick={viewDemo} disabled={demoBusy} className="btn-ghost btn-lg">
                <Rocket size={17} className="text-teal-500" /> {demoBusy ? "Loading demo…" : "View live demo"}
              </button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-teal-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-teal-500" /> 8 connected modules</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-teal-500" /> Role-based from day one</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float mt-16"
          >
            <MockDashboard />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-slate-200 bg-white/60 py-4 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12 text-sm font-semibold uppercase tracking-widest text-slate-400">
            {Array.from({ length: 2 }).flatMap((_, loop) =>
              ["Payroll automation", "Live dashboards", "Role-based access", "Invoicing", "Leave tracking", "Performance reviews"].map((t) => (
                <span key={`${loop}-${t}`} className="flex items-center gap-3">
                  <Zap size={14} className="text-brand-400" /> {t}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="product" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <motion.span variants={fadeUp} className="eyebrow">What is Novora</motion.span>
          <motion.h2 variants={fadeUp} className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Every HR &amp; Finance workflow, designed to feel effortless.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-500 dark:text-slate-400">
            Stop stitching together spreadsheets and disconnected tools. Novora brings your entire operational
            backbone into one considered, cohesive experience.
          </motion.p>
        </Reveal>

        <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="card card-hover p-6">
              <div className="stat-icon mb-4" style={{ background: `linear-gradient(135deg, ${f.tone}, ${f.tone}cc)` }}>
                <f.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section id="workflow" className="relative overflow-hidden bg-slate-50/70 py-24 dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <motion.span variants={fadeUp} className="eyebrow">How it works</motion.span>
            <motion.h2 variants={fadeUp} className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              From first hire to final report.
            </motion.h2>
          </Reveal>

          <Reveal className="relative mt-16 grid gap-8 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/10 lg:block" />
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 font-display text-sm font-bold text-white shadow-lift">
                  {s.n}
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* MODULES BENTO */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <motion.span variants={fadeUp} className="eyebrow">Inside the platform</motion.span>
          <motion.h2 variants={fadeUp} className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Eight modules. One connected system.
          </motion.h2>
        </Reveal>

        <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <motion.div key={m.name} variants={fadeUp} className="card card-hover group p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-400/10 dark:text-brand-300">
                <m.icon size={18} />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{m.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{m.desc}</p>
            </motion.div>
          ))}
        </Reveal>
      </section>

      {/* STATS BAND */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <Reveal className="card noise grid gap-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-teal-500 p-10 text-white shadow-glow-lg sm:grid-cols-3">
          {[
            { icon: Users, label: "People managed live", value: "16+" },
            { icon: ShieldCheck, label: "Role-aware modules", value: "8" },
            { icon: Zap, label: "Automated payroll runs", value: "100%" },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <s.icon size={22} />
              </div>
              <div>
                <div className="font-display text-3xl font-extrabold">{s.value}</div>
                <div className="text-sm text-white/80">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <motion.span variants={fadeUp} className="eyebrow">FAQ</motion.span>
          <motion.h2 variants={fadeUp} className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good to know.
          </motion.h2>
        </Reveal>
        <Reveal className="space-y-3">
          {FAQS.map((f) => (
            <motion.div key={f.q} variants={fadeUp}>
              <FaqItem q={f.q} a={f.a} />
            </motion.div>
          ))}
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900 px-8 py-16 text-center shadow-glow-lg">
            <div className="dark:bg-grid-dark pointer-events-none absolute inset-0 bg-[size:22px_22px] opacity-30" />
            <div className="animate-glow-pulse pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/30 blur-[100px]" />
            <h2 className="font-display relative mx-auto max-w-xl text-3xl font-bold text-white sm:text-4xl">
              Ready to put HR &amp; Finance on autopilot?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/70">
              Create your workspace, or explore with a demo role in under a minute.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup" className="btn-primary btn-lg">
                Get started free <ArrowRight size={18} />
              </Link>
              <button onClick={viewDemo} disabled={demoBusy} className="btn-ghost btn-lg !border-white/20 !bg-white/10 !text-white hover:!bg-white/15">
                <Rocket size={17} /> {demoBusy ? "Loading demo…" : "View live demo"}
              </button>
            </div>
          </motion.div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 text-sm font-extrabold text-white">N</div>
                <span className="font-display font-extrabold text-slate-900 dark:text-white">Novora</span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                HR &amp; Finance on autopilot — a TechnovaHub product.
              </p>
            </div>
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Product</div>
              <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                <a href="#product" className="hover:text-brand-500">Features</a>
                <a href="#modules" className="hover:text-brand-500">Modules</a>
                <a href="#workflow" className="hover:text-brand-500">How it works</a>
              </div>
            </div>
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Company</div>
              <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                <a href="#faq" className="hover:text-brand-500">FAQ</a>
                <Link to="/login" className="hover:text-brand-500">Sign in</Link>
              </div>
            </div>
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Get started</div>
              <Link to="/signup" className="btn-primary w-full mb-2">Create account</Link>
              <button onClick={viewDemo} disabled={demoBusy} className="btn-ghost w-full">
                <Rocket size={15} className="text-teal-500" /> {demoBusy ? "Loading…" : "Try the demo"}
              </button>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-white/10">
            © 2026 Novora · A TechnovaHub product. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
