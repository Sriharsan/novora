import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth";
import { useData } from "./store";
import { api, apiConfigured } from "./api";
import type { AppNotification } from "./types";

const POLL_MS = 30_000;

// Live mode: fetches real automation-generated notifications from the backend
// and polls for new ones. Local demo mode: derives an equivalent view on the
// fly from pending leave/expenses (or the user's own activity), same as before.
export function useNotifications() {
  const { user } = useAuth();
  const { db } = useData();
  const [remote, setRemote] = useState<AppNotification[] | null>(null);

  const refresh = useCallback(async () => {
    if (!apiConfigured || !user) return;
    try {
      setRemote(await api.getNotifications());
    } catch {
      /* keep showing the last known list if a poll fails */
    }
  }, [user]);

  useEffect(() => {
    if (!apiConfigured || !user) {
      setRemote(null);
      return;
    }
    void refresh();
    const t = setInterval(refresh, POLL_MS);
    return () => clearInterval(t);
  }, [user, refresh]);

  const canApprove = user?.role === "admin" || user?.role === "manager";

  const local = useMemo<AppNotification[]>(() => {
    if (!user) return [];
    const empName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? "Someone";
    if (canApprove) {
      const pendingLeave = db.leave.filter((l) => l.status === "pending");
      const pendingExp = db.expenses.filter((x) => x.status === "pending");
      return [
        ...pendingLeave.map((l) => ({
          id: l.id,
          type: "leave_pending",
          title: "Leave request",
          message: `${empName(l.employeeId)} requested ${l.days}d ${l.type} leave`,
          link: "/leave",
          read: false,
          emailSent: false,
          createdAt: l.createdAt,
        })),
        ...pendingExp.map((x) => ({
          id: x.id,
          type: "expense_pending",
          title: "Expense claim",
          message: `${empName(x.employeeId)} submitted a ${x.category} expense`,
          link: "/expenses",
          read: false,
          emailSent: false,
          createdAt: x.date,
        })),
      ];
    }
    return db.activity
      .filter((a) => a.actor === user.name)
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        type: "activity",
        title: "Activity",
        message: a.text,
        link: "/",
        read: false,
        emailSent: false,
        createdAt: a.at,
      }));
  }, [db, user, canApprove]);

  const notifications = apiConfigured ? remote ?? [] : local;
  const unreadCount = apiConfigured ? notifications.filter((n) => !n.read).length : notifications.length;

  const markRead = useCallback(async (id: string) => {
    if (!apiConfigured) return;
    setRemote((r) => (r ? r.map((n) => (n.id === id ? { ...n, read: true } : n)) : r));
    try {
      await api.markNotificationRead(id);
    } catch {
      /* best-effort */
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!apiConfigured) return;
    setRemote((r) => (r ? r.map((n) => ({ ...n, read: true })) : r));
    try {
      await api.markAllNotificationsRead();
    } catch {
      /* best-effort */
    }
  }, []);

  return { notifications, unreadCount, markRead, markAllRead, refresh };
}
