import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Signup() {
  const { register, loginAs } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in every field.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    const res = await register(name.trim(), email.trim(), password);
    setBusy(false);
    if (!res.ok) setError(res.error ?? "Could not create your account.");
  };

  const viewDemo = async () => {
    setDemoBusy(true);
    await loginAs("admin");
    setDemoBusy(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="noise relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900 p-12 text-white lg:flex">
        <div className="dark:bg-grid-dark pointer-events-none absolute inset-0 bg-[size:22px_22px] opacity-30" />
        <div className="animate-glow-pulse pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-400/25 blur-[110px]" />
        <div className="animate-glow-pulse pointer-events-none absolute -bottom-24 right-10 h-96 w-96 rounded-full bg-brand-500/25 blur-[110px] [animation-delay:2s]" />

        <Link to="/" className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl font-extrabold backdrop-blur">N</div>
          <span className="font-display text-2xl font-extrabold">Novora</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
          <span className="eyebrow !border-white/20 !bg-white/10 !text-white">
            <Sparkles size={12} /> Start free, in seconds
          </span>
          <h1 className="font-display mt-5 text-4xl font-extrabold leading-tight">Set up your workspace.</h1>
          <p className="mt-4 max-w-md text-white/70">
            Create your account and get a fully working HR &amp; Finance workspace — onboarding, leave, payroll,
            invoicing, expenses and live dashboards, ready immediately.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-300" /> No credit card required</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-300" /> Role-based access from day one</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-300" /> Explore with real seeded demo data too</li>
          </ul>
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
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tell us a bit about you to get started.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="label">Work email</label>
              <input className="input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@company.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" />
              </div>
              <div>
                <label className="label">Confirm</label>
                <input className="input" type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="••••••••" />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Creating your workspace…" : "Create account"}</button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            or
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <button onClick={viewDemo} disabled={demoBusy} className="btn-ghost w-full">
            <Rocket size={16} className="text-teal-500" /> {demoBusy ? "Loading demo…" : "Skip signup — view live demo"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-500 hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
