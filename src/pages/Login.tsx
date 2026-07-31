import { useState } from "react";
import { useAuth } from "../lib/auth";
import { ShieldCheck, UserCog, User } from "lucide-react";

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
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-teal-500 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl font-extrabold">N</div>
          <span className="text-2xl font-extrabold">Novora</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">HR &amp; Finance on autopilot.</h1>
          <p className="mt-4 max-w-md text-white/80">
            One platform for your people and your money — onboarding, leave, payroll, invoicing, expenses and
            live financial dashboards. Built for TechnovaHub.
          </p>
          <div className="mt-8 flex gap-6 text-sm">
            <div><div className="text-2xl font-bold">7</div><div className="text-white/70">Modules</div></div>
            <div><div className="text-2xl font-bold">3</div><div className="text-white/70">Roles</div></div>
            <div><div className="text-2xl font-bold">100%</div><div className="text-white/70">Automated</div></div>
          </div>
        </div>
        <div className="text-xs text-white/60">© 2026 Novora · A TechnovaHub product</div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 font-extrabold text-white">N</div>
              <span className="text-xl font-extrabold">Novora</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
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
        </div>
      </div>
    </div>
  );
}
