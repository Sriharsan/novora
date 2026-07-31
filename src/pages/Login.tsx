import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, UserCog, User, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, loginAs } = useAuth();
  const [email, setEmail] = useState("admin@novora.app");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) setError(res.error ?? "Login failed");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="noise relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900 p-12 text-white lg:flex">
        <div className="dark:bg-grid-dark pointer-events-none absolute inset-0 bg-[size:22px_22px] opacity-30" />
        <div className="animate-glow-pulse pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-[110px]" />
        <div className="animate-glow-pulse pointer-events-none absolute -bottom-24 right-10 h-96 w-96 rounded-full bg-teal-400/20 blur-[110px] [animation-delay:2s]" />

        <Link to="/" className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl font-extrabold backdrop-blur">N</div>
          <span className="font-display text-2xl font-extrabold">Novora</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
          <span className="eyebrow !border-white/20 !bg-white/10 !text-white">
            <Sparkles size={12} /> HR &amp; Finance, unified
          </span>
          <h1 className="font-display mt-5 text-4xl font-extrabold leading-tight">HR &amp; Finance on autopilot.</h1>
          <p className="mt-4 max-w-md text-white/70">
            One platform for your people and your money — onboarding, leave, payroll, invoicing, expenses and
            live financial dashboards. Built for TechnovaHub.
          </p>
          <div className="mt-8 flex gap-6 text-sm">
            <div><div className="font-display text-2xl font-bold">8</div><div className="text-white/60">Modules</div></div>
            <div><div className="font-display text-2xl font-bold">3</div><div className="text-white/60">Roles</div></div>
            <div><div className="font-display text-2xl font-bold">100%</div><div className="text-white/60">Automated</div></div>
          </div>
        </motion.div>

        <div className="relative text-xs text-white/50">© 2026 Novora · A TechnovaHub product</div>
      </div>

      {/* Right form */}
      <div className="relative flex w-full items-center justify-center p-6 lg:w-1/2">
        <Link to="/" className="absolute left-6 top-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-500 dark:text-slate-400">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 font-extrabold text-white">N</div>
              <span className="font-display text-xl font-extrabold">Novora</span>
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to your workspace.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} type="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} type="password" />
            </div>
            {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            or try a demo role
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => loginAs("admin")} className="btn-ghost flex-col !py-3 text-xs">
              <ShieldCheck size={18} className="text-brand-500" /> Admin
            </button>
            <button onClick={() => loginAs("manager")} className="btn-ghost flex-col !py-3 text-xs">
              <UserCog size={18} className="text-teal-500" /> Manager
            </button>
            <button onClick={() => loginAs("employee")} className="btn-ghost flex-col !py-3 text-xs">
              <User size={18} className="text-amber-500" /> Employee
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <p className="font-semibold text-slate-600 dark:text-slate-300">Demo credentials</p>
            <p className="mt-1">Admin — admin@novora.app / admin123</p>
            <p>Manager — aarav@novora.app / manager123</p>
            <p>Employee — rohan@novora.app / employee123</p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            New to Novora?{" "}
            <Link to="/signup" className="font-semibold text-brand-500 hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
