import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  Database,
  Employee,
  Invoice,
  Expense,
  LeaveRequest,
  PayrollRun,
  PerformanceReview,
  Activity,
} from "./types";
import { makeSeed } from "./seed";
import { api, apiConfigured, getToken } from "./api";

const KEY = "novora.db.v2";

function load(): Database {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Database;
  } catch {
    /* ignore */
  }
  const seed = makeSeed();
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

interface DataContextValue {
  db: Database;
  live: boolean;
  reloadFromApi: () => Promise<void>;
  addActivity: (a: Omit<Activity, "id" | "at">) => void;
  addEmployee: (e: Omit<Employee, "id" | "avatarColor">) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addLeave: (l: Omit<LeaveRequest, "id" | "createdAt" | "status">) => void;
  setLeaveStatus: (id: string, status: LeaveRequest["status"], actor: string) => void;
  addPayroll: (p: PayrollRun) => void;
  setPayrollStatus: (id: string, status: PayrollRun["status"], actor: string) => void;
  addReview: (r: Omit<PerformanceReview, "id" | "createdAt">) => void;
  addInvoice: (i: Omit<Invoice, "id">) => void;
  setInvoiceStatus: (id: string, status: Invoice["status"], actor: string) => void;
  removeInvoice: (id: string) => void;
  addExpense: (x: Omit<Expense, "id" | "status">) => void;
  setExpenseStatus: (id: string, status: Expense["status"], actor: string) => void;
  resetDemo: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<Database>(() => load());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(db));
  }, [db]);

  const reloadFromApi = async () => {
    if (!apiConfigured || !getToken()) return;
    try {
      const state = await api.getState();
      setDb(state);
    } catch {
      /* keep local cache if the API is unreachable */
    }
  };

  // On first load (and whenever a token already exists), hydrate from the backend.
  useEffect(() => {
    void reloadFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<DataContextValue>(() => {
    const now = () => new Date().toISOString();

    const makeActivity = (a: Omit<Activity, "id" | "at">): Activity => ({ id: uid("act"), at: now(), ...a });
    const withActivity = (base: Database, act: Activity): Database => ({
      ...base,
      activity: [act, ...base.activity].slice(0, 40),
    });
    const syncActivity = (act: Activity) => {
      if (apiConfigured) api.put("activity", act.id, act);
    };

    return {
      db,
      live: apiConfigured,
      reloadFromApi,

      addActivity: (a) => {
        const act = makeActivity(a);
        syncActivity(act);
        setDb((d) => withActivity(d, act));
      },

      addEmployee: (e) => {
        const emp: Employee = { ...e, id: uid("e"), avatarColor: "#6d5ef6" } as Employee;
        if (apiConfigured) api.put("employees", emp.id, emp);
        setDb((d) => {
          const act = makeActivity({
            actor: "Admin",
            text: `added ${emp.name} to ${d.departments.find((x) => x.id === emp.departmentId)?.name ?? "the team"}`,
            kind: "hr",
          });
          syncActivity(act);
          return withActivity({ ...d, employees: [...d.employees, emp] }, act);
        });
      },
      updateEmployee: (id, patch) => {
        if (apiConfigured) api.patch("employees", id, patch);
        setDb((d) => ({ ...d, employees: d.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
      },
      removeEmployee: (id) => {
        if (apiConfigured) api.del("employees", id);
        setDb((d) => ({ ...d, employees: d.employees.filter((e) => e.id !== id) }));
      },

      addLeave: (l) => {
        const req: LeaveRequest = { ...l, id: uid("l"), status: "pending", createdAt: now() };
        if (apiConfigured) api.put("leave", req.id, req);
        setDb((d) => {
          const emp = d.employees.find((e) => e.id === l.employeeId);
          const act = makeActivity({ actor: emp?.name ?? "Employee", text: `requested ${l.days} day(s) ${l.type} leave`, kind: "hr" });
          syncActivity(act);
          return withActivity({ ...d, leave: [req, ...d.leave] }, act);
        });
      },
      setLeaveStatus: (id, status, actor) => {
        if (apiConfigured) api.put("leave", id, { id, status });
        setDb((d) => {
          const req = d.leave.find((l) => l.id === id);
          let employees = d.employees;
          if (req && status === "approved" && req.status !== "approved") {
            employees = d.employees.map((e) => {
              if (e.id !== req.employeeId) return e;
              const next = { ...e, leaveBalance: Math.max(0, e.leaveBalance - req.days) };
              if (apiConfigured) api.patch("employees", e.id, { leaveBalance: next.leaveBalance });
              return next;
            });
          }
          const emp = d.employees.find((e) => e.id === req?.employeeId);
          const act = makeActivity({ actor, text: `${status} leave for ${emp?.name ?? "an employee"}`, kind: "hr" });
          syncActivity(act);
          return withActivity({ ...d, employees, leave: d.leave.map((l) => (l.id === id ? { ...l, status } : l)) }, act);
        });
      },

      addPayroll: (p) => {
        if (apiConfigured) api.put("payroll", p.id, p);
        setDb((d) => {
          const act = makeActivity({ actor: "System", text: `generated ${p.period} payroll run`, kind: "system" });
          syncActivity(act);
          return withActivity({ ...d, payroll: [p, ...d.payroll] }, act);
        });
      },
      setPayrollStatus: (id, status, actor) => {
        if (apiConfigured) api.put("payroll", id, { id, status });
        setDb((d) => {
          const run = d.payroll.find((p) => p.id === id);
          const act = makeActivity({ actor, text: `${status} payroll ${run?.period ?? ""}`, kind: "finance" });
          syncActivity(act);
          return withActivity({ ...d, payroll: d.payroll.map((p) => (p.id === id ? { ...p, status } : p)) }, act);
        });
      },

      addReview: (r) => {
        const rev: PerformanceReview = { ...r, id: uid("r"), createdAt: now() };
        if (apiConfigured) api.put("reviews", rev.id, rev);
        setDb((d) => {
          const emp = d.employees.find((e) => e.id === r.employeeId);
          const act = makeActivity({ actor: r.reviewer, text: `submitted a review for ${emp?.name ?? "an employee"}`, kind: "hr" });
          syncActivity(act);
          return withActivity({ ...d, reviews: [rev, ...d.reviews] }, act);
        });
      },

      addInvoice: (i) => {
        const inv: Invoice = { ...i, id: uid("i") };
        if (apiConfigured) api.put("invoices", inv.id, inv);
        setDb((d) => {
          const act = makeActivity({ actor: "Finance", text: `created invoice ${inv.number}`, kind: "finance" });
          syncActivity(act);
          return withActivity({ ...d, invoices: [inv, ...d.invoices] }, act);
        });
      },
      setInvoiceStatus: (id, status, actor) => {
        if (apiConfigured) api.put("invoices", id, { id, status });
        setDb((d) => {
          const inv = d.invoices.find((i) => i.id === id);
          const act = makeActivity({ actor, text: `marked invoice ${inv?.number ?? ""} as ${status}`, kind: "finance" });
          syncActivity(act);
          return withActivity({ ...d, invoices: d.invoices.map((i) => (i.id === id ? { ...i, status } : i)) }, act);
        });
      },
      removeInvoice: (id) => {
        if (apiConfigured) api.del("invoices", id);
        setDb((d) => ({ ...d, invoices: d.invoices.filter((i) => i.id !== id) }));
      },

      addExpense: (x) => {
        const exp: Expense = { ...x, id: uid("x"), status: "pending" };
        if (apiConfigured) api.put("expenses", exp.id, exp);
        setDb((d) => {
          const emp = d.employees.find((e) => e.id === x.employeeId);
          const act = makeActivity({ actor: emp?.name ?? "Employee", text: `submitted a ${x.category} expense claim`, kind: "finance" });
          syncActivity(act);
          return withActivity({ ...d, expenses: [exp, ...d.expenses] }, act);
        });
      },
      setExpenseStatus: (id, status, actor) => {
        if (apiConfigured) api.put("expenses", id, { id, status });
        setDb((d) => {
          const exp = d.expenses.find((x) => x.id === id);
          const emp = d.employees.find((e) => e.id === exp?.employeeId);
          const act = makeActivity({ actor, text: `${status} expense for ${emp?.name ?? "an employee"}`, kind: "finance" });
          syncActivity(act);
          return withActivity({ ...d, expenses: d.expenses.map((x) => (x.id === id ? { ...x, status } : x)) }, act);
        });
      },

      resetDemo: () => {
        const seed = makeSeed();
        localStorage.setItem(KEY, JSON.stringify(seed));
        setDb(seed);
      },
    };
  }, [db]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
