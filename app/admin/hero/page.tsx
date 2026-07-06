"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchAdminSettings, adminUpdateHero, adminUploadHeroBanner } from "../../lib/api";
import type { ApiHeroContent } from "../../lib/types";

const EMPTY: ApiHeroContent = {
  badge: "", headline: "", accent: "", subtext: "",
  cta1Label: "", cta1Url: "",
  cta2Label: "", cta2Url: "",
  promoLabel: "", promoTitle: "", promoBody: "",
  bestSellerName: "", bestSellerPrice: "",
  bannerImageUrl: "",
};

const DEFAULT_BANNER = "/shoe-banner.png";

type SectionField = {
  key: keyof ApiHeroContent;
  label: string;
  hint: string;
  multiline?: boolean;
  placeholder?: string;
};

const SECTIONS: { title: string; fields: SectionField[] }[] = [
  {
    title: "Headline",
    fields: [
      { key: "badge",    label: "Badge / Label",    hint: 'Small text above the headline, e.g. "Summer Collection, 2026"', placeholder: "Summer Collection, 2026" },
      { key: "headline", label: "Headline",          hint: "Main hero text. Each space-separated word renders on its own line.", multiline: true, placeholder: "Step Into Your" },
      { key: "accent",   label: "Accent Word",       hint: "Last word shown in gradient colour, usually ends with a period.", placeholder: "World." },
      { key: "subtext",  label: "Sub-text",          hint: "Short paragraph below the headline.", multiline: true, placeholder: "Premium footwear engineered for every stride." },
    ],
  },
  {
    title: "Call to Action Buttons",
    fields: [
      { key: "cta1Label", label: "Primary Button, Label", hint: 'Text on the filled gradient button, e.g. "Shop Now"', placeholder: "Shop Now" },
      { key: "cta1Url",   label: "Primary Button, Link",  hint: 'Where it navigates to, e.g. "/products" or "#new-arrivals"', placeholder: "/products" },
      { key: "cta2Label", label: "Secondary Button, Label", hint: 'Text on the outline button, e.g. "Browse Collections"', placeholder: "Browse Collections" },
      { key: "cta2Url",   label: "Secondary Button, Link",  hint: 'Where it navigates to, e.g. "/products?category=all" or "#categories"', placeholder: "#categories" },
    ],
  },
  {
    title: "Promo Floating Card",
    fields: [
      { key: "promoLabel", label: "Promo Card Label", hint: 'Small tag above the title, e.g. "Limited Offer"', placeholder: "Limited Offer" },
      { key: "promoTitle", label: "Promo Card Title", hint: 'Bold line, e.g. "Free Shipping"', placeholder: "Free Shipping" },
      { key: "promoBody",  label: "Promo Card Body",  hint: 'Small detail line, e.g. "Orders over R1 500"', placeholder: "Orders over R1 500" },
    ],
  },
  {
    title: "Best Seller Floating Card",
    fields: [
      { key: "bestSellerName",  label: "Product Name",  hint: "Name shown on the floating card", placeholder: "Air Vortex Pro" },
      { key: "bestSellerPrice", label: "Product Price", hint: 'Price string, e.g. "R1 899" or "$189.99"', placeholder: "R1 899" },
    ],
  },
];

/* ── Live Preview ─────────────────────────────────────────── */
function HeroPreview({ form }: { form: ApiHeroContent }) {
  const imgSrc = form.bannerImageUrl.trim() || DEFAULT_BANNER;

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-5 pt-4 pb-3 border-b border-zinc-800">
        Live Preview
      </p>

      {/* Mini hero scene */}
      <div className="relative h-56 sm:h-72 overflow-hidden">

        {/* Background image */}
        <Image
          src={imgSrc}
          alt="Banner preview"
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover object-center"
          unoptimized={imgSrc.startsWith("http")}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-zinc-900/20" />

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 h-[3px] w-full"
          style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)" }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-5 max-w-xs">
          {form.badge && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }} />
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-zinc-400">{form.badge}</span>
            </div>
          )}

          <div className="mb-2">
            {form.headline.trim().split(/\s+/).filter(Boolean).map((w, i) => (
              <p key={i} className="text-2xl font-black text-white leading-tight">{w}</p>
            ))}
            {form.accent && (
              <p className="text-2xl font-black leading-tight"
                style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {form.accent}
              </p>
            )}
          </div>

          {form.subtext && (
            <p className="text-zinc-400 text-[11px] leading-relaxed mb-3 line-clamp-2">{form.subtext}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {form.cta1Label && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                {form.cta1Label}
              </span>
            )}
            {form.cta2Label && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full text-zinc-200 border border-zinc-600">
                {form.cta2Label}
              </span>
            )}
          </div>
        </div>

        {/* Floating cards, top right */}
        {(form.promoTitle || form.promoBody) && (
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10 hidden sm:block">
            {form.promoLabel && <p className="text-[8px] text-zinc-400 uppercase tracking-widest">{form.promoLabel}</p>}
            {form.promoTitle && <p className="text-[11px] font-bold text-white">{form.promoTitle}</p>}
            {form.promoBody  && <p className="text-[10px] text-zinc-400">{form.promoBody}</p>}
          </div>
        )}

        {/* Floating card, bottom right */}
        {(form.bestSellerName || form.bestSellerPrice) && (
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10 hidden sm:block">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest">Best Seller</span>
            </div>
            {form.bestSellerName  && <p className="text-[11px] font-bold text-white">{form.bestSellerName}</p>}
            {form.bestSellerPrice && (
              <p className="text-sm font-black"
                style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {form.bestSellerPrice}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA link hints */}
      {(form.cta1Url || form.cta2Url) && (
        <div className="px-5 py-3 border-t border-zinc-800 flex flex-wrap gap-4 text-[10px] text-zinc-500">
          {form.cta1Url && (
            <span>
              <span className="text-zinc-400 font-semibold">Primary →</span> {form.cta1Url}
            </span>
          )}
          {form.cta2Url && (
            <span>
              <span className="text-zinc-400 font-semibold">Secondary →</span> {form.cta2Url}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Banner Upload ────────────────────────────────────────── */
function BannerUpload({ currentUrl, token, onUploaded, onUrlChange }: {
  currentUrl: string;
  token: string | null;
  onUploaded: (url: string) => void;
  onUrlChange: (url: string) => void;
}) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging]   = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setUploadError("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError("Image must be under 10 MB."); return; }
    setUploadError("");
    setLocalPreview(URL.createObjectURL(file));

    if (!token) {
      // No token (fallback dev login), just keep the local preview URL
      setUploadError("No API token, image previewed locally only. Log in with a real account to upload.");
      return;
    }
    setUploading(true);
    try {
      const url = await adminUploadHeroBanner(file, token);
      onUploaded(url);
      setLocalPreview(null);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const displaySrc = localPreview || currentUrl || DEFAULT_BANNER;

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Banner Background Image</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Current / preview image */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-zinc-100">
          <Image
            src={displaySrc}
            alt="Banner preview"
            fill
            className="object-cover object-center"
            unoptimized={displaySrc.startsWith("http") || displaySrc.startsWith("blob:")}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
          }`}
        >
          <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-semibold text-zinc-600">
            {uploading ? "Uploading…" : "Click or drag an image here"}
          </p>
          <p className="text-xs text-zinc-400">JPG, PNG or WebP · max 10 MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }} />
        </div>

        {uploadError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{uploadError}</p>
        )}

        {/* Manual URL fallback */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 mb-1.5">
            Or paste an image URL directly
          </label>
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/banner.jpg"
            className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2.5 outline-none focus:border-zinc-900 transition-colors font-mono"
          />
          <p className="text-[11px] text-zinc-400 mt-1">Leave blank to use the default shoe image.</p>
        </div>

        {currentUrl && (
          <button type="button" onClick={() => { onUploaded(""); setLocalPreview(null); }}
            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
            ✕ Remove, revert to default
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
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
          badge:           s.heroBadge           ?? "",
          headline:        s.heroHeadline         ?? "",
          accent:          s.heroAccent           ?? "",
          subtext:         s.heroSubtext          ?? "",
          cta1Label:       s.heroCta1Label        ?? "",
          cta1Url:         s.heroCta1Url          ?? "",
          cta2Label:       s.heroCta2Label        ?? "",
          cta2Url:         s.heroCta2Url          ?? "",
          promoLabel:      s.heroPromoLabel       ?? "",
          promoTitle:      s.heroPromoTitle       ?? "",
          promoBody:       s.heroPromoBody        ?? "",
          bestSellerName:  s.heroBestSellerName   ?? "",
          bestSellerPrice: s.heroBestSellerPrice  ?? "",
          bannerImageUrl:  s.heroBannerImageUrl   ?? "",
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
    } catch (e) {
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
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-5 h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Hero Banner</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            All banner details, text, buttons, links, and the background image, are editable here.
            Changes reflect on the storefront once saved.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-shrink-0 flex items-center gap-2 bg-zinc-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
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
              Saved!
            </>
          ) : "Save Changes"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Live preview */}
      <HeroPreview form={form} />

      {/* Banner image upload */}
      <BannerUpload
        currentUrl={form.bannerImageUrl}
        token={token}
        onUploaded={(url) => set("bannerImageUrl", url)}
        onUrlChange={(url) => set("bannerImageUrl", url)}
      />

      {/* Field sections */}
      {SECTIONS.map((section, si) => (
        <div key={section.title} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{section.title}</p>
          </div>
          <div className="divide-y divide-zinc-50">
            {section.fields.map(({ key, label, hint, multiline, placeholder }) => (
              <div key={key} className="px-5 py-4">
                <label className="block text-xs font-bold text-zinc-700 mb-1">{label}</label>
                <p className="text-[11px] text-zinc-400 mb-2">{hint}</p>
                {multiline ? (
                  <textarea
                    rows={2}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2.5 outline-none focus:border-zinc-900 transition-colors resize-none"
                  />
                ) : (
                  <input
                    type={key.endsWith("Url") ? "url" : "text"}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2.5 outline-none focus:border-zinc-900 transition-colors font-mono"
                  />
                )}
                {/* Show a live character count for longer text fields */}
                {(key === "subtext" || key === "headline") && form[key].length > 0 && (
                  <p className="text-[10px] text-zinc-300 mt-1 text-right">{form[key].length} chars</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save bottom */}
      <div className="flex items-center justify-between pb-8">
        <p className="text-xs text-zinc-400">
          Changes are applied to the live storefront immediately after saving.
        </p>
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
