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
  const firstInput              = useRef<HTMLInputElement>(null);

  // Load Anton once (client-only)
  useEffect(() => {
    const id = "anton-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id   = id;
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Anton&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (user) return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, [user]);

  useEffect(() => {
    if (visible) setTimeout(() => firstInput.current?.focus(), 60);
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
      setTimeout(() => setVisible(false), 2200);
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
        @keyframes fw-rise {
          from { opacity:0; transform:translateY(28px) scale(.96); }
          to   { opacity:1; transform:translateY(0)   scale(1);   }
        }
        @keyframes fw-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:.3; }
        }
        @keyframes fw-spin {
          to { transform:rotate(360deg); }
        }
        @keyframes fw-check {
          from { stroke-dashoffset:40; }
          to   { stroke-dashoffset:0;  }
        }
        .fw-popup {
          animation: fw-rise .48s cubic-bezier(.2,.9,.25,1) both;
        }
        .fw-dot {
          animation: fw-pulse 1.6s infinite;
        }
        .fw-spinner {
          animation: fw-spin .75s linear infinite;
        }
        .fw-check-path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: fw-check .4s .1s ease forwards;
        }
        .fw-close:hover  { background:rgba(20,20,20,.13); transform:scale(1.07); }
        .fw-cta:hover    { background:#1d3adb; transform:translateY(-2px); }
        .fw-cta:active   { transform:translateY(0); }
        .fw-cta:hover svg.arrow { transform:translateX(4px); }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position:"fixed", inset:0, zIndex:9998,
          background:"rgba(10,10,10,.72)",
          backdropFilter:"blur(4px)",
          WebkitBackdropFilter:"blur(4px)",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fwp-heading"
        className="fw-popup"
        style={{
          position:"fixed", zIndex:9999,
          top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:"min(430px, 94vw)",
          background:"#F7F6F3",
          borderRadius:20,
          boxShadow:"0 40px 80px -20px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.05)",
          overflow:"hidden",
          fontFamily:"'Inter',system-ui,sans-serif",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close popup"
          className="fw-close"
          style={{
            position:"absolute", top:14, right:14, zIndex:10,
            width:32, height:32, borderRadius:"50%",
            background:"rgba(20,20,20,.06)", border:"none",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background .15s, transform .15s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#141414" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20"/>
            <line x1="20" y1="4" x2="4" y2="20"/>
          </svg>
        </button>

        {/* ── Dark banner ── */}
        <div style={{
          background:"#141414", color:"#F7F6F3",
          padding:"22px 28px 48px 28px", position:"relative",
        }}>
          {/* Eyebrow */}
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            fontSize:11, fontWeight:700, letterSpacing:".18em",
            color:"#C9F31D", textTransform:"uppercase",
          }}>
            <span className="fw-dot" style={{
              width:7, height:7, background:"#C9F31D",
              borderRadius:"50%", display:"inline-block",
            }}/>
            First time here
          </div>

          {/* Headline */}
          <h2
            id="fwp-heading"
            style={{
              fontFamily:"'Anton',impact,sans-serif",
              fontWeight:400, fontSize:"clamp(40px,10vw,52px)",
              lineHeight:.92, letterSpacing:".01em",
              textTransform:"uppercase", marginTop:12,
            }}
          >
            Step<br/>into<br/>
            <span style={{
              color:"#2B4EFF",
              WebkitTextStroke:"1.5px #C9F31D",
            }}>
              25% off
            </span>
          </h2>

          {/* Tilted badge */}
          <div style={{
            position:"absolute", top:16, right:64,
            background:"#C9F31D", color:"#141414",
            fontFamily:"'Anton',impact,sans-serif",
            padding:"10px 14px 10px 16px",
            transform:"rotate(6deg)",
            boxShadow:"0 6px 16px rgba(0,0,0,.4)",
            lineHeight:1,
          }}>
            <span style={{fontSize:12, display:"block"}}>TAKE</span>
            <span style={{fontSize:22, display:"block"}}>25%</span>
            <span style={{fontSize:12, display:"block"}}>OFF</span>
          </div>
        </div>

        {/* Lace-stitch divider */}
        <svg viewBox="0 0 430 22" style={{display:"block",width:"100%",height:22}} preserveAspectRatio="none">
          <polyline
            points="0,4 15,18 30,4 45,18 60,4 75,18 90,4 105,18 120,4 135,18 150,4 165,18 180,4 195,18 210,4 225,18 240,4 255,18 270,4 285,18 300,4 315,18 330,4 345,18 360,4 375,18 390,4 405,18 430,4"
            fill="none" stroke="#141414" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" opacity=".8"
          />
        </svg>

        {/* ── Body ── */}
        <div style={{padding:"22px 28px 28px 28px"}}>

          {step === "email" && (
            <>
              <p style={{color:"#3a3a38", fontSize:14.5, lineHeight:1.55, marginBottom:20}}>
                New here? <strong style={{color:"#141414"}}>Welcome.</strong> Drop your email and we'll
                send you a one-time code — no password needed. Your 25% discount applies automatically at checkout.
              </p>

              <form onSubmit={handleEmail} noValidate>
                <div style={{display:"flex", gap:8, marginBottom:12}}>
                  <input
                    ref={firstInput}
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    aria-label="Email address"
                    style={{
                      flex:1, padding:"14px 16px",
                      border:"2px solid rgba(20,20,20,.12)",
                      borderRadius:10, fontSize:14,
                      fontFamily:"inherit", background:"#fff",
                      color:"#141414", outline:"none",
                      transition:"border-color .15s",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor="#2B4EFF"}
                    onBlur={e  => e.currentTarget.style.borderColor="rgba(20,20,20,.12)"}
                  />
                </div>

                {error && (
                  <p style={{color:"#dc2626", fontSize:12.5, marginBottom:10}}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="fw-cta"
                  style={{
                    width:"100%", padding:"16px",
                    background: loading ? "#4a6aff" : "#2B4EFF",
                    color:"#F7F6F3", border:"none", borderRadius:10,
                    fontFamily:"inherit", fontWeight:800, fontSize:15,
                    letterSpacing:".03em", textTransform:"uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    transition:"background .15s, transform .15s",
                    opacity: loading ? .8 : 1,
                  }}
                >
                  {loading ? (
                    <svg className="fw-spinner" width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                  ) : (
                    <>
                      Get my 25% off
                      <svg className="arrow" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.4"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{transition:"transform .15s"}}>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p style={{textAlign:"center", fontSize:11.5, color:"#8A8A85", marginTop:12}}>
                No thanks,{" "}
                <span
                  onClick={dismiss}
                  style={{color:"#141414", textDecoration:"underline", cursor:"pointer"}}
                >
                  I'll pay full price
                </span>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <p style={{color:"#3a3a38", fontSize:14.5, lineHeight:1.55, marginBottom:6}}>
                We sent a 6-digit code to{" "}
                <strong style={{color:"#141414"}}>{email}</strong>.
                Enter it below to unlock your discount.
              </p>

              <button
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                style={{
                  background:"none", border:"none", cursor:"pointer",
                  color:"#2B4EFF", fontSize:12.5, fontFamily:"inherit",
                  padding:0, marginBottom:16, textDecoration:"underline",
                }}
              >
                ← Use a different email
              </button>

              <form onSubmit={handleOtp} noValidate>
                <input
                  ref={firstInput}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g,"")); setError(""); }}
                  aria-label="One-time code"
                  style={{
                    width:"100%", padding:"16px 20px",
                    border:"2px solid rgba(20,20,20,.12)",
                    borderRadius:10, fontSize:26, letterSpacing:".35em",
                    fontFamily:"'Anton',monospace", textAlign:"center",
                    background:"#fff", color:"#141414", outline:"none",
                    transition:"border-color .15s", marginBottom:12,
                    boxSizing:"border-box",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor="#2B4EFF"}
                  onBlur={e  => e.currentTarget.style.borderColor="rgba(20,20,20,.12)"}
                />

                {error && (
                  <p style={{color:"#dc2626", fontSize:12.5, marginBottom:10}}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="fw-cta"
                  style={{
                    width:"100%", padding:"16px",
                    background: loading ? "#4a6aff" : "#2B4EFF",
                    color:"#F7F6F3", border:"none", borderRadius:10,
                    fontFamily:"inherit", fontWeight:800, fontSize:15,
                    letterSpacing:".03em", textTransform:"uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    transition:"background .15s, transform .15s",
                    opacity: loading ? .8 : 1,
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
                      <svg className="arrow" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.4"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{transition:"transform .15s"}}>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p style={{textAlign:"center", fontSize:11.5, color:"#8A8A85", marginTop:12}}>
                Didn't get it? Check spam or{" "}
                <span
                  onClick={async () => {
                    setError("");
                    try { await sendMagicOtpApi(email.trim().toLowerCase()); }
                    catch {}
                  }}
                  style={{color:"#141414", textDecoration:"underline", cursor:"pointer"}}
                >
                  resend code
                </span>
              </p>
            </>
          )}

          {step === "done" && (
            <div style={{
              display:"flex", flexDirection:"column",
              alignItems:"center", padding:"20px 0 8px",
              gap:14, textAlign:"center",
            }}>
              <div style={{
                width:64, height:64, borderRadius:"50%",
                background:"#C9F31D",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="#141414" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline className="fw-check-path" points="4 12 9 17 20 6"/>
                </svg>
              </div>
              <p style={{fontFamily:"'Anton',impact,sans-serif", fontSize:24, color:"#141414", lineHeight:1.1}}>
                YOU&apos;RE IN!
              </p>
              <p style={{color:"#3a3a38", fontSize:14, lineHeight:1.5}}>
                Your 25% discount is locked in.<br/>
                Happy shopping — let&apos;s find your pair.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
