import { useMemo, useState } from "react";
import { Plus, Star } from "lucide-react";
import { useData } from "../lib/store";
import { useAuth } from "../lib/auth";
import { shortDate } from "../lib/format";
import { Card, PageHeader, Avatar, Modal, Field, EmptyState, Progress } from "../components/ui";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} className={i <= n ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"} />
      ))}
    </div>
  );
}

export default function Performance() {
  const { db, addReview } = useData();
  const { user } = useAuth();
  const canReview = user?.role === "admin" || user?.role === "manager";
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ employeeId: "", cycle: "H2 2026", rating: 4, summary: "", goal: "" });

  const empName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? "—";
  const empColor = (id: string) => db.employees.find((e) => e.id === id)?.avatarColor;
  const empTitle = (id: string) => db.employees.find((e) => e.id === id)?.title ?? "";

  const visible = useMemo(() => {
    if (!user) return [];
    if (canReview) return db.reviews;
    return db.reviews.filter((r) => r.employeeId === user.id);
  }, [db.reviews, user, canReview]);

  const submit = () => {
    if (!form.employeeId || !form.summary) return;
    addReview({
      employeeId: form.employeeId,
      cycle: form.cycle,
      rating: form.rating,
      summary: form.summary,
      reviewer: user!.name,
      goals: form.goal ? [{ id: `g-${Date.now()}`, title: form.goal, progress: 0 }] : [],
    });
    setModal(false);
    setForm({ employeeId: "", cycle: "H2 2026", rating: 4, summary: "", goal: "" });
  };

  return (
    <div>
      <PageHeader
        title="Performance"
        subtitle={canReview ? "Run appraisal cycles and track goals." : "Your reviews and goals."}
        action={canReview && <button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New review</button>}
      />

      {visible.length === 0 ? (
        <EmptyState title="No reviews yet" hint={canReview ? "Create the first review." : "Your reviews will appear here."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center gap-3">
                <Avatar name={empName(r.employeeId)} color={empColor(r.employeeId)} size={44} />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 dark:text-white">{empName(r.employeeId)}</div>
                  <div className="text-xs text-slate-400">{empTitle(r.employeeId)} · {r.cycle}</div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{r.summary}</p>
              {r.goals.length > 0 && (
                <div className="mt-4 space-y-3">
                  {r.goals.map((g) => (
                    <div key={g.id}>
                      <div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-600 dark:text-slate-300">{g.title}</span><span className="text-slate-400">{g.progress}%</span></div>
                      <Progress value={g.progress} />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Reviewer: {r.reviewer}</span><span>{shortDate(r.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New performance review">
        <div className="space-y-4">
          <Field label="Employee">
            <select className="input" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select employee…</option>
              {db.employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.title}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cycle"><input className="input" value={form.cycle} onChange={(e) => setForm({ ...form, cycle: e.target.value })} /></Field>
            <Field label="Rating">
              <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Summary"><textarea className="input" rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
          <Field label="Goal (optional)"><input className="input" placeholder="e.g. Ship feature X" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit} disabled={!form.employeeId || !form.summary}>Save review</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
