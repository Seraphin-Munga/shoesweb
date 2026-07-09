"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it doesn't flash instantly on page load
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, [user]);

  useEffect(() => {
    if (visible && step !== "done") setTimeout(() => inputRef.current?.focus(), 120);
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
      setTimeout(() => setVisible(false), 2600);
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
        @keyframes fw-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fw-card {
          from { opacity: 0; transform: scale(0.92) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes fw-shoe {
          0%   { transform: translateY(0px)   rotate(-8deg) scale(1.08); }
          50%  { transform: translateY(-14px) rotate(-8deg) scale(1.08); }
          100% { transform: translateY(0px)   rotate(-8deg) scale(1.08); }
        }
        @keyframes fw-shoe-enter {
          from { opacity: 0; transform: translateX(60px) rotate(-8deg) scale(0.85); }
          to   { opacity: 1; transform: translateX(0)    rotate(-8deg) scale(1.08); }
        }
        @keyframes fw-shine {
          0%   { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%)  skewX(-20deg); }
        }
        @keyframes fw-badge-pop {
          0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(-12deg); opacity: 1; }
          100% { transform: scale(1) rotate(-12deg); opacity: 1; }
        }
        @keyframes fw-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fw-check {
          from { stroke-dashoffset: 36; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes fw-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.6; }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        @keyframes fw-dot-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }

        .fw-backdrop { animation: fw-backdrop 0.3s ease both; }
        .fw-card     { animation: fw-card 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .fw-shoe     {
          animation:
            fw-shoe-enter 0.65s cubic-bezier(0.16,1,0.3,1) 0.25s both,
            fw-shoe       3.2s ease-in-out 1s infinite;
        }
        .fw-badge-pop { animation: fw-badge-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
        .fw-shine-bar { animation: fw-shine 2.4s ease-in-out 1.2s infinite; }
        .fw-spinner   { animation: fw-spin 0.75s linear infinite; }
        .fw-check     { stroke-dasharray: 36; stroke-dashoffset: 36; animation: fw-check 0.45s 0.1s ease forwards; }
        .fw-ring      { animation: fw-pulse-ring 1.4s ease-out infinite; }
        .fw-dot       { animation: fw-dot-blink 1.8s ease-in-out infinite; }

        .fw-cta-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .fw-cta-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139,92,246,.5) !important; }
        .fw-cta-btn:active { transform: translateY(0); }
        .fw-cta-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

        .fw-input {
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .fw-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }

        .fw-close:hover { background: rgba(255,255,255,0.12) !important; transform: rotate(90deg); }
        .fw-close { transition: background 0.15s, transform 0.25s; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className="fw-backdrop fixed inset-0 z-[9998]"
        style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* ── Centering shell ── */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fwp-title"
          className="fw-card pointer-events-auto w-full rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,.6)] ring-1 ring-white/10"
          style={{ maxWidth: 820 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col sm:flex-row" style={{ minHeight: 480 }}>

            {/* ══════════════════════════════════
                LEFT — Shoe visual panel
            ══════════════════════════════════ */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                flex: "0 0 52%",
                background: "linear-gradient(145deg, #0f0f1a 0%, #1a1040 45%, #0d0d22 100%)",
                minHeight: 280,
              }}
            >
              {/* Radial glow behind shoe */}
              <div
                className="absolute"
                style={{
                  width: 380, height: 380,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)",
                  top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              />

              {/* Concentric ring decorations */}
              <div className="absolute" style={{
                width: 260, height: 260, borderRadius: "50%",
                border: "1px solid rgba(139,92,246,0.12)",
                top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              }}/>
              <div className="absolute" style={{
                width: 340, height: 340, borderRadius: "50%",
                border: "1px solid rgba(139,92,246,0.07)",
                top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              }}/>

              {/* Pulsing ring (live) */}
              <div className="fw-ring absolute" style={{
                width: 220, height: 220, borderRadius: "50%",
                border: "2px solid rgba(139,92,246,0.35)",
                top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              }}/>

              {/* Shoe image — floating + tilted */}
              <div
                className="fw-shoe relative z-10"
                style={{ width: "88%", maxWidth: 380, paddingBottom: 16 }}
              >
                <Image
                  src="/popup-shoe.png"
                  alt="Featured sneaker — 25% off"
                  width={520}
                  height={440}
                  className="w-full h-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.7)]"
                  priority
                />

                {/* Shine sweep over shoe */}
                <div
                  className="fw-shine-bar absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                    width: "40%",
                  }}
                />
              </div>

              {/* Discount badge */}
              <div
                className="fw-badge-pop absolute top-5 left-5 z-20 flex flex-col items-center justify-center rounded-full text-center"
                style={{
                  width: 72, height: 72,
                  background: "linear-gradient(135deg,#6366f1,#a855f7)",
                  boxShadow: "0 8px 24px rgba(139,92,246,.5)",
                  transform: "rotate(-12deg)",
                }}
              >
                <span className="text-white font-black leading-none" style={{ fontSize: 22 }}>25%</span>
                <span className="text-violet-200 font-bold leading-none" style={{ fontSize: 9, letterSpacing: "0.1em" }}>OFF</span>
              </div>

              {/* Live indicator */}
              <div
                className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <span className="fw-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>
                <span className="text-zinc-300 font-semibold" style={{ fontSize: 10, letterSpacing: "0.12em" }}>NEW ARRIVALS INCLUDED</span>
              </div>

              {/* Brand name watermark */}
              <div
                className="absolute bottom-4 right-4 z-20 font-black tracking-widest uppercase"
                style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.3em" }}
              >
                FENWALK
              </div>
            </div>

            {/* ══════════════════════════════════
                RIGHT — Form panel
            ══════════════════════════════════ */}
            <div className="relative flex flex-col justify-between bg-white" style={{ flex: 1, padding: "32px 32px 28px" }}>

              {/* Close button */}
              <button
                onClick={dismiss}
                aria-label="Close"
                className="fw-close absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.07)" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="#52525b" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20"/>
                  <line x1="20" y1="4" x2="4" y2="20"/>
                </svg>
              </button>

              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)" }}
              />

              {/* ── Header ── */}
              <div className="mb-6 mt-1">
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }}/>
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-400">
                    First visit offer
                  </span>
                  <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}/>
                </div>

                {/* Headline */}
                <h2
                  id="fwp-title"
                  className="font-black leading-[0.88] tracking-tight text-zinc-900 mb-3"
                  style={{ fontSize: "clamp(2rem,5vw,2.6rem)" }}
                >
                  Step into<br/>
                  <span style={{
                    background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    your first pair
                  </span>
                </h2>

                <p className="text-zinc-500 text-sm leading-relaxed">
                  Sign in with just your email — no password. Your
                  <span className="font-semibold text-zinc-700"> 25% discount</span> locks
                  in automatically at checkout.
                </p>
              </div>

              {/* ── Form area ── */}
              <div className="flex-1 flex flex-col justify-center">

                {step === "email" && (
                  <form onSubmit={handleEmail} noValidate className="space-y-3">
                    <div>
                      <label
                        htmlFor="fwp-email"
                        className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1.5"
                      >
                        Your email address
                      </label>
                      <input
                        ref={inputRef}
                        id="fwp-email"
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        className="fw-input w-full px-4 py-3.5 rounded-xl border-2 border-zinc-100 bg-zinc-50 text-zinc-900 text-sm placeholder-zinc-300"
                      />
                    </div>

                    {error && (
                      <p className="flex items-center gap-1.5 text-red-500 text-xs">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="fw-cta-btn w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white text-sm font-bold tracking-wide"
                      style={{
                        background: "linear-gradient(135deg,#6366f1,#a855f7)",
                        boxShadow: "0 4px 20px rgba(139,92,246,.4)",
                      }}
                    >
                      {loading ? (
                        <svg className="fw-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 2a10 10 0 0 1 10 10"/>
                        </svg>
                      ) : (
                        <>
                          Claim my 25% off
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === "otp" && (
                  <form onSubmit={handleOtp} noValidate className="space-y-3">
                    {/* Sent confirmation */}
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-700">Code sent!</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Check <span className="font-medium text-violet-600">{email}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="fwp-otp"
                        className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1.5"
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
                        className="fw-input w-full px-4 py-4 rounded-xl border-2 border-zinc-100 bg-zinc-50 text-zinc-900 text-2xl font-bold tracking-[0.5em] text-center placeholder-zinc-200"
                      />
                    </div>

                    {error && (
                      <p className="flex items-center gap-1.5 text-red-500 text-xs">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length < 4}
                      className="fw-cta-btn w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white text-sm font-bold tracking-wide"
                      style={{
                        background: "linear-gradient(135deg,#6366f1,#a855f7)",
                        boxShadow: "0 4px 20px rgba(139,92,246,.4)",
                      }}
                    >
                      {loading ? (
                        <svg className="fw-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 2a10 10 0 0 1 10 10"/>
                        </svg>
                      ) : (
                        <>
                          Verify &amp; unlock deal
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-0.5">
                      <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                        className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">
                        ← Change email
                      </button>
                      <button type="button" onClick={async () => {
                        setError("");
                        try { await sendMagicOtpApi(email.trim().toLowerCase()); } catch {}
                      }} className="text-[11px] text-zinc-400 hover:text-violet-600 transition-colors underline">
                        Resend code
                      </button>
                    </div>
                  </form>
                )}

                {step === "done" && (
                  <div className="flex flex-col items-center py-6 gap-4 text-center">
                    <div className="relative">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline className="fw-check" points="4 12 9 17 20 6"/>
                        </svg>
                      </div>
                      <div className="fw-ring absolute inset-0 rounded-full" style={{ border: "2px solid rgba(139,92,246,.5)" }}/>
                    </div>
                    <div>
                      <p className="text-xl font-black text-zinc-900 tracking-tight">You&apos;re in!</p>
                      <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                        25% off is ready at checkout.<br/>Time to find your next pair.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Footer ── */}
              {step === "email" && (
                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <p className="text-center text-[11px] text-zinc-400">
                    No account needed &nbsp;·&nbsp;
                    <span onClick={dismiss} className="text-zinc-500 underline cursor-pointer hover:text-zinc-700 transition-colors">
                      Skip, I&apos;ll pay full price
                    </span>
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
