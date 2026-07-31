import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { inr, shortDate } from "../lib/format";
import type { Employee } from "../lib/types";
import { Card, PageHeader, Avatar, StatusBadge, Modal, Field, EmptyState, Progress } from "../components/ui";

const blank = (): Partial<Employee> => ({
  name: "",
  email: "",
  password: "employee123",
  role: "employee",
  title: "",
  departmentId: "d1",
  joinDate: new Date().toISOString().slice(0, 10),
  salary: 1200000,
  status: "onboarding",
  leaveBalance: 20,
});

export default function Employees() {
  const { db, addEmployee, updateEmployee, removeEmployee } = useData();
  const { user } = useAuth();
  const canManage = user?.role === "admin";

  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; data: Partial<Employee> }>(null);
  const [confirmDel, setConfirmDel] = useState<Employee | null>(null);
  const [detail, setDetail] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    return db.employees.filter((e) => {
      const matchQ = (e.name + e.title + e.email).toLowerCase().includes(q.toLowerCase());
      const matchD = dept === "all" || e.departmentId === dept;
      return matchQ && matchD;
    });
  }, [db.employees, q, dept]);

  const deptName = (id: string) => db.departments.find((d) => d.id === id)?.name ?? "—";

  const save = () => {
    if (!modal) return;
    const d = modal.data;
    if (!d.name || !d.email) return;
    if (modal.mode === "add") {
      addEmployee({
        name: d.name!, email: d.email!, password: d.password || "employee123", role: d.role as any,
        title: d.title || "", departmentId: d.departmentId!, joinDate: d.joinDate!, salary: Number(d.salary) || 0,
        status: d.status as any, leaveBalance: Number(d.leaveBalance) || 20,
        onboarding: [
          { label: "Sign offer letter", done: false },
          { label: "Submit ID & bank details", done: false },
          { label: "IT setup & accounts", done: false },
          { label: "Assign buddy", done: false },
          { label: "First-week orientation", done: false },
        ],
      });
    } else {
      updateEmployee(d.id!, { ...d, salary: Number(d.salary), leaveBalance: Number(d.leaveBalance) });
    }
    setModal(null);
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${db.employees.length} people across ${db.departments.length} departments`}
        action={
          canManage && (
            <button className="btn-primary" onClick={() => setModal({ mode: "add", data: blank() })}>
              <Plus size={16} /> Add employee
            </button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search name, title, email…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input max-w-[200px]" value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="all">All departments</option>
          {db.departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <Card className="!p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6"><EmptyState title="No employees found" hint="Try a different search or filter." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4">Status</th>
                  {canManage && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                    onClick={() => setDetail(e)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={e.name} color={e.avatarColor} />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-100">{e.name}</div>
                          <div className="text-xs text-slate-400">{e.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{deptName(e.departmentId)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{shortDate(e.joinDate)}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-200">{inr(e.salary)}</td>
                    <td className="p-4"><StatusBadge status={e.status} /></td>
                    {canManage && (
                      <td className="p-4">
                        <div className="flex justify-end gap-1" onClick={(ev) => ev.stopPropagation()}>
                          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-500 dark:hover:bg-slate-700" onClick={() => setModal({ mode: "edit", data: { ...e } })}>
                            <Pencil size={15} />
                          </button>
                          <button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" onClick={() => setConfirmDel(e)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / edit modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add employee" : "Edit employee"}>
        {modal && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name"><input className="input" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} /></Field>
            <Field label="Title"><input className="input" value={modal.data.title || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })} /></Field>
            <Field label="Email"><input className="input" value={modal.data.email || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, email: e.target.value } })} /></Field>
            <Field label="Role">
              <select className="input" value={modal.data.role} onChange={(e) => setModal({ ...modal, data: { ...modal.data, role: e.target.value as any } })}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field label="Department">
              <select className="input" value={modal.data.departmentId} onChange={(e) => setModal({ ...modal, data: { ...modal.data, departmentId: e.target.value } })}>
                {db.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="input" value={modal.data.status} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value as any } })}>
                <option value="onboarding">Onboarding</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
            <Field label="Join date"><input type="date" className="input" value={modal.data.joinDate || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, joinDate: e.target.value } })} /></Field>
            <Field label="Annual salary (₹)"><input type="number" className="input" value={modal.data.salary || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, salary: Number(e.target.value) } })} /></Field>
            <div className="col-span-2 mt-2 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={save}>{modal.mode === "add" ? "Add employee" : "Save changes"}</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Remove employee?">
        {confirmDel && (
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This will permanently remove <b>{confirmDel.name}</b> from the directory. This can't be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn bg-rose-500 text-white hover:bg-rose-600" onClick={() => { removeEmployee(confirmDel.id); setConfirmDel(null); }}>Remove</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail drawer */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Employee profile" wide>
        {detail && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={detail.name} color={detail.avatarColor} size={56} />
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{detail.name}</div>
                <div className="text-sm text-slate-500">{detail.title} · {deptName(detail.departmentId)}</div>
              </div>
              <div className="ml-auto"><StatusBadge status={detail.status} /></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div><div className="text-xs text-slate-400">Email</div><div className="font-medium">{detail.email}</div></div>
              <div><div className="text-xs text-slate-400">Joined</div><div className="font-medium">{shortDate(detail.joinDate)}</div></div>
              <div><div className="text-xs text-slate-400">Salary</div><div className="font-medium">{inr(detail.salary)}</div></div>
              <div><div className="text-xs text-slate-400">Leave balance</div><div className="font-medium">{detail.leaveBalance} days</div></div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">Onboarding checklist</h4>
                <span className="text-xs text-slate-400">
                  {detail.onboarding.filter((t) => t.done).length}/{detail.onboarding.length} done
                </span>
              </div>
              <Progress value={(detail.onboarding.filter((t) => t.done).length / detail.onboarding.length) * 100} />
              <ul className="mt-3 space-y-2">
                {detail.onboarding.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <button
                      disabled={!canManage}
                      onClick={() => {
                        const next = detail.onboarding.map((x, j) => (j === i ? { ...x, done: !x.done } : x));
                        updateEmployee(detail.id, { onboarding: next });
                        setDetail({ ...detail, onboarding: next });
                      }}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${t.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 dark:border-slate-600"}`}
                    >
                      {t.done ? "✓" : ""}
                    </button>
                    <span className={t.done ? "text-slate-400 line-through" : ""}>{t.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
