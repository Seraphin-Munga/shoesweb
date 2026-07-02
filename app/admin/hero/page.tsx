"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchAdminSettings, adminUpdateHero } from "../../lib/api";
import type { ApiHeroContent } from "../../lib/types";

type Field = { key: keyof ApiHeroContent; label: string; hint: string; multiline?: boolean };

const FIELDS: Field[] = [
  { key: "badge",           label: "Badge / Label",        hint: "Small text above the headline  e.g. Summer Collection — 2026" },
  { key: "headline",        label: "Headline",             hint: "Main hero text (plain). Each word renders on its own line.", multiline: true },
  { key: "accent",          label: "Accent Word",          hint: "Last word shown in gradient color  e.g. World." },
  { key: "subtext",         label: "Sub-text",             hint: "Short paragraph below the headline.", multiline: true },
  { key: "cta1Label",       label: "Primary Button",       hint: "Text on the filled button  e.g. Shop Now" },
  { key: "cta2Label",       label: "Secondary Button",     hint: "Text on the outline button  e.g. Browse Collections" },
  { key: "promoLabel",      label: "Promo Card Label",     hint: "Small tag above promo title  e.g. Limited Offer" },
  { key: "promoTitle",      label: "Promo Card Title",     hint: "Bold line  e.g. Free Shipping" },
  { key: "promoBody",       label: "Promo Card Body",      hint: "Small detail  e.g. Orders over R150" },
  { key: "bestSellerName",  label: "Best Seller Name",     hint: "Product name on the floating card  e.g. Air Vortex Pro" },
  { key: "bestSellerPrice", label: "Best Seller Price",    hint: "Price string  e.g. R1 899 or $189.99" },
];

const EMPTY: ApiHeroContent = {
  badge: "", headline: "", accent: "", subtext: "",
  cta1Label: "", cta2Label: "",
  promoLabel: "", promoTitle: "", promoBody: "",
  bestSellerName: "", bestSellerPrice: "",
};

export default function AdminHeroPage() {
  const { token }             = useAdminAuth();
  const [form, setForm]       = useState<ApiHeroContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!token) return;
    fetchAdminSettings(token)
      .then((s) => {
        setForm({
          badge:           s.heroBadge          ?? "",
          headline:        s.heroHeadline        ?? "",
          accent:          s.heroAccent          ?? "",
          subtext:         s.heroSubtext         ?? "",
          cta1Label:       s.heroCta1Label       ?? "",
          cta2Label:       s.heroCta2Label       ?? "",
          promoLabel:      s.heroPromoLabel      ?? "",
          promoTitle:      s.heroPromoTitle      ?? "",
          promoBody:       s.heroPromoBody       ?? "",
          bestSellerName:  s.heroBestSellerName  ?? "",
          bestSellerPrice: s.heroBestSellerPrice ?? "",
        });
      })
      .catch(() => setError("Failed to load hero settings."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      await adminUpdateHero(form, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof ApiHeroContent, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-5 h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Hero Banner</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Edit the home page hero content — changes reflect instantly on the storefront.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </>
          ) : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Live preview */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Live Preview</p>
        <div className="space-y-1">
          <p className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">{form.badge || "—"}</p>
          <div>
            {form.headline.trim().split(/\s+/).filter(Boolean).map((w, i) => (
              <p key={i} className="text-3xl font-black text-white leading-tight">{w}</p>
            ))}
            {form.accent && (
              <p className="text-3xl font-black leading-tight"
                style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {form.accent}
              </p>
            )}
          </div>
          {form.subtext && <p className="text-zinc-400 text-sm mt-2 max-w-xs">{form.subtext}</p>}
          <div className="flex gap-3 mt-3">
            {form.cta1Label && (
              <span className="text-xs font-bold px-4 py-2 rounded-full text-white"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                {form.cta1Label}
              </span>
            )}
            {form.cta2Label && (
              <span className="text-xs font-bold px-4 py-2 rounded-full text-zinc-200 border border-zinc-600">
                {form.cta2Label}
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-3">
            {(form.promoTitle || form.promoBody) && (
              <div className="bg-white/10 rounded-xl px-3 py-2">
                {form.promoLabel && <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{form.promoLabel}</p>}
                {form.promoTitle && <p className="text-xs font-bold text-white">{form.promoTitle}</p>}
                {form.promoBody  && <p className="text-[10px] text-zinc-400">{form.promoBody}</p>}
              </div>
            )}
            {(form.bestSellerName || form.bestSellerPrice) && (
              <div className="bg-white/10 rounded-xl px-3 py-2">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Best Seller</p>
                {form.bestSellerName  && <p className="text-xs font-bold text-white">{form.bestSellerName}</p>}
                {form.bestSellerPrice && (
                  <p className="text-sm font-black"
                    style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {form.bestSellerPrice}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fields grouped */}
      <div className="bg-white border border-zinc-100 rounded-2xl divide-y divide-zinc-50">

        {/* Section: Headline */}
        <div className="px-5 py-3 bg-zinc-50 rounded-t-2xl">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Headline</p>
        </div>
        {FIELDS.slice(0, 4).map(({ key, label, hint, multiline }) => (
          <div key={key} className="px-5 py-4">
            <label className="block text-xs font-bold text-zinc-700 mb-1">{label}</label>
            <p className="text-[11px] text-zinc-400 mb-2">{hint}</p>
            {multiline ? (
              <textarea
                rows={2}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-900 transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-900 transition-colors"
              />
            )}
          </div>
        ))}

        {/* Section: Buttons */}
        <div className="px-5 py-3 bg-zinc-50">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Call to Action</p>
        </div>
        {FIELDS.slice(4, 6).map(({ key, label, hint }) => (
          <div key={key} className="px-5 py-4">
            <label className="block text-xs font-bold text-zinc-700 mb-1">{label}</label>
            <p className="text-[11px] text-zinc-400 mb-2">{hint}</p>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-900 transition-colors"
            />
          </div>
        ))}

        {/* Section: Promo card */}
        <div className="px-5 py-3 bg-zinc-50">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Promo Floating Card</p>
        </div>
        {FIELDS.slice(6, 9).map(({ key, label, hint }) => (
          <div key={key} className="px-5 py-4">
            <label className="block text-xs font-bold text-zinc-700 mb-1">{label}</label>
            <p className="text-[11px] text-zinc-400 mb-2">{hint}</p>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-900 transition-colors"
            />
          </div>
        ))}

        {/* Section: Best Seller card */}
        <div className="px-5 py-3 bg-zinc-50">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Best Seller Floating Card</p>
        </div>
        {FIELDS.slice(9).map(({ key, label, hint }) => (
          <div key={key} className="px-5 py-4 last:rounded-b-2xl">
            <label className="block text-xs font-bold text-zinc-700 mb-1">{label}</label>
            <p className="text-[11px] text-zinc-400 mb-2">{hint}</p>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-900 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Save bottom */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-zinc-900 text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
