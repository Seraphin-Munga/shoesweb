"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resetPasswordApi } from "../lib/api";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token  = params.get("token") ?? "";
  const email  = params.get("email") ?? "";

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [step,            setStep]            = useState<"form" | "done">("form");
  const [busy,            setBusy]            = useState(false);

  /* Invalid / missing link */
  if (!token || !email) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-black text-zinc-900 mb-2">Invalid reset link</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            This link is missing required information. Please request a new password reset.
          </p>
        </div>
        <Link
          href="/account"
          className="block w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold text-center hover:bg-zinc-700 transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  /* Success state */
  if (step === "done") {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-black text-zinc-900 mb-2">Password reset!</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <Link
          href="/account"
          className="block w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold text-center hover:bg-zinc-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await resetPasswordApi(email, token, newPassword);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. The link may have expired.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-zinc-900 mb-1">Set new password</h2>
        <p className="text-sm text-zinc-500">
          Resetting password for <span className="font-semibold text-zinc-700">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
          {error.toLowerCase().includes("expired") && (
            <div className="mt-2">
              <Link href="/account" className="font-semibold underline">
                Request a new reset link
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            Confirm password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "Resetting…" : "Reset password"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <Link href="/account" className="font-semibold text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-zinc-50 px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
            <Suspense fallback={
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
