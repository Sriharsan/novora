import React, { createContext, useContext, useMemo, useState } from "react";
import type { Employee, Role } from "./types";
import { useData } from "./store";
import { api, apiConfigured } from "./api";

interface AuthValue {
  user: Employee | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginAs: (role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);
const KEY = "novora.session";

const DEMO: Record<Role, { email: string; password: string }> = {
  admin: { email: "admin@novora.app", password: "admin123" },
  manager: { email: "aarav@novora.app", password: "manager123" },
  employee: { email: "rohan@novora.app", password: "employee123" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { db, reloadFromApi, addEmployee } = useData();
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(KEY));

  const value = useMemo<AuthValue>(() => {
    const persist = (id: string | null) => {
      if (id) localStorage.setItem(KEY, id);
      else localStorage.removeItem(KEY);
      setUserId(id);
    };

    const localLogin = (email: string, password: string) => {
      const match = db.employees.find(
        (e) => e.email.toLowerCase() === email.trim().toLowerCase() && (e as any).password === password
      );
      if (!match) return { ok: false as const, error: "Invalid email or password." };
      persist(match.id);
      return { ok: true as const };
    };

    return {
      user: db.employees.find((e) => e.id === userId) ?? null,

      login: async (email, password) => {
        if (apiConfigured) {
          try {
            const user = await api.login(email, password);
            await reloadFromApi();
            persist(user.id);
            return { ok: true };
          } catch (e: any) {
            // Network/server down -> fall back to the local demo dataset.
            const msg = String(e?.message || "");
            if (/failed to fetch|networkerror|load failed/i.test(msg)) return localLogin(email, password);
            return { ok: false, error: msg || "Login failed" };
          }
        }
        return localLogin(email, password);
      },

      register: async (name, email, password) => {
        const trimmedEmail = email.trim().toLowerCase();
        const exists = db.employees.some((e) => e.email.toLowerCase() === trimmedEmail);
        if (exists) return { ok: false, error: "That email is already registered." };

        if (apiConfigured) {
          try {
            const user = await api.register(name, trimmedEmail, password);
            await reloadFromApi();
            persist(user.id);
            return { ok: true };
          } catch (e: any) {
            return { ok: false, error: String(e?.message || "Registration failed") };
          }
        }

        const emp = addEmployee({
          name,
          email: trimmedEmail,
          password,
          role: "employee",
          title: "New joiner",
          departmentId: db.departments[0]?.id ?? "",
          joinDate: new Date().toISOString().slice(0, 10),
          salary: 0,
          status: "onboarding",
          leaveBalance: 20,
          onboarding: [
            { label: "Sign offer letter", done: false },
            { label: "Submit ID & bank details", done: false },
            { label: "IT setup & accounts", done: false },
            { label: "Assign buddy", done: false },
            { label: "First-week orientation", done: false },
          ],
        } as any);
        persist(emp.id);
        return { ok: true };
      },

      loginAs: async (role) => {
        const creds = DEMO[role];
        if (apiConfigured) {
          try {
            const user = await api.login(creds.email, creds.password);
            await reloadFromApi();
            persist(user.id);
            return;
          } catch {
            /* fall through to local */
          }
        }
        const demo = db.employees.find((e) => e.email === creds.email);
        if (demo) persist(demo.id);
      },

      logout: () => {
        if (apiConfigured) api.logout();
        persist(null);
      },
    };
  }, [db, userId, reloadFromApi, addEmployee]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
