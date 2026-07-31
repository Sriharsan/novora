import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { useTheme } from "../lib/theme";
import { Card, PageHeader, Avatar, Badge } from "../components/ui";
import { RotateCcw, Moon, Sun, ShieldCheck, UserCog, User } from "lucide-react";

export default function SettingsPage() {
  const { resetDemo } = useData();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  if (!user) return null;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Your profile, appearance and workspace." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Profile</h3>
          <div className="flex items-center gap-4">
            <Avatar name={user.name} color={user.avatarColor} size={56} />
            <div>
              <div className="text-lg font-bold">{user.name}</div>
              <div className="text-sm text-slate-500">{user.title}</div>
              <div className="mt-1"><Badge tone="violet">{user.role}</Badge></div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-xs text-slate-400">Email</div><div className="font-medium">{user.email}</div></div>
            <div><div className="text-xs text-slate-400">Leave balance</div><div className="font-medium">{user.leaveBalance} days</div></div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Appearance</h3>
          <button onClick={toggle} className="btn-ghost w-full justify-between">
            <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <h3 className="mb-3 mt-6 font-bold text-slate-900 dark:text-white">Workspace</h3>
          <button
            onClick={() => { if (confirm("Reset all data back to the demo seed? This clears your changes.")) resetDemo(); }}
            className="btn-ghost w-full justify-between text-rose-600"
          >
            <span>Reset demo data</span>
            <RotateCcw size={16} />
          </button>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Getting started · roles</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2 font-semibold"><ShieldCheck size={18} className="text-brand-500" /> Admin</div>
            <p className="text-sm text-slate-500">Full access — manage employees, payroll, invoices, and all approvals. Login: admin@novora.app / admin123</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2 font-semibold"><UserCog size={18} className="text-teal-500" /> Manager</div>
            <p className="text-sm text-slate-500">Approves leave &amp; expenses, sees team and finance. Login: aarav@novora.app / manager123</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2 font-semibold"><User size={18} className="text-amber-500" /> Employee</div>
            <p className="text-sm text-slate-500">Self-service — request leave, submit expenses, view own reviews. Login: rohan@novora.app / employee123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
