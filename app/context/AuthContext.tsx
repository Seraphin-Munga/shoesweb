"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginApi, registerApi } from "../lib/api";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  joinedAt: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY  = "stryde_user";
const TOKEN_KEY = "stryde_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      const tok = localStorage.getItem(TOKEN_KEY);
      if (raw) setUser(JSON.parse(raw));
      if (tok) setToken(tok);
    } catch {}
  }, []);

  const persist = (u: User | null, tok: string | null) => {
    if (u)   { localStorage.setItem(USER_KEY,  JSON.stringify(u)); setUser(u); }
    else     { localStorage.removeItem(USER_KEY); setUser(null); }
    if (tok) { localStorage.setItem(TOKEN_KEY, tok); setToken(tok); }
    else     { localStorage.removeItem(TOKEN_KEY); setToken(null); }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginApi(email.trim().toLowerCase(), password);
      const u: User = {
        firstName: data.user.firstName,
        lastName:  data.user.lastName,
        email:     data.user.email,
        role:      data.user.role,
        joinedAt:  new Date().toISOString(),
      };
      persist(u, data.accessToken);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (
    firstName: string, lastName: string, email: string, password: string,
  ) => {
    setLoading(true);
    try {
      const data = await registerApi(firstName, lastName, email.trim().toLowerCase(), password);
      const u: User = {
        firstName: data.user.firstName,
        lastName:  data.user.lastName,
        email:     data.user.email,
        role:      data.user.role,
        joinedAt:  new Date().toISOString(),
      };
      persist(u, data.accessToken);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => persist(null, null), []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
