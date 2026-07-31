// REST client for the Novora backend (server/). When VITE_API_URL is set the
// app runs in LIVE mode against PostgreSQL; otherwise it stays in local demo mode.
import type { Database, AppNotification } from "./types";

const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "novora.token";

export const apiConfigured = Boolean(BASE);

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

async function req(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      msg = (await res.json()).error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  configured: apiConfigured,

  async login(email: string, password: string) {
    const data = await req("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data.user;
  },

  async register(name: string, email: string, password: string) {
    const data = await req("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    return data.user;
  },

  logout() {
    setToken(null);
  },

  getState(): Promise<Database> {
    return req("/api/state");
  },

  getNotifications(): Promise<AppNotification[]> {
    return req("/api/notifications");
  },
  markNotificationRead(id: string) {
    return req(`/api/notifications/${id}/read`, { method: "PATCH" });
  },
  markAllNotificationsRead() {
    return req("/api/notifications/read-all", { method: "PATCH" });
  },

  // Fire-and-forget persistence — the UI updates optimistically and syncs.
  put(entity: string, id: string, body: unknown) {
    void req(`/api/${entity}/${id}`, { method: "PUT", body: JSON.stringify(body) }).catch(() => {});
  },
  patch(entity: string, id: string, body: unknown) {
    void req(`/api/${entity}/${id}`, { method: "PATCH", body: JSON.stringify(body) }).catch(() => {});
  },
  del(entity: string, id: string) {
    void req(`/api/${entity}/${id}`, { method: "DELETE" }).catch(() => {});
  },
};
