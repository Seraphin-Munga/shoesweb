"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="py-24 bg-zinc-900">
      <div className="max-w-2xl mx-auto px-6 text-center">

        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-3">
          Exclusive Access
        </p>
        <h2 className="text-4xl font-black text-white tracking-tight mb-4">
          Be First. Always.
        </h2>
        <p className="text-zinc-400 text-base leading-relaxed mb-10">
          Join the STRYDE community. Early access to drops, member discounts,
          and style inspiration — straight to your inbox.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-bold">You&apos;re in!</p>
            <p className="text-zinc-500 text-sm">Check your inbox for a welcome gift from STRYDE.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-white/8 border border-white/15 focus:border-white/40 rounded-full px-5 py-3.5 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200"
            />
            <button type="submit"
              className="flex-shrink-0 bg-white text-zinc-900 font-bold text-sm px-7 py-3.5 rounded-full hover:bg-zinc-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        )}

        {!submitted && (
          <p className="text-zinc-700 text-xs mt-4">No spam · Unsubscribe anytime · 50,000+ subscribers</p>
        )}
      </div>
    </section>
  );
}
