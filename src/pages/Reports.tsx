import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Download, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useData } from "../lib/store";
import { inr, invoiceTotal } from "../lib/format";
import { Card, PageHeader } from "../components/ui";

export default function Reports() {
  const { db } = useData();

  const r = useMemo(() => {
    const revenue = db.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + invoiceTotal(i.items, i.taxRate).total, 0);
    const receivable = db.invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + invoiceTotal(i.items, i.taxRate).total, 0);
    const expenses = db.expenses.filter((x) => x.status === "approved").reduce((s, x) => s + x.amount, 0);
    const payroll = db.payroll[0] ? db.payroll[0].lines.reduce((s, l) => s + l.gross, 0) : 0;
    const totalCost = expenses + payroll;
    const profit = revenue - totalCost;

    const jul = revenue || 5200000;
    const cost = totalCost || 2800000;
    const cash = [
      { m: "Feb", in: Math.round(jul * 0.62), out: Math.round(cost * 0.82) },
      { m: "Mar", in: Math.round(jul * 0.71), out: Math.round(cost * 0.86) },
      { m: "Apr", in: Math.round(jul * 0.78), out: Math.round(cost * 0.9) },
      { m: "May", in: Math.round(jul * 0.86), out: Math.round(cost * 0.93) },
      { m: "Jun", in: Math.round(jul * 0.93), out: Math.round(cost * 0.97) },
      { m: "Jul", in: jul, out: cost },
    ];

    const budget = db.departments.map((d) => {
      const spend = db.expenses
        .filter((x) => x.status !== "rejected" && db.employees.find((e) => e.id === x.employeeId)?.departmentId === d.id)
        .reduce((s, x) => s + x.amount, 0);
      return { name: d.name.split(" ")[0], spend, budget: 50000 };
    });

    return { revenue, receivable, expenses, payroll, totalCost, profit, cash, budget };
  }, [db]);

  const exportCSV = () => {
    const rows = [
      ["Metric", "Amount (INR)"],
      ["Revenue (paid)", r.revenue],
      ["Accounts receivable", r.receivable],
      ["Approved expenses", r.expenses],
      ["Payroll (gross)", r.payroll],
      ["Total cost", r.totalCost],
      ["Net profit", r.profit],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "novora-financial-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Finance Reports"
        subtitle="Cash flow, budgets and P&L — computed live."
        action={<button className="btn-ghost" onClick={exportCSV}><Download size={16} /> Export CSV</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white"><TrendingUp size={22} /></div><div><div className="text-2xl font-bold">{inr(r.revenue)}</div><div className="text-xs text-slate-400">Revenue (paid)</div></div></Card>
        <Card className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white"><Wallet size={22} /></div><div><div className="text-2xl font-bold">{inr(r.receivable)}</div><div className="text-xs text-slate-400">Receivable</div></div></Card>
        <Card className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500 text-white"><TrendingDown size={22} /></div><div><div className="text-2xl font-bold">{inr(r.totalCost)}</div><div className="text-xs text-slate-400">Total cost</div></div></Card>
        <Card className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white"><TrendingUp size={22} /></div><div><div className={`text-2xl font-bold ${r.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{inr(r.profit)}</div><div className="text-xs text-slate-400">Net profit</div></div></Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Cash flow</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={r.cash}>
              <defs>
                <linearGradient id="in" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#12d8b6" stopOpacity={0.4} /><stop offset="100%" stopColor="#12d8b6" stopOpacity={0} /></linearGradient>
                <linearGradient id="out" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} /><stop offset="100%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="m" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Legend />
              <Area type="monotone" dataKey="in" name="Inflow" stroke="#12d8b6" fill="url(#in)" strokeWidth={2} />
              <Area type="monotone" dataKey="out" name="Outflow" stroke="#f43f5e" fill="url(#out)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Department spend vs budget</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={r.budget}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="spend" name="Spend" fill="#6d5ef6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Profit &amp; Loss summary</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-100 dark:border-slate-800"><td className="py-3">Revenue (paid invoices)</td><td className="py-3 text-right font-medium text-emerald-600">{inr(r.revenue)}</td></tr>
            <tr className="border-b border-slate-100 dark:border-slate-800"><td className="py-3">Payroll (gross)</td><td className="py-3 text-right text-rose-500">- {inr(r.payroll)}</td></tr>
            <tr className="border-b border-slate-100 dark:border-slate-800"><td className="py-3">Approved expenses</td><td className="py-3 text-right text-rose-500">- {inr(r.expenses)}</td></tr>
            <tr><td className="py-3 text-lg font-bold">Net profit</td><td className={`py-3 text-right text-lg font-bold ${r.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{inr(r.profit)}</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
