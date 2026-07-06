"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait one tick so localStorage hydration in AuthContext completes
    const t = setTimeout(() => setChecked(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Still hydrating
  if (!checked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
          <span className="text-sm text-zinc-400">Loading…</span>
        </div>
      </div>
    );
  }

  // Not signed in, show gate
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-zinc-900 mb-2">Sign in required</h2>
          <p className="text-zinc-500 text-sm mb-8">
            You need to be signed in to access this page.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href={`/account?redirect=${encodeURIComponent(pathname)}`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-700 transition-colors"
            >
              Sign In
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={`/account?tab=signup&redirect=${encodeURIComponent(pathname)}`}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-bold text-zinc-800 border-2 border-zinc-200 hover:border-zinc-400 transition-colors"
            >
              Create an Account
            </Link>
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors mt-1">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
