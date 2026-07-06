"use client";

import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { BiShieldAlt2, BiShow, BiHide, BiErrorCircle, BiLoaderAlt } from "react-icons/bi";

export default function AdminLoginPage() {
  const { login, loading } = useAdminAuth();
  const [email, setEmail]  = useState("");
  const [pass, setPass]    = useState("");
  const [show, setShow]    = useState(false);
  const [error, setError]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, pass);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <BiShieldAlt2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Fenwalk Admin</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 tracking-wide uppercase">
              Email address
            </label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"} required autoComplete="current-password"
                value={pass} onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              />
              <button type="button" onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                {show ? <BiHide className="w-5 h-5" /> : <BiShow className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <BiErrorCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-px" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-white text-zinc-900 font-bold py-3.5 rounded-xl hover:bg-zinc-100 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading
              ? <><BiLoaderAlt className="w-4 h-4 animate-spin" /> Signing in…</>
              : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-8">
          Fenwalk Admin Portal · Restricted Access
        </p>
      </div>
    </div>
  );
}
