"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { fetchMyOrders, sendMagicOtpApi, forgotPasswordApi } from "../lib/api";

/* ── Shared OTP digit input ────────────────────────────────────── */
function OtpInput({ otp, onChange, onKeyDown, onPaste, inputRefs }: {
  otp: string[];
  onChange: (i: number, val: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) {
  return (
    <div className="flex gap-2 justify-center" onPaste={onPaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className={`w-11 h-14 text-center text-xl font-black border-2 rounded-xl outline-none transition-all ${
            digit ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white"
          } focus:border-zinc-900`}
        />
      ))}
    </div>
  );
}

/* ── Sign In form — email → OTP → logged in ───────────────────── */
function SignInForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess?: () => void }) {
  const { signInWithOtp, loading } = useAuth();
  const [step,      setStep]     = useState<"email" | "otp">("email");
  const [email,     setEmail]    = useState("");
  const [otp,       setOtp]      = useState(["", "", "", "", "", ""]);
  const [error,     setError]    = useState("");
  const [busy,      setBusy]     = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await sendMagicOtpApi(email.trim().toLowerCase());
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the full 6-digit code."); return; }
    setError("");
    try {
      await signInWithOtp(email, code);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next); setError("");
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) { setOtp(text.split("")); inputRefs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(""); setBusy(true);
    try {
      await sendMagicOtpApi(email.trim().toLowerCase());
      setOtp(["", "", "", "", "", ""]); setCountdown(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend.");
    } finally { setBusy(false); }
  };

  const isLoading = loading || busy;

  if (step === "otp") {
    return (
      <form onSubmit={handleVerify} className="space-y-6">
        <button type="button" onClick={() => { setStep("email"); setError(""); }}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-zinc-900 mb-1">Check your email</p>
          <p className="text-xs text-zinc-500">We sent a 6-digit code to<br /><span className="font-semibold text-zinc-800">{email}</span></p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-3 text-center">Enter verification code</label>
          <OtpInput otp={otp} onChange={handleOtpChange} onKeyDown={handleOtpKey} onPaste={handlePaste} inputRefs={inputRefs} />
          <p className="text-center text-xs text-zinc-400 mt-2">Code expires in 10 minutes</p>
        </div>
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        <button type="submit" disabled={isLoading || otp.join("").length < 6}
          className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {isLoading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : "Sign In"}
        </button>
        <p className="text-center text-sm text-zinc-500">
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? <span className="text-zinc-400">Resend in {countdown}s</span> : (
            <button type="button" onClick={handleResend} disabled={isLoading} className="font-semibold text-zinc-900 hover:underline disabled:opacity-50">Resend code</button>
          )}
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email address</label>
        <input type="email" required autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-zinc-400" />
      </div>
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
      <button type="submit" disabled={isLoading}
        className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
        {isLoading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : (
          <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Send Code</>
        )}
      </button>
      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-zinc-900 hover:underline">Create one</button>
      </p>
    </form>
  );
}

/* ── Sign Up form — email only → OTP → account created + logged in */
function SignUpForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess?: () => void }) {
  const { signInWithOtp, loading } = useAuth();
  const [step,      setStep]      = useState<"email" | "otp">("email");
  const [email,     setEmail]     = useState("");
  const [otp,       setOtp]       = useState(["", "", "", "", "", ""]);
  const [error,     setError]     = useState("");
  const [busy,      setBusy]      = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await sendMagicOtpApi(email.trim().toLowerCase());
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the full 6-digit code."); return; }
    setError("");
    try {
      await signInWithOtp(email, code);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next); setError("");
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) { setOtp(text.split("")); inputRefs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(""); setBusy(true);
    try {
      await sendMagicOtpApi(email.trim().toLowerCase());
      setOtp(["", "", "", "", "", ""]); setCountdown(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend.");
    } finally { setBusy(false); }
  };

  const isLoading = loading || busy;

  if (step === "otp") {
    return (
      <form onSubmit={handleVerify} className="space-y-6">
        <button type="button" onClick={() => { setStep("email"); setError(""); }}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-zinc-900 mb-1">Check your email</p>
          <p className="text-xs text-zinc-500">We sent a 6-digit code to<br /><span className="font-semibold text-zinc-800">{email}</span></p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-3 text-center">Enter verification code</label>
          <OtpInput otp={otp} onChange={handleOtpChange} onKeyDown={handleOtpKey} onPaste={handlePaste} inputRefs={inputRefs} />
          <p className="text-center text-xs text-zinc-400 mt-2">Code expires in 10 minutes</p>
        </div>
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        <button type="submit" disabled={isLoading || otp.join("").length < 6}
          className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {isLoading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : "Create Account"}
        </button>
        <p className="text-center text-sm text-zinc-500">
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? <span className="text-zinc-400">Resend in {countdown}s</span> : (
            <button type="button" onClick={handleResend} disabled={isLoading} className="font-semibold text-zinc-900 hover:underline disabled:opacity-50">Resend code</button>
          )}
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email address</label>
        <input type="email" required autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-zinc-400" />
        <p className="text-xs text-zinc-400 mt-1.5">We&apos;ll send a code to verify your email — no password needed.</p>
      </div>
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
      <button type="submit" disabled={isLoading}
        className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
        {isLoading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : (
          <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Send Verification Code</>
        )}
      </button>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-zinc-900 hover:underline">Sign in</button>
      </p>
    </form>
  );
}

/* ── Account dashboard ────────────────────────────────────────── */
function Dashboard() {
  const { user, token, signOut } = useAuth();
  const { count: favCount } = useFavorites();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    fetchMyOrders(token).then((o) => setOrderCount(o.length)).catch(() => {});
  }, [token]);

  if (!user) return null;

  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const initials = (`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase().trim() || user.email?.[0]?.toUpperCase() || "?");

  const quickLinks = [
    { label: "My Orders",    icon: "📦", href: "/orders",    note: `${orderCount} order${orderCount !== 1 ? "s" : ""}` },
    { label: "My Favorites", icon: "❤️", href: "/favorites", note: `${favCount} saved` },
    { label: "My Cart",      icon: "🛍️", href: "/cart",      note: "" },
    { label: "Size Guide",   icon: "📏", href: "/size-guide", note: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="flex items-center gap-5 p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-zinc-900">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-zinc-500 truncate">{user.email}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Member since {joinDate}</p>
        </div>
        <button onClick={signOut}
          className="flex-shrink-0 text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors border border-zinc-200 hover:border-red-200 px-3 py-2 rounded-xl">
          Sign out
        </button>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((l) => (
          <Link key={l.label} href={l.href}
            className="group flex items-center gap-3 p-4 bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl transition-all card-lift">
            <span className="text-xl">{l.icon}</span>
            <div>
              <div className="text-sm font-semibold text-zinc-900">{l.label}</div>
              {l.note && <div className="text-xs text-zinc-400">{l.note}</div>}
            </div>
            <svg className="w-4 h-4 text-zinc-300 ml-auto arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Preferences */}
      <div className="p-6 bg-white border border-zinc-100 rounded-2xl">
        <h3 className="text-sm font-bold text-zinc-900 mb-4">Preferences</h3>
        <div className="space-y-3">
          {[
            { label: "Order updates", desc: "Shipping and delivery notifications" },
            { label: "New drops",     desc: "Be first to know about new arrivals" },
            { label: "Promotions",    desc: "Exclusive deals and member offers" },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-900">{pref.label}</div>
                <div className="text-xs text-zinc-400">{pref.desc}</div>
              </div>
              <button className="w-10 h-6 bg-zinc-900 rounded-full relative flex-shrink-0 transition-colors">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page content (uses useSearchParams, must be inside Suspense) */
function AccountContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router       = useRouter();

  const redirectTo = searchParams.get("redirect") || "/account";
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);

  // Redirect after successful sign-in/sign-up
  const handleSuccess = () => router.replace(redirectTo);

  // If already signed in and there's a redirect target, send them there
  useEffect(() => {
    if (user && redirectTo !== "/account") router.replace(redirectTo);
  }, [user, redirectTo, router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          {user ? (
            /* Dashboard */
            <div className="max-w-lg mx-auto">
              <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">Welcome back</p>
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">My Account</h1>
              </div>
              <Dashboard />
            </div>
          ) : (
            /* Auth form */
            <div className="max-w-sm mx-auto">
              {/* Logo + heading */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-6">
                  <span className="text-2xl font-black tracking-[0.15em] text-zinc-900">FENWALK</span>
                </Link>
                <h1 className="text-2xl font-black text-zinc-900 mb-1">
                  {tab === "signin" ? "Welcome back" : "Create account"}
                </h1>
                <p className="text-sm text-zinc-500">
                  {tab === "signin"
                    ? "Sign in to access your orders and favorites."
                    : "Join FENWALK for early access and exclusive perks."}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-zinc-50 rounded-xl p-1 mb-6">
                {(["signin", "signup"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                    }`}>
                    {t === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              {/* Form */}
              {tab === "signin"
                ? <SignInForm onSwitch={() => setTab("signup")} onSuccess={handleSuccess} />
                : <SignUpForm onSwitch={() => setTab("signin")} onSuccess={handleSuccess} />
              }

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-zinc-100" />
                <span className="text-xs text-zinc-400">or continue as guest</span>
                <div className="flex-1 h-px bg-zinc-100" />
              </div>

              <Link href="/#new-arrivals"
                className="block w-full text-center border border-zinc-200 hover:border-zinc-900 py-3.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors">
                Browse without account
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function AccountPage() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  );
}
