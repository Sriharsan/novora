import { useMemo, useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { shortDate } from "../lib/format";
import type { LeaveType } from "../lib/types";
import { Card, PageHeader, Avatar, StatusBadge, Modal, Field, EmptyState } from "../components/ui";

function daysBetween(a: string, b: string) {
  const d = (new Date(b).getTime() - new Date(a).getTime()) / 86400000;
  return Math.max(1, Math.round(d) + 1);
}

export default function Leave() {
  const { db, addLeave, setLeaveStatus } = useData();
  const { user } = useAuth();
  const canApprove = user?.role === "admin" || user?.role === "manager";

  const [tab, setTab] = useState<"requests" | "attendance">("requests");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type: "annual" as LeaveType, from: "", to: "", reason: "" });

  const empName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? "—";
  const empColor = (id: string) => db.employees.find((e) => e.id === id)?.avatarColor;

  const visibleLeave = useMemo(() => {
    if (!user) return [];
    if (canApprove) return db.leave;
    return db.leave.filter((l) => l.employeeId === user.id);
  }, [db.leave, user, canApprove]);

  const submit = () => {
    if (!user || !form.from || !form.to) return;
    addLeave({
      employeeId: user.id,
      type: form.type,
      from: form.from,
      to: form.to,
      days: daysBetween(form.from, form.to),
      reason: form.reason,
    });
    setModal(false);
    setForm({ type: "annual", from: "", to: "", reason: "" });
  };

  return (
    <div>
      <PageHeader
        title="Leave & Attendance"
        subtitle={canApprove ? "Approve requests and track attendance." : "Request time off and view your history."}
        action={
          <button className="btn-primary" onClick={() => setModal(true)}>
            <Plus size={16} /> Request leave
          </button>
        }
      />

      {user && (
        <Card className="mb-6 flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs text-slate-400">Your leave balance</div>
            <div className="text-3xl font-bold text-brand-500">{user.leaveBalance} <span className="text-base text-slate-400">days</span></div>
          </div>
          <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
          <div className="flex gap-6 text-sm">
            <div><div className="text-lg font-bold">{visibleLeave.filter((l) => l.status === "pending").length}</div><div className="text-slate-400">Pending</div></div>
            <div><div className="text-lg font-bold">{visibleLeave.filter((l) => l.status === "approved").length}</div><div className="text-slate-400">Approved</div></div>
            <div><div className="text-lg font-bold">{visibleLeave.filter((l) => l.status === "rejected").length}</div><div className="text-slate-400">Rejected</div></div>
          </div>
        </Card>
      )}

      <div className="mb-4 flex gap-2">
        {(["requests", "attendance"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${tab === t ? "bg-brand-500 text-white" : "btn-ghost"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "requests" ? (
        <Card className="!p-0 overflow-hidden">
          {visibleLeave.length === 0 ? (
            <div className="p-6"><EmptyState title="No leave requests yet" hint="Click 'Request leave' to add one." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Employee</th><th className="p-4">Type</th><th className="p-4">Dates</th>
                    <th className="p-4">Days</th><th className="p-4">Reason</th><th className="p-4">Status</th>
                    {canApprove && <th className="p-4 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {visibleLeave.map((l) => (
                    <tr key={l.id} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={empName(l.employeeId)} color={empColor(l.employeeId)} size={30} />
                          <span className="font-medium">{empName(l.employeeId)}</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{l.type}</td>
                      <td className="p-4 text-slate-500">{shortDate(l.from)} → {shortDate(l.to)}</td>
                      <td className="p-4">{l.days}</td>
                      <td className="p-4 text-slate-500">{l.reason || "—"}</td>
                      <td className="p-4"><StatusBadge status={l.status} /></td>
                      {canApprove && (
                        <td className="p-4">
                          {l.status === "pending" ? (
                            <div className="flex justify-end gap-1">
                              <button className="rounded-lg bg-emerald-100 p-2 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/15" onClick={() => setLeaveStatus(l.id, "approved", user!.name)} title="Approve"><Check size={15} /></button>
                              <button className="rounded-lg bg-rose-100 p-2 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/15" onClick={() => setLeaveStatus(l.id, "rejected", user!.name)} title="Reject"><X size={15} /></button>
                            </div>
                          ) : (
                            <div className="text-right text-xs text-slate-400">—</div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <tr><th className="p-4">Employee</th><th className="p-4">Date</th><th className="p-4">Clock in</th><th className="p-4">Clock out</th><th className="p-4">Hours</th></tr>
              </thead>
              <tbody>
                {db.attendance.slice(0, 30).map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="p-4"><div className="flex items-center gap-2"><Avatar name={empName(a.employeeId)} color={empColor(a.employeeId)} size={28} /><span className="font-medium">{empName(a.employeeId)}</span></div></td>
                    <td className="p-4 text-slate-500">{shortDate(a.date)}</td>
                    <td className="p-4">{a.clockIn}</td>
                    <td className="p-4">{a.clockOut}</td>
                    <td className="p-4 font-medium">{a.hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Request leave">
        <div className="space-y-4">
          <Field label="Leave type">
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LeaveType })}>
              <option value="annual">Annual</option><option value="sick">Sick</option>
              <option value="casual">Casual</option><option value="unpaid">Unpaid</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="From"><input type="date" className="input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></Field>
            <Field label="To"><input type="date" className="input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></Field>
          </div>
          {form.from && form.to && <p className="text-xs text-slate-500">Duration: <b>{daysBetween(form.from, form.to)} day(s)</b></p>}
          <Field label="Reason"><textarea className="input" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit} disabled={!form.from || !form.to}>Submit request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
