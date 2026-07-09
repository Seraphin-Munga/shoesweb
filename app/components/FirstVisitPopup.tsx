"use client";

import { useEffect, useState, useRef } from "react";
import { sendMagicOtpApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "fenwalk_first_visit_seen";
type Step = "email" | "otp" | "done";

export default function FirstVisitPopup() {
  const { user, signInWithOtp } = useAuth();
  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState<Step>("email");
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, [user]);

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 80);
  }, [visible, step]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendMagicOtpApi(email.trim().toLowerCase());
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithOtp(email.trim().toLowerCase(), otp.trim());
      localStorage.setItem(STORAGE_KEY, "1");
      setStep("done");
      setTimeout(() => setVisible(false), 2400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes fw-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fw-card-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes fw-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fw-check-draw {
          from { stroke-dashoffset: 36; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes fw-pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .fw-backdrop { animation: fw-backdrop-in 0.25s ease both; }
        .fw-card     { animation: fw-card-in 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .fw-spinner  { animation: fw-spin 0.75s linear infinite; }
        .fw-dot      { animation: fw-pulse-dot 1.8s ease-in-out infinite; }
        .fw-check    {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: fw-check-draw 0.45s 0.1s ease forwards;
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className="fw-backdrop fixed inset-0 z-[9998] bg-zinc-950/80 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* ── Centred card wrapper ── */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        aria-hidden="true"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fwp-title"
          aria-hidden="false"
          className="fw-card relative w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5"
          onClick={e => e.stopPropagation()}
        >
          {/* Top gradient accent bar */}
          <div
            className="h-[3px] w-full"
            style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)" }}
          />

          {/* ── Dark offer panel ── */}
          <div className="bg-zinc-950 px-8 pt-7 pb-9 relative">

            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20"/>
                <line x1="20" y1="4" x2="4" y2="20"/>
              </svg>
            </button>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="fw-dot w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
              />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400">
                Welcome to Fenwalk
              </span>
            </div>

            {/* Headline */}
            <h2
              id="fwp-title"
              className="text-white font-black leading-[0.9] tracking-tight mb-4"
              style={{ fontSize: "clamp(2.4rem,8vw,3.1rem)" }}
            >
              Your first pair<br/>
              <span
                style={{
                  background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                25% off.
              </span>
            </h2>

            {/* Sub copy */}
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Sign in with your email — no password needed. Your discount
              applies automatically at checkout.
            </p>

            {/* Decorative pill badge */}
            <div className="absolute right-8 bottom-7 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/70 ring-1 ring-zinc-700/50">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#a855f7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
                <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
              </svg>
              <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">NEW ARRIVALS INCLUDED</span>
            </div>
          </div>

          {/* ── Light form panel ── */}
          <div className="bg-white px-8 py-7">

            {step === "email" && (
              <form onSubmit={handleEmail} noValidate>
                <label
                  htmlFor="fwp-email"
                  className="block text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2"
                >
                  Email address
                </label>
                <input
                  ref={inputRef}
                  id="fwp-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50
                             text-zinc-900 text-sm placeholder-zinc-400
                             focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                             transition-shadow mb-3"
                />

                {error && (
                  <p className="text-red-500 text-xs mb-3 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             text-white text-sm font-bold tracking-wide
                             disabled:opacity-60 disabled:cursor-not-allowed
                             hover:-translate-y-0.5 active:translate-y-0
                             transition-all duration-150"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#a855f7)",
                    boxShadow: "0 4px 24px rgba(139,92,246,.35)",
                  }}
                >
                  {loading ? (
                    <svg className="fw-spinner" width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                  ) : (
                    <>
                      Claim my 25% off
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-[11.5px] text-zinc-400 mt-4">
                  Already have an account?{" "}
                  <span
                    onClick={dismiss}
                    className="text-zinc-600 underline cursor-pointer hover:text-zinc-900 transition-colors"
                  >
                    Sign in instead
                  </span>
                </p>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleOtp} noValidate>
                <div className="flex items-start gap-2 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Check your inbox</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Code sent to <span className="font-medium text-zinc-600">{email}</span>
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="fwp-otp"
                  className="block text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2"
                >
                  6-digit code
                </label>
                <input
                  ref={inputRef}
                  id="fwp-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  placeholder="······"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                  className="w-full px-4 py-4 rounded-xl border border-zinc-200 bg-zinc-50
                             text-zinc-900 text-2xl font-bold tracking-[0.5em] text-center
                             placeholder-zinc-200 focus:outline-none focus:ring-2
                             focus:ring-violet-500 focus:border-transparent transition-shadow mb-3"
                />

                {error && (
                  <p className="text-red-500 text-xs mb-3 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             text-white text-sm font-bold tracking-wide
                             disabled:opacity-60 disabled:cursor-not-allowed
                             hover:-translate-y-0.5 active:translate-y-0
                             transition-all duration-150"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#a855f7)",
                    boxShadow: "0 4px 24px rgba(139,92,246,.35)",
                  }}
                >
                  {loading ? (
                    <svg className="fw-spinner" width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                  ) : (
                    <>
                      Verify &amp; unlock deal
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                    className="text-[11.5px] text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setError("");
                      try { await sendMagicOtpApi(email.trim().toLowerCase()); } catch {}
                    }}
                    className="text-[11.5px] text-zinc-400 hover:text-zinc-600 transition-colors underline"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="flex flex-col items-center py-4 gap-4 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline className="fw-check" points="4 12 9 17 20 6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-black text-zinc-900 tracking-tight">You&apos;re all set!</p>
                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    25% off is locked in for your first order.<br/>Happy shopping.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
