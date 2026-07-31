import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Network,
  CalendarClock,
  Wallet,
  Target,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { useData } from "../lib/store";
import { useTheme } from "../lib/theme";
import { relTime } from "../lib/format";
import type { Role } from "../lib/types";
import { Avatar } from "./ui";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: Role[];
  group: string;
}

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "employee"], group: "Overview" },
  { to: "/employees", label: "Employees", icon: Users, roles: ["admin", "manager"], group: "People" },
  { to: "/org", label: "Org Chart", icon: Network, roles: ["admin", "manager"], group: "People" },
  { to: "/leave", label: "Leave & Attendance", icon: CalendarClock, roles: ["admin", "manager", "employee"], group: "People" },
  { to: "/payroll", label: "Payroll", icon: Wallet, roles: ["admin", "manager"], group: "People" },
  { to: "/performance", label: "Performance", icon: Target, roles: ["admin", "manager", "employee"], group: "People" },
  { to: "/invoices", label: "Invoices", icon: FileText, roles: ["admin", "manager"], group: "Finance" },
  { to: "/expenses", label: "Expenses", icon: Receipt, roles: ["admin", "manager", "employee"], group: "Finance" },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin", "manager"], group: "Finance" },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin", "manager", "employee"], group: "System" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 font-extrabold text-white">
        N
      </div>
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Novora</div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">HR &amp; Finance</div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { db } = useData();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const loc = useLocation();

  const canApprove = user?.role === "admin" || user?.role === "manager";
  const pendingLeave = db.leave.filter((l) => l.status === "pending");
  const pendingExp = db.expenses.filter((x) => x.status === "pending");
  const empName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? "Someone";
  const notifs = canApprove
    ? [
        ...pendingLeave.map((l) => ({ id: l.id, text: `${empName(l.employeeId)} requested ${l.days}d ${l.type} leave`, at: l.createdAt, to: "/leave" })),
        ...pendingExp.map((x) => ({ id: x.id, text: `${empName(x.employeeId)} submitted a ${x.category} expense`, at: (x as any).date, to: "/expenses" })),
      ]
    : db.activity.filter((a) => a.actor === user?.name).slice(0, 6).map((a) => ({ id: a.id, text: a.text, at: a.at, to: "/" }));
  const notifCount = canApprove ? pendingLeave.length + pendingExp.length : 0;

  const items = NAV.filter((n) => (user ? n.roles.includes(user.role) : false));
  const groups = Array.from(new Set(items.map((i) => i.group)));

  const SidebarInner = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="pt-2">
        <Brand />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto">
        {groups.map((g) => (
          <div key={g}>
            <div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g}</div>
            <div className="space-y-1">
              {items
                .filter((i) => i.group === g)
                .map((i) => {
                  const Icon = i.icon;
                  return (
                    <NavLink
                      key={i.to}
                      to={i.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lift"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                        }`
                      }
                    >
                      <Icon size={18} />
                      {i.label}
                    </NavLink>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>
      {user && (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} color={user.avatarColor} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</div>
              <div className="truncate text-xs capitalize text-slate-400">{user.role}</div>
            </div>
            <button onClick={logout} title="Log out" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur dark:border-white/[0.06] dark:bg-ink-900/60 lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl dark:bg-ink-900">{SidebarInner}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-ink-950/70">
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setMobileOpen(true)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search employees, invoices, expenses…" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                title="Notifications"
              >
                <Bell size={18} />
                {notifCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                    {notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="card absolute right-0 z-50 mt-2 w-80 p-0">
                    <div className="border-b border-slate-200 px-4 py-3 text-sm font-bold dark:border-white/10">
                      Notifications {notifCount > 0 && <span className="text-slate-400">· {notifCount} pending</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-slate-400">You're all caught up 🎉</div>
                      ) : (
                        notifs.map((n) => (
                          <NavLink
                            key={n.id}
                            to={n.to}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.04]"
                          >
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                            <div>
                              <div className="text-slate-700 dark:text-slate-200">{n.text}</div>
                              <div className="text-xs text-slate-400">{n.at ? relTime(n.at) : ""}</div>
                            </div>
                          </NavLink>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            {user && <Avatar name={user.name} color={user.avatarColor} size={32} />}
          </div>
        </header>

        <main key={loc.pathname} className="animate-fade-up mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
