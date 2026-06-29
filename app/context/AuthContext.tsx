"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const KEY = "stryde_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
    setUser(u);
  };

  const signIn = useCallback(async (email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const u: User = JSON.parse(stored);
      if (u.email.toLowerCase() === email.toLowerCase()) {
        persist(u);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    throw new Error("No account found with that email. Please sign up first.");
  }, []);

  const signUp = useCallback(async (firstName: string, lastName: string, email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const u: User = { firstName, lastName, email, joinedAt: new Date().toISOString() };
    persist(u);
    setLoading(false);
  }, []);

  const signOut = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
