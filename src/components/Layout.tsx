import React, { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { useNotifications } from "../lib/notifications";
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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 font-extrabold text-white shadow-lift">
        N
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Novora</div>
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
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const emps = db.employees
      .filter((e) => `${e.name} ${e.email} ${e.title}`.toLowerCase().includes(term))
      .slice(0, 4)
      .map((e) => ({ key: `e-${e.id}`, icon: Users, label: e.name, sub: e.title || e.email, to: "/employees", group: "Employees" }));
    const invs = db.invoices
      .filter((i) => `${i.number}`.toLowerCase().includes(term))
      .slice(0, 3)
      .map((i) => ({ key: `i-${i.id}`, icon: FileText, label: i.number, sub: `Invoice · ${i.status}`, to: "/invoices", group: "Invoices" }));
    const exps = db.expenses
      .filter((x) => `${x.description} ${x.category}`.toLowerCase().includes(term))
      .slice(0, 3)
      .map((x) => ({ key: `x-${x.id}`, icon: Receipt, label: x.description || x.category, sub: `Expense · ${x.status}`, to: "/expenses", group: "Expenses" }));
    return [...emps, ...invs, ...exps].slice(0, 8);
  }, [q, db]);

  const goToResult = (to: string) => {
    navigate(to);
    setQ("");
    setSearchOpen(false);
  };

  const { notifications: notifs, unreadCount: notifCount, markRead, markAllRead } = useNotifications();

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
                        `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lift"
                            : "text-slate-600 hover:translate-x-0.5 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
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
      <aside className="glass hidden w-64 shrink-0 border-y-0 border-l-0 lg:block">
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
        <header className="glass sticky top-0 z-30 flex items-center gap-3 border-x-0 border-t-0 px-4 py-3 shadow-soft">
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setMobileOpen(true)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search employees, invoices, expenses…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
                if (e.key === "Enter" && searchResults[0]) goToResult(searchResults[0].to);
              }}
            />
            {searchOpen && q.trim() && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
                <div className="card absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto !p-0">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">No matches for “{q}”</div>
                  ) : (
                    searchResults.map((r) => {
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.key}
                          onClick={() => goToResult(r.to)}
                          className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-left text-sm last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.04]"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 dark:bg-brand-400/10 dark:text-brand-300">
                            <Icon size={15} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-slate-700 dark:text-slate-200">{r.label}</span>
                            <span className="block truncate text-xs text-slate-400">{r.sub}</span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
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
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-bold dark:border-white/10">
                      <span>
                        Notifications {notifCount > 0 && <span className="font-normal text-slate-400">· {notifCount} new</span>}
                      </span>
                      {notifCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-semibold text-brand-500 hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-slate-400">You're all caught up 🎉</div>
                      ) : (
                        notifs.map((n) => (
                          <NavLink
                            key={n.id}
                            to={n.link || "/"}
                            onClick={() => {
                              setNotifOpen(false);
                              if (!n.read) markRead(n.id);
                            }}
                            className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.04]"
                          >
                            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-slate-300 dark:bg-slate-600" : "bg-brand-500"}`} />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-700 dark:text-slate-200">{n.title}</div>
                              <div className="text-slate-500 dark:text-slate-400">{n.message}</div>
                              <div className="mt-0.5 text-xs text-slate-400">{n.createdAt ? relTime(n.createdAt) : ""}</div>
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
