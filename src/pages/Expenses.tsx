import { useMemo, useState } from "react";
import { Plus, Check, X, Paperclip } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { inr, shortDate } from "../lib/format";
import type { ExpenseCategory } from "../lib/types";
import { Card, PageHeader, Avatar, StatusBadge, Modal, Field, EmptyState } from "../components/ui";

const CATS: ExpenseCategory[] = ["travel", "meals", "software", "office", "training", "other"];

export default function Expenses() {
  const { db, addExpense, setExpenseStatus } = useData();
  const { user } = useAuth();
  const canApprove = user?.role === "admin" || user?.role === "manager";

  const [cat, setCat] = useState("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "travel" as ExpenseCategory,
    description: "",
    amount: 0,
    receiptName: "",
  });

  const empName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? "—";
  const empColor = (id: string) => db.employees.find((e) => e.id === id)?.avatarColor;

  const visible = useMemo(() => {
    if (!user) return [];
    let list = canApprove ? db.expenses : db.expenses.filter((x) => x.employeeId === user.id);
    if (cat !== "all") list = list.filter((x) => x.category === cat);
    return list;
  }, [db.expenses, user, canApprove, cat]);

  const submit = () => {
    if (!user || !form.description || !form.amount) return;
    addExpense({
      employeeId: user.id,
      date: form.date,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      receiptName: form.receiptName || undefined,
    });
    setModal(false);
    setForm({ date: new Date().toISOString().slice(0, 10), category: "travel", description: "", amount: 0, receiptName: "" });
  };

  const pendingTotal = visible.filter((x) => x.status === "pending").reduce((s, x) => s + x.amount, 0);

  return (
    <div>
      <PageHeader
        title="Expenses & Reimbursements"
        subtitle={`${inr(pendingTotal)} awaiting approval`}
        action={<button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Submit claim</button>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setCat("all")} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${cat === "all" ? "bg-brand-500 text-white" : "btn-ghost"}`}>all</button>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${cat === c ? "bg-brand-500 text-white" : "btn-ghost"}`}>{c}</button>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-6"><EmptyState title="No expense claims" hint="Submit one to get started." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <tr><th className="p-4">Employee</th><th className="p-4">Date</th><th className="p-4">Category</th><th className="p-4">Description</th><th className="p-4">Receipt</th><th className="p-4">Amount</th><th className="p-4">Status</th>{canApprove && <th className="p-4 text-right">Action</th>}</tr>
              </thead>
              <tbody>
                {visible.map((x) => (
                  <tr key={x.id} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="p-4"><div className="flex items-center gap-2"><Avatar name={empName(x.employeeId)} color={empColor(x.employeeId)} size={28} /><span className="font-medium">{empName(x.employeeId)}</span></div></td>
                    <td className="p-4 text-slate-500">{shortDate(x.date)}</td>
                    <td className="p-4 capitalize">{x.category}</td>
                    <td className="p-4 text-slate-500">{x.description}</td>
                    <td className="p-4">{x.receiptName ? <span className="inline-flex items-center gap-1 text-xs text-brand-500"><Paperclip size={12} />{x.receiptName}</span> : <span className="text-slate-300">—</span>}</td>
                    <td className="p-4 font-medium">{inr(x.amount)}</td>
                    <td className="p-4"><StatusBadge status={x.status} /></td>
                    {canApprove && (
                      <td className="p-4">
                        {x.status === "pending" ? (
                          <div className="flex justify-end gap-1">
                            <button className="rounded-lg bg-emerald-100 p-2 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/15" onClick={() => setExpenseStatus(x.id, "approved", user!.name)}><Check size={15} /></button>
                            <button className="rounded-lg bg-rose-100 p-2 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/15" onClick={() => setExpenseStatus(x.id, "rejected", user!.name)}><X size={15} /></button>
                          </div>
                        ) : <div className="text-right text-xs text-slate-400">—</div>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Submit expense claim">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date"><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Category">
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
                {CATS.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description"><input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Amount (₹)"><input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></Field>
          <Field label="Receipt">
            <label className="btn-ghost cursor-pointer">
              <Paperclip size={15} /> {form.receiptName || "Attach receipt"}
              <input type="file" className="hidden" onChange={(e) => setForm({ ...form, receiptName: e.target.files?.[0]?.name || "" })} />
            </label>
          </Field>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit} disabled={!form.description || !form.amount}>Submit claim</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
