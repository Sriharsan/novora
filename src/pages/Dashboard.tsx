import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Users, Wallet, FileText, Receipt, CalendarClock, TrendingUp, ArrowRight } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { inr, relTime, invoiceTotal } from "../lib/format";
import { Card, PageHeader, Avatar, StatusBadge, Progress } from "../components/ui";

const PIE_COLORS = ["#6d5ef6", "#12d8b6", "#f59e0b", "#3b82f6", "#ec4899", "#94a3b8"];

function Stat({ icon: Icon, label, value, tone }: any) {
  return (
    <Card className="group relative flex items-center gap-4 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div
        className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: tone }}
      />
      <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${tone}, ${tone}cc)` }}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <div
          title={String(value)}
          className="font-display truncate text-xl font-bold leading-tight text-slate-900 dark:text-white sm:text-2xl"
        >
          {value}
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { db } = useData();
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";

  const m = useMemo(() => {
    const headcount = db.employees.filter((e) => e.status !== "inactive").length;
    const pendingLeave = db.leave.filter((l) => l.status === "pending").length;
    const pendingExpenses = db.expenses.filter((x) => x.status === "pending").length;
    const latestPayroll = db.payroll[0];
    const monthlyPayroll = latestPayroll ? latestPayroll.lines.reduce((s, l) => s + l.net, 0) : 0;
    const outstanding = db.invoices
      .filter((i) => i.status !== "paid")
      .reduce((s, i) => s + invoiceTotal(i.items, i.taxRate).total, 0);
    const revenue = db.invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + invoiceTotal(i.items, i.taxRate).total, 0);
    const expenseTotal = db.expenses.filter((x) => x.status !== "rejected").reduce((s, x) => s + x.amount, 0);

    const deptData = db.departments.map((d) => ({
      name: d.name.split(" ")[0],
      count: db.employees.filter((e) => e.departmentId === d.id).length,
    }));

    const catMap: Record<string, number> = {};
    db.expenses.forEach((x) => {
      if (x.status !== "rejected") catMap[x.category] = (catMap[x.category] || 0) + x.amount;
    });
    const expenseByCat = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    const jul = revenue || 5200000;
    const monthlyCost = (latestPayroll ? latestPayroll.lines.reduce((s, l) => s + l.gross, 0) : 2600000) + expenseTotal;
    const trend = [
      { m: "Feb", revenue: Math.round(jul * 0.62), expense: Math.round(monthlyCost * 0.82) },
      { m: "Mar", revenue: Math.round(jul * 0.71), expense: Math.round(monthlyCost * 0.86) },
      { m: "Apr", revenue: Math.round(jul * 0.78), expense: Math.round(monthlyCost * 0.9) },
      { m: "May", revenue: Math.round(jul * 0.86), expense: Math.round(monthlyCost * 0.93) },
      { m: "Jun", revenue: Math.round(jul * 0.93), expense: Math.round(monthlyCost * 0.97) },
      { m: "Jul", revenue: jul, expense: monthlyCost },
    ];

    return {
      headcount,
      pendingLeave,
      pendingExpenses,
      monthlyPayroll,
      outstanding,
      revenue,
      expenseTotal,
      deptData,
      expenseByCat,
      trend,
    };
  }, [db]);

  // Employee self-service view
  if (isEmployee && user) {
    const myLeave = db.leave.filter((l) => l.employeeId === user.id);
    const myExpenses = db.expenses.filter((x) => x.employeeId === user.id);
    const done = user.onboarding.filter((t) => t.done).length;
    return (
      <div>
        <PageHeader title={`Hi, ${user.name.split(" ")[0]} 👋`} subtitle="Here's your self-service overview." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={CalendarClock} label="Leave balance (days)" value={user.leaveBalance} tone="#6d5ef6" />
          <Stat icon={CalendarClock} label="Leave requests" value={myLeave.length} tone="#12d8b6" />
          <Stat icon={Receipt} label="My expense claims" value={myExpenses.length} tone="#f59e0b" />
          <Stat
            icon={TrendingUp}
            label="Onboarding"
            value={user.onboarding.length ? `${Math.round((done / user.onboarding.length) * 100)}%` : "—"}
            tone="#3b82f6"
          />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Your onboarding</h3>
            {user.onboarding.length ? (
              <>
                <Progress value={(done / user.onboarding.length) * 100} />
                <ul className="mt-4 space-y-2">
                  {user.onboarding.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className={t.done ? "text-emerald-500" : "text-slate-300"}>{t.done ? "✓" : "○"}</span>
                      <span className={t.done ? "text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"}>{t.label}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-slate-400">No onboarding checklist yet.</p>
            )}
          </Card>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Quick actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/leave" className="btn-ghost">Request leave</Link>
              <Link to="/expenses" className="btn-ghost">Submit expense</Link>
              <Link to="/performance" className="btn-ghost">My reviews</Link>
              <Link to="/settings" className="btn-ghost">Settings</Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" subtitle="Live view of your people and finances." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat icon={Users} label="Headcount" value={m.headcount} tone="#6d5ef6" />
        <Stat icon={CalendarClock} label="Pending leave" value={m.pendingLeave} tone="#12d8b6" />
        <Stat icon={Wallet} label="Monthly payroll" value={inr(m.monthlyPayroll)} tone="#f59e0b" />
        <Stat icon={FileText} label="Outstanding" value={inr(m.outstanding)} tone="#ef4444" />
        <Stat icon={Receipt} label="Pending expenses" value={m.pendingExpenses} tone="#3b82f6" />
        <Stat icon={TrendingUp} label="Revenue (paid)" value={inr(m.revenue)} tone="#10b981" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={m.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="m" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#6d5ef6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#12d8b6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Expense breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={m.expenseByCat} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {m.expenseByCat.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => inr(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Headcount by department</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={m.deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6d5ef6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent activity</h3>
            <Link to="/reports" className="flex items-center gap-1 text-xs font-semibold text-brand-500">
              View reports <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="space-y-3">
            {db.activity.slice(0, 7).map((a) => (
              <li key={a.id} className="flex items-center gap-3 text-sm">
                <Avatar name={a.actor} size={30} color={a.kind === "finance" ? "#12d8b6" : a.kind === "system" ? "#94a3b8" : "#6d5ef6"} />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{a.actor}</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">{a.text}</span>
                </div>
                <span className="text-xs text-slate-400">{relTime(a.at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
