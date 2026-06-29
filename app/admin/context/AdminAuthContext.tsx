"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "stryde_admin_session";

const ADMIN_CREDENTIALS = [
  { email: "admin@stryde.com",   password: "Admin123!", name: "Admin",    role: "Super Admin" },
  { email: "manager@stryde.com", password: "Manage123!", name: "Manager", role: "Store Manager" },
];

export type AdminUser = { email: string; name: string; role: string };

type AdminAuthCtx = {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin]   = useState<AdminUser | null>(null);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAdmin(JSON.parse(raw));
    } catch {}
    setLoad(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 700));
    const match = ADMIN_CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );
    if (!match) throw new Error("Invalid credentials.");
    const user: AdminUser = { email: match.email, name: match.name, role: match.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
