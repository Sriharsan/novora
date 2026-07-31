import { useMemo, useState } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { inr, shortDate, invoiceTotal } from "../lib/format";
import type { Invoice, InvoiceItem } from "../lib/types";
import { Card, PageHeader, StatusBadge, Modal, Field, EmptyState } from "../components/ui";

function downloadInvoice(inv: Invoice, clientName: string) {
  const { sub, tax, total } = invoiceTotal(inv.items, inv.taxRate);
  const rows = inv.items
    .map((it) => `<tr><td>${it.description}</td><td class="r">${it.qty}</td><td class="r">${inr(it.rate)}</td><td class="r">${inr(it.qty * it.rate)}</td></tr>`)
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${inv.number}</title>
  <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#0f172a}
  .h{display:flex;justify-content:space-between;border-bottom:3px solid #6d5ef6;padding-bottom:16px}
  .brand{font-size:24px;font-weight:800;color:#6d5ef6}.muted{color:#64748b;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:24px}th,td{padding:10px;border-bottom:1px solid #e2e8f0;text-align:left}
  th{background:#f8fafc;font-size:12px;text-transform:uppercase;color:#64748b}.r{text-align:right}
  .tot{margin-top:20px;margin-left:auto;width:260px}.tot div{display:flex;justify-content:space-between;padding:6px 0}
  .grand{font-size:20px;font-weight:800;color:#0bb89b;border-top:2px solid #0f172a;margin-top:6px;padding-top:10px}</style></head>
  <body><div class="h"><div><div class="brand">Novora</div><div class="muted">A TechnovaHub product</div></div>
  <div style="text-align:right"><div style="font-size:20px;font-weight:700">INVOICE</div><div class="muted">${inv.number}</div></div></div>
  <div style="margin-top:20px"><div class="muted">Billed to</div><div style="font-weight:600">${clientName}</div>
  <div class="muted">Issued ${shortDate(inv.issueDate)} · Due ${shortDate(inv.dueDate)}</div></div>
  <table><tr><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr>${rows}</table>
  <div class="tot"><div><span>Subtotal</span><span>${inr(sub)}</span></div>
  <div><span>Tax (${inv.taxRate}%)</span><span>${inr(tax)}</span></div>
  <div class="grand"><span>Total</span><span>${inr(total)}</span></div></div></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${inv.number}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

const emptyItem = (): InvoiceItem => ({ description: "", qty: 1, rate: 0 });

export default function Invoices() {
  const { db, addInvoice, setInvoiceStatus, removeInvoice } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    clientId: db.clients[0]?.id ?? "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    taxRate: 18,
    items: [emptyItem()],
  });

  const clientName = (id: string) => db.clients.find((c) => c.id === id)?.name ?? "—";
  const nextNumber = `NOV-${1000 + db.invoices.length + 1}`;

  const filtered = useMemo(
    () => (filter === "all" ? db.invoices : db.invoices.filter((i) => i.status === filter)),
    [db.invoices, filter]
  );

  const preview = invoiceTotal(form.items, form.taxRate);

  const submit = () => {
    if (!form.clientId || form.items.every((i) => !i.description)) return;
    addInvoice({
      number: nextNumber,
      clientId: form.clientId,
      issueDate: form.issueDate,
      dueDate: form.dueDate || form.issueDate,
      items: form.items.filter((i) => i.description),
      taxRate: Number(form.taxRate),
      status: "unpaid",
    });
    setModal(false);
    setForm({ clientId: db.clients[0]?.id ?? "", issueDate: new Date().toISOString().slice(0, 10), dueDate: "", taxRate: 18, items: [emptyItem()] });
  };

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle={`${db.invoices.length} invoices · ${inr(db.invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + invoiceTotal(i.items, i.taxRate).total, 0))} outstanding`}
        action={<button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New invoice</button>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "paid", "unpaid", "overdue"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${filter === f ? "bg-brand-500 text-white" : "btn-ghost"}`}>{f}</button>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6"><EmptyState title="No invoices" hint="Create one to get started." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <tr><th className="p-4">Invoice</th><th className="p-4">Client</th><th className="p-4">Issued</th><th className="p-4">Due</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const t = invoiceTotal(inv.items, inv.taxRate);
                  return (
                    <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="p-4 font-semibold text-brand-600 dark:text-brand-300">{inv.number}</td>
                      <td className="p-4">{clientName(inv.clientId)}</td>
                      <td className="p-4 text-slate-500">{shortDate(inv.issueDate)}</td>
                      <td className="p-4 text-slate-500">{shortDate(inv.dueDate)}</td>
                      <td className="p-4 font-medium">{inr(t.total)}</td>
                      <td className="p-4">
                        <select
                          value={inv.status}
                          onChange={(e) => setInvoiceStatus(inv.id, e.target.value as any, user!.name)}
                          className="cursor-pointer rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-xs font-semibold capitalize dark:border-slate-700"
                        >
                          <option value="unpaid">unpaid</option><option value="paid">paid</option><option value="overdue">overdue</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-500 dark:hover:bg-slate-700" onClick={() => downloadInvoice(inv, clientName(inv.clientId))} title="Download"><Download size={15} /></button>
                          <button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" onClick={() => removeInvoice(inv.id)} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={`New invoice · ${nextNumber}`} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Client">
              <select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                {db.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Issue date"><input type="date" className="input" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} /></Field>
            <Field label="Due date"><input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
            <Field label="Tax %"><input type="number" className="input" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} /></Field>
          </div>

          <div>
            <label className="label">Line items</label>
            <div className="space-y-2">
              {form.items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <input className="input col-span-6" placeholder="Description" value={it.description} onChange={(e) => { const items = [...form.items]; items[idx] = { ...it, description: e.target.value }; setForm({ ...form, items }); }} />
                  <input type="number" className="input col-span-2" placeholder="Qty" value={it.qty} onChange={(e) => { const items = [...form.items]; items[idx] = { ...it, qty: Number(e.target.value) }; setForm({ ...form, items }); }} />
                  <input type="number" className="input col-span-3" placeholder="Rate" value={it.rate} onChange={(e) => { const items = [...form.items]; items[idx] = { ...it, rate: Number(e.target.value) }; setForm({ ...form, items }); }} />
                  <button className="col-span-1 rounded-lg text-slate-400 hover:text-rose-500" onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })}>✕</button>
                </div>
              ))}
            </div>
            <button className="btn-ghost mt-2 !py-1.5 text-xs" onClick={() => setForm({ ...form, items: [...form.items, emptyItem()] })}><Plus size={14} /> Add line</button>
          </div>

          <div className="ml-auto w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{inr(preview.sub)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Tax ({form.taxRate}%)</span><span>{inr(preview.tax)}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-base font-bold text-emerald-600 dark:border-slate-700"><span>Total</span><span>{inr(preview.total)}</span></div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit}>Create invoice</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
