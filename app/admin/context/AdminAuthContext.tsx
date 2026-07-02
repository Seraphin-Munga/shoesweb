"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../../lib/api";

const STORAGE_KEY       = "stryde_admin_session";
const STORAGE_TOKEN_KEY = "stryde_admin_token";

export type AdminUser = { email: string; name: string; role: string };

type AdminAuthCtx = {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin]   = useState<AdminUser | null>(null);
  const [token, setToken]   = useState<string | null>(null);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const tok = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (raw) setAdmin(JSON.parse(raw));
      if (tok) setToken(tok);
    } catch {}
    setLoad(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Authenticate against the real API to get a JWT
    try {
      const data = await loginApi(email.trim().toLowerCase(), password);

      // Only allow Admin role users into the admin panel
      if (data.user.role !== "Admin")
        throw new Error("Access denied. Admin role required.");

      const user: AdminUser = {
        email: data.user.email,
        name:  `${data.user.firstName} ${data.user.lastName}`.trim() || "Admin",
        role:  "Super Admin",
      };

      localStorage.setItem(STORAGE_KEY,       JSON.stringify(user));
      localStorage.setItem(STORAGE_TOKEN_KEY, data.accessToken);
      setAdmin(user);
      setToken(data.accessToken);
    } catch (err) {
      // Fallback: allow hardcoded credentials when API is offline (dev only)
      if (process.env.NODE_ENV === "development") {
        const FALLBACK = [
          { email: "admin@stryde.com",   password: "Admin@12345", name: "Admin",   role: "Super Admin" },
          { email: "manager@stryde.com", password: "Admin@12345", name: "Manager", role: "Store Manager" },
        ];
        const match = FALLBACK.find((c) => c.email === email.trim().toLowerCase() && c.password === password);
        if (match) {
          const user: AdminUser = { email: match.email, name: match.name, role: match.role };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          setAdmin(user);
          setToken(null);
          return;
        }
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setAdmin(null);
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
