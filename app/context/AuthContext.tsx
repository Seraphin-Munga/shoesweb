"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { loginApi, registerApi, refreshTokenApi, verifyMagicOtpApi } from "../lib/api";

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
  signInWithOtp: (email: string, code: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY    = "stryde_user";
const TOKEN_KEY   = "stryde_token";
const REFRESH_KEY = "stryde_refresh";

function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = (u: User | null, tok: string | null, ref?: string | null) => {
    if (u)   { localStorage.setItem(USER_KEY, JSON.stringify(u)); setUser(u); }
    else     { localStorage.removeItem(USER_KEY); setUser(null); }
    if (tok) { localStorage.setItem(TOKEN_KEY, tok); setToken(tok); }
    else     { localStorage.removeItem(TOKEN_KEY); setToken(null); }
    if (ref !== undefined) {
      if (ref) localStorage.setItem(REFRESH_KEY, ref);
      else     localStorage.removeItem(REFRESH_KEY);
    }
  };

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      const tok = localStorage.getItem(TOKEN_KEY);
      if (raw) setUser(JSON.parse(raw));
      if (tok) setToken(tok);
    } catch {}
  }, []);

  const silentRefresh = useCallback(async () => {
    const tok = localStorage.getItem(TOKEN_KEY);
    const ref = localStorage.getItem(REFRESH_KEY);
    if (!tok || !ref) return;
    try {
      const data = await refreshTokenApi(tok, ref);
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
      setToken(data.accessToken);
    } catch {
      // Refresh token expired or invalid, sign out
      persist(null, null, null);
    }
  }, []);

  // Schedule proactive refresh 5 min before expiry; re-schedules whenever token changes
  useEffect(() => {
    if (!token) return;
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const msUntilRefresh = expiry - Date.now() - 5 * 60 * 1000;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (msUntilRefresh <= 0) {
      silentRefresh();
    } else {
      timerRef.current = setTimeout(silentRefresh, msUntilRefresh);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [token, silentRefresh]);

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
      persist(u, data.accessToken, data.refreshToken);
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
      persist(u, data.accessToken, data.refreshToken);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithOtp = useCallback(async (email: string, code: string) => {
    setLoading(true);
    try {
      const data = await verifyMagicOtpApi(email.trim().toLowerCase(), code);
      const u: User = {
        firstName: data.user.firstName,
        lastName:  data.user.lastName,
        email:     data.user.email,
        role:      data.user.role,
        joinedAt:  new Date().toISOString(),
      };
      persist(u, data.accessToken, data.refreshToken);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => persist(null, null, null), []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signInWithOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
