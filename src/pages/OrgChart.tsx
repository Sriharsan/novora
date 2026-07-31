import { useMemo } from "react";
import { useData } from "../lib/store";
import type { Employee } from "../lib/types";
import { PageHeader, Avatar, Badge } from "../components/ui";

function Node({ emp, reports, all }: { emp: Employee; reports: Record<string, Employee[]>; all: Employee[] }) {
  const kids = reports[emp.id] || [];
  return (
    <div className="flex flex-col items-center">
      <div className="card relative flex w-52 flex-col items-center gap-2 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-glow">
        <Avatar name={emp.name} color={emp.avatarColor} size={48} />
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{emp.title}</div>
        </div>
        <Badge tone={emp.role === "admin" ? "violet" : emp.role === "manager" ? "blue" : "slate"}>{emp.role}</Badge>
      </div>

      {kids.length > 0 && (
        <>
          <div className="h-6 w-px bg-slate-300 dark:bg-white/15" />
          <div className="flex flex-wrap items-start justify-center gap-6 border-t border-transparent">
            {kids.map((k) => (
              <div key={k.id} className="relative flex flex-col items-center">
                <div className="absolute -top-6 h-6 w-px bg-slate-300 dark:bg-white/15" />
                <Node emp={k} reports={reports} all={all} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChart() {
  const { db } = useData();

  const { roots, reports } = useMemo(() => {
    const reports: Record<string, Employee[]> = {};
    db.employees.forEach((e) => {
      if (e.managerId) (reports[e.managerId] = reports[e.managerId] || []).push(e);
    });
    const roots = db.employees.filter((e) => !e.managerId);
    return { roots, reports };
  }, [db.employees]);

  return (
    <div>
      <PageHeader title="Org Chart" subtitle="Reporting structure across the company." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {db.departments.map((d) => {
          const count = db.employees.filter((e) => e.departmentId === d.id).length;
          const head = db.employees.find((e) => e.id === d.head);
          return (
            <div key={d.id} className="card p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">{d.name}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{count}</div>
              <div className="mt-1 text-xs text-slate-500">Head: {head?.name ?? "—"}</div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-8">
        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-max justify-center gap-10 px-4">
            {roots.map((r) => (
              <Node key={r.id} emp={r} reports={reports} all={db.employees} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-50 to-transparent dark:from-ink-950" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-50 to-transparent dark:from-ink-950" />
      </div>
    </div>
  );
}
