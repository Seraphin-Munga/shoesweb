"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "stryde_cookie_consent";

type Prefs = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_PREFS: Prefs = {
  necessary:  true,
  functional: false,
  analytics:  false,
  marketing:  false,
};

function CookieIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 flex-shrink-0">
      <circle cx="20" cy="20" r="18" fill="#18181b" />
      {/* cookie base */}
      <ellipse cx="20" cy="20" rx="11" ry="11" fill="#d4a96a" />
      <ellipse cx="20" cy="20" rx="11" ry="11" fill="url(#cg)" />
      {/* chips */}
      <circle cx="16" cy="17" r="2"   fill="#7c4a1a" />
      <circle cx="23" cy="15" r="1.5" fill="#7c4a1a" />
      <circle cx="22" cy="23" r="2"   fill="#7c4a1a" />
      <circle cx="15" cy="24" r="1.5" fill="#7c4a1a" />
      <circle cx="20" cy="20" r="1.2" fill="#7c4a1a" />
      {/* bite mark */}
      <circle cx="28.5" cy="13" r="5" fill="#18181b" />
      <defs>
        <radialGradient id="cg" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5d49a" />
          <stop offset="100%" stopColor="#c8882a" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Toggle({ checked, onChange, disabled }: {
  checked: boolean; onChange: () => void; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        checked ? "bg-zinc-900" : "bg-zinc-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  );
}

export default function CookieBanner() {
  const [visible, setVisible]     = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [prefs, setPrefs]         = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Small delay so it slides in after page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (p: Prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setVisible(false);
  };

  const acceptAll  = () => save({ necessary: true, functional: true, analytics: true, marketing: true });
  const rejectAll  = () => save({ ...DEFAULT_PREFS });
  const saveCustom = () => save(prefs);

  if (!visible) return null;

  const COOKIE_TYPES: {
    key: keyof Omit<Prefs, "necessary">;
    label: string;
    desc: string;
  }[] = [
    {
      key:   "functional",
      label: "Functional",
      desc:  "Remembers your preferences like size, colour, and language so you don't have to set them again.",
    },
    {
      key:   "analytics",
      label: "Analytics",
      desc:  "Helps us understand how visitors interact with our site so we can improve your experience.",
    },
    {
      key:   "marketing",
      label: "Marketing",
      desc:  "Used to deliver personalised ads and track the effectiveness of our campaigns.",
    },
  ];

  return (
    <>
      {/* Backdrop (only in expanded mode) */}
      {expanded && (
        <div
          className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Banner / drawer */}
      <div className={`fixed z-[999] transition-all duration-500 ease-out ${
        expanded
          ? "inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px]"
          : "inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px]"
      }`}
        style={{ animation: "cookieSlide 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div className={`bg-white shadow-2xl shadow-zinc-900/20 border border-zinc-100 overflow-hidden ${
          expanded ? "rounded-t-3xl sm:rounded-3xl" : "rounded-3xl"
        }`}>

          {/* ── Compact banner ── */}
          {!expanded && (
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4 mb-4">
                <CookieIcon />
                <div className="min-w-0">
                  <h3 className="font-black text-zinc-900 text-base leading-snug mb-1">
                    We use cookies
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    We use cookies to personalise your experience, analyse traffic, and improve our site.
                    You can choose what to allow.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-zinc-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setExpanded(true)}
                  className="flex-1 border border-zinc-200 text-zinc-700 text-xs font-bold py-3 rounded-xl hover:border-zinc-400 transition-colors"
                >
                  Customise
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 border border-zinc-100 text-zinc-400 text-xs font-semibold py-3 rounded-xl hover:border-zinc-300 hover:text-zinc-600 transition-colors"
                >
                  Reject All
                </button>
              </div>
            </div>
          )}

          {/* ── Expanded preferences ── */}
          {expanded && (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <CookieIcon />
                  <div>
                    <h3 className="font-black text-zinc-900 text-base">Cookie Preferences</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Manage what we store on your device</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="w-8 h-8 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cookie types */}
              <div className="px-6 py-4 space-y-4 max-h-72 overflow-y-auto">

                {/* Necessary — always on */}
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-zinc-900">Necessary</span>
                      <span className="text-[9px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Always on
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Essential for the site to function. Includes your session, cart, and security tokens.
                    </p>
                  </div>
                  <Toggle checked disabled onChange={() => {}} />
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-50" />

                {COOKIE_TYPES.map(({ key, label, desc }, i) => (
                  <div key={key}>
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zinc-900 mb-0.5">{label}</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
                      </div>
                      <Toggle
                        checked={prefs[key]}
                        onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                      />
                    </div>
                    {i < COOKIE_TYPES.length - 1 && <div className="border-t border-zinc-50 mt-4" />}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex flex-col gap-2">
                <button
                  onClick={acceptAll}
                  className="w-full bg-zinc-900 text-white text-xs font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Accept All
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={saveCustom}
                    className="flex-1 border border-zinc-200 text-zinc-700 text-xs font-bold py-3 rounded-xl hover:border-zinc-400 transition-colors"
                  >
                    Save My Choices
                  </button>
                  <button
                    onClick={rejectAll}
                    className="flex-1 border border-zinc-100 text-zinc-400 text-xs font-semibold py-3 rounded-xl hover:border-zinc-300 hover:text-zinc-600 transition-colors"
                  >
                    Reject All
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 text-center mt-1">
                  You can change these settings anytime in our{" "}
                  <a href="/privacy" className="underline hover:text-zinc-700 transition-colors">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cookieSlide {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
