import { useState } from "react";
import { Plus, Download, Check, Eye } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { inr, shortDate } from "../lib/format";
import type { PayrollRun } from "../lib/types";
import { Card, PageHeader, StatusBadge, Modal, EmptyState, Avatar } from "../components/ui";

function downloadPayslip(period: string, name: string, line: { gross: number; tax: number; pf: number; net: number }) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Payslip ${name} ${period}</title>
  <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#0f172a}
  .h{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #6d5ef6;padding-bottom:16px}
  .brand{font-size:24px;font-weight:800;color:#6d5ef6}.muted{color:#64748b}
  table{width:100%;border-collapse:collapse;margin-top:24px}td{padding:10px 0;border-bottom:1px solid #e2e8f0}
  .net{font-size:22px;font-weight:800;color:#0bb89b}.r{text-align:right}</style></head>
  <body><div class="h"><div class="brand">Novora</div><div class="muted">Payslip · ${period}</div></div>
  <h2>${name}</h2>
  <table>
  <tr><td>Gross salary</td><td class="r">${inr(line.gross)}</td></tr>
  <tr><td>Income tax (TDS)</td><td class="r">- ${inr(line.tax)}</td></tr>
  <tr><td>Provident fund</td><td class="r">- ${inr(line.pf)}</td></tr>
  <tr><td><b>Net pay</b></td><td class="r net">${inr(line.net)}</td></tr>
  </table>
  <p class="muted" style="margin-top:40px">This is a system-generated payslip from Novora. A TechnovaHub product.</p>
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payslip-${name.replace(/\s/g, "-")}-${period}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Payroll() {
  const { db, addPayroll, setPayrollStatus } = useData();
  const { user } = useAuth();
  const [view, setView] = useState<PayrollRun | null>(null);
  const empName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? "—";
  const empColor = (id: string) => db.employees.find((e) => e.id === id)?.avatarColor;

  const runTotal = (r: PayrollRun) => r.lines.reduce((s, l) => s + l.net, 0);

  const generate = () => {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (db.payroll.some((p) => p.period === period)) {
      alert(`Payroll for ${period} already exists.`);
      return;
    }
    const lines = db.employees
      .filter((e) => e.status === "active")
      .map((e) => {
        const gross = Math.round(e.salary / 12);
        const tax = Math.round(gross * 0.1);
        const pf = Math.round(gross * 0.12);
        return { employeeId: e.id, gross, tax, pf, net: gross - tax - pf };
      });
    addPayroll({ id: `p-${Date.now()}`, period, status: "draft", createdAt: new Date().toISOString(), lines });
  };

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Run monthly payroll and generate payslips."
        action={<button className="btn-primary" onClick={generate}><Plus size={16} /> Generate this month</button>}
      />

      {db.payroll.length === 0 ? (
        <EmptyState title="No payroll runs yet" hint="Generate your first run." />
      ) : (
        <div className="grid gap-4">
          {db.payroll.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15">
                <span className="text-sm font-bold">{r.period.slice(5)}</span>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Payroll · {r.period}</div>
                <div className="text-xs text-slate-400">{r.lines.length} employees · created {shortDate(r.createdAt)}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-bold">{inr(runTotal(r))}</div>
                <div className="text-xs text-slate-400">total net</div>
              </div>
              <StatusBadge status={r.status} />
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => setView(r)}><Eye size={15} /> View</button>
                {r.status === "draft" && <button className="btn-primary" onClick={() => setPayrollStatus(r.id, "approved", user!.name)}><Check size={15} /> Approve</button>}
                {r.status === "approved" && <button className="btn bg-emerald-500 text-white hover:bg-emerald-600" onClick={() => setPayrollStatus(r.id, "paid", user!.name)}>Mark paid</button>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title={`Payslips · ${view?.period ?? ""}`} wide>
        {view && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <tr><th className="p-3">Employee</th><th className="p-3 r">Gross</th><th className="p-3">Tax</th><th className="p-3">PF</th><th className="p-3">Net</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {view.lines.map((l) => (
                  <tr key={l.employeeId} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="p-3"><div className="flex items-center gap-2"><Avatar name={empName(l.employeeId)} color={empColor(l.employeeId)} size={26} /><span className="font-medium">{empName(l.employeeId)}</span></div></td>
                    <td className="p-3">{inr(l.gross)}</td>
                    <td className="p-3 text-rose-500">-{inr(l.tax)}</td>
                    <td className="p-3 text-rose-500">-{inr(l.pf)}</td>
                    <td className="p-3 font-bold text-emerald-600">{inr(l.net)}</td>
                    <td className="p-3"><button className="btn-ghost !px-2 !py-1" onClick={() => downloadPayslip(view.period, empName(l.employeeId), l)}><Download size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
