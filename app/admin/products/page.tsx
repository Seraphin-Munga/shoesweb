"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  fetchProducts, fetchProduct, fetchCategories, fetchColors,
  adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminUploadProductImages, adminUpsertDiscount, adminRemoveDiscount,
  fetchAdminSettings,
} from "../../lib/api";
import { formatZar, toZar, fromZar } from "../../lib/currency";
import RichTextEditor from "../../components/RichTextEditor";
import type { ApiProduct, ApiCategory, ApiColorFull } from "../../lib/types";

/* ─── Shoe thumb ─────────────────────────────────────────── */
function ShoeThumb({ bgColor, imageUrl, name }: { bgColor: string; imageUrl?: string; name: string }) {
  return (
    <div className="w-10 h-8 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: bgColor || "#f4f4f5" }}>
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={40} height={32} className="object-cover w-full h-full" unoptimized />
      ) : (
        <svg viewBox="0 0 280 160" className="w-8 h-5" aria-hidden="true">
          <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
          <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
        </svg>
      )}
    </div>
  );
}

/* ─── Discount modal ─────────────────────────────────────── */
function DiscountModal({ product, token, onClose, onSaved }: {
  product: ApiProduct; token: string | null;
  onClose: () => void; onSaved: () => void;
}) {
  const hasDiscount = !!product.discountPercent;
  const [percent, setPercent]   = useState(hasDiscount ? String(product.discountPercent) : "");
  const [label, setLabel]       = useState(product.discountLabel ?? "");
  const [saving, setSaving]     = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError]       = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("Not authenticated."); return; }
    const p = parseFloat(percent);
    if (!p || p <= 0 || p >= 100) { setError("Percent must be between 1 and 99."); return; }
    setSaving(true);
    try {
      await adminUpsertDiscount(product.id, { label: label || undefined, percent: p, isActive: true }, token!);
      onSaved();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  };

  const handleRemove = async () => {
    if (!token) return;
    setRemoving(true);
    try { await adminRemoveDiscount(product.id, token); onSaved(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setRemoving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-black text-zinc-900 mb-1">Discount, {product.name}</h3>
        <p className="text-xs text-zinc-400 mb-5">Base price: {formatZar(product.price)}</p>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Label (optional)</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Summer Sale"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Discount % *</label>
            <input required type="number" min="1" max="99" step="0.5" value={percent} onChange={(e) => setPercent(e.target.value)}
              placeholder="e.g. 15"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
            {percent && !isNaN(parseFloat(percent)) && (
              <p className="text-[10px] text-green-600 mt-1">
                Discounted price: {formatZar(product.price * (1 - parseFloat(percent) / 100))}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            {hasDiscount && (
              <button type="button" onClick={handleRemove} disabled={removing}
                className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors">
                {removing ? "Removing…" : "Remove Discount"}
              </button>
            )}
            <button type="button" onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Product form ───────────────────────────────────────── */
type ProductFormData = {
  name: string; brand: string; gender: "Men" | "Women";
  priceZar: string; originalPriceZar: string;
  badge: string; bgColor: string; description: string;
  categoryId: number | null; stockQuantity: string;
  sizes: string; features: string; colorIds: number[]; isActive: boolean;
};

function EMPTY_FORM(): ProductFormData {
  return {
    name: "", brand: "", gender: "Men",
    priceZar: "", originalPriceZar: "",
    badge: "", bgColor: "#f4f4f5", description: "",
    categoryId: null, stockQuantity: "0",
    sizes: "7,8,9,10,11,12", features: "", colorIds: [], isActive: true,
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function ProductModal({ product, apiCategories, apiColors, token, onClose, onSaved }: {
  product: ApiProduct | null;
  apiCategories: ApiCategory[];
  apiColors: ApiColorFull[];
  token: string | null;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!product;
  const [zarRate, setZarRate]     = useState(18.5);
  const [form, setForm]         = useState<ProductFormData>(EMPTY_FORM());
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!token) return;
    fetchAdminSettings(token)
      .then((s) => setZarRate(s.usdToZarRate))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        brand: product.brand,
        gender: product.gender === "Women" ? "Women" : "Men",
        priceZar: String(toZar(product.price, zarRate)),
        originalPriceZar: product.originalPrice ? String(toZar(product.originalPrice, zarRate)) : "",
        badge: product.badge ?? "",
        bgColor: product.bgColor,
        description: product.description ?? "",
        categoryId: product.categoryId ?? null,
        stockQuantity: String(product.stockQuantity ?? 0),
        sizes: product.sizes.join(","),
        features: (product.features ?? []).join("\n"),
        colorIds: product.colors.map((c) => c.id),
        isActive: product.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM());
    }
  }, [product, zarRate]);

  const MAX_IMAGES = 4;
  const initPreviews: { src: string; file: File | null }[] = product
    ? (product.imageUrls ?? [])
        .slice(0, MAX_IMAGES)
        .map((src) => ({ src, file: null }))
    : [];

  const [images, setImages] = useState<{ src: string; file: File | null }[]>(initPreviews);
  const [dragging, setDragging] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    setImages((prev) => [
      ...prev,
      ...toAdd.map((f) => ({ src: URL.createObjectURL(f), file: f })),
    ]);
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const moveImage = (from: number, to: number) =>
    setImages((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  const set = (k: keyof ProductFormData, v: string | boolean | number | null | number[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleColor = (id: number) =>
    set("colorIds", form.colorIds.includes(id)
      ? form.colorIds.filter((c) => c !== id)
      : [...form.colorIds, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("Not authenticated."); return; }
    if (!stripHtml(form.description)) { setError("Description is required."); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        name: form.name.trim(), brand: form.brand.trim(),
        gender: form.gender,
        price: fromZar(parseFloat(form.priceZar), zarRate),
        originalPrice: form.originalPriceZar ? fromZar(parseFloat(form.originalPriceZar), zarRate) : null,
        badge: form.badge.trim() || null, bgColor: form.bgColor,
        description: form.description.trim(),
        categoryId: form.categoryId,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        sizes: form.sizes.split(",").map((s) => parseInt(s.trim())).filter(Boolean),
        features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
        colorIds: form.colorIds,
        isActive: form.isActive,
      };

      let saved: ApiProduct;
      if (isEdit) saved = await adminUpdateProduct(product!.id, payload, token) as ApiProduct;
      else        saved = await adminCreateProduct(payload, token) as ApiProduct;

      const newFiles = images.map((img) => img.file);
      if (newFiles.some(Boolean)) await adminUploadProductImages(saved.id, newFiles, token);
      onSaved();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="font-black text-zinc-900 text-base">{isEdit ? `Edit, ${product!.name}` : "Add New Product"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Product Images
              </label>
              <span className="text-[10px] text-zinc-400">{images.length} / {MAX_IMAGES}, first image is main</span>
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[5/4]"
                    style={{ backgroundColor: form.bgColor }}>
                    <Image src={img.src} alt={`image ${idx + 1}`} fill unoptimized className="object-cover" />

                    {/* Main badge */}
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-zinc-900/70 text-white px-1.5 py-0.5 rounded-full">
                        Main
                      </span>
                    )}

                    {/* Hover controls */}
                    <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {idx > 0 && (
                        <button type="button" onClick={() => moveImage(idx, idx - 1)} title="Move left"
                          className="w-6 h-6 rounded-full bg-white/90 text-zinc-800 text-xs font-bold flex items-center justify-center hover:bg-white transition-colors">
                          ←
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button type="button" onClick={() => moveImage(idx, idx + 1)} title="Move right"
                          className="w-6 h-6 rounded-full bg-white/90 text-zinc-800 text-xs font-bold flex items-center justify-center hover:bg-white transition-colors">
                          →
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(idx)} title="Remove"
                        className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition-colors">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            {images.length < MAX_IMAGES && (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                className={`flex flex-col items-center justify-center gap-2 w-full py-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  dragging ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"
                }`}>
                <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-xs font-semibold text-zinc-400">
                  {dragging ? "Drop to add" : `Click or drag images (${MAX_IMAGES - images.length} remaining)`}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Brand *</label>
              <input required value={form.brand} onChange={(e) => set("brand", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">For *</label>
            <div className="flex gap-2">
              {(["Men", "Women"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set("gender", g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    form.gender === g
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Price (ZAR) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">R</span>
                <input required type="number" step="0.01" min="0" value={form.priceZar} onChange={(e) => set("priceZar", e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Original ZAR</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">R</span>
                <input type="number" step="0.01" min="0" value={form.originalPriceZar} onChange={(e) => set("originalPriceZar", e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-zinc-200 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Stock Qty</label>
              <input type="number" min="0" value={form.stockQuantity} onChange={(e) => set("stockQuantity", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Category</label>
              <select value={form.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value ? parseInt(e.target.value) : null)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors bg-white">
                <option value="">None</option>
                {apiCategories.filter((c) => c.isActive).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Badge</label>
              <select value={form.badge} onChange={(e) => set("badge", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors bg-white">
                <option value="">None</option>
                <option value="New">New</option><option value="Sale">Sale</option>
                <option value="Hot">Hot</option><option value="Limited">Limited</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Bg Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer p-0.5" />
                <input value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)}
                  className="flex-1 border border-zinc-200 rounded-xl px-2 py-2.5 text-xs outline-none focus:border-zinc-900 transition-colors font-mono" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Description *</label>
            <RichTextEditor
              value={form.description}
              onChange={(html) => set("description", html)}
              placeholder="Describe the product, materials, fit, features…"
            />
          </div>

          {/* Colors, multi-select from API */}
          {apiColors.length > 0 && (
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Colors</label>
              <div className="flex flex-wrap gap-2">
                {apiColors.filter((c) => c.isActive).map((color) => (
                  <button key={color.id} type="button" title={color.name}
                    onClick={() => toggleColor(color.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      form.colorIds.includes(color.id)
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                    }`}>
                    <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
              {form.colorIds.length === 0 && <p className="text-[10px] text-zinc-400 mt-1">No colors selected, all colors available.</p>}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Sizes (comma-separated)</label>
            <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="7,8,9,10,11,12"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Features (one per line)</label>
            <textarea rows={3} value={form.features} onChange={(e) => set("features", e.target.value)}
              placeholder={"Responsive foam midsole\nBreathable mesh upper"}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer" onClick={() => set("isActive", !form.isActive)}>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-zinc-900" : "bg-zinc-200"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-medium text-zinc-700">Active (visible in store)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete confirm ─────────────────────────────────────── */
function DeleteConfirm({ product, token, onClose, onDeleted }: {
  product: ApiProduct; token: string | null; onClose: () => void; onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState("");

  const handleDelete = async () => {
    if (!token) { setError("Not authenticated."); return; }
    setDeleting(true);
    try { await adminDeleteProduct(product.id, token); onDeleted(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-black text-zinc-900 mb-1">Delete product?</h3>
        <p className="text-sm text-zinc-500 mb-1">{product.name}</p>
        <p className="text-xs text-zinc-400 mb-5">Soft-deleted, can be restored from the database.</p>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sort icon ──────────────────────────────────────────── */
type SortKey = "name" | "price" | "reviewCount" | "rating";

function SortIcon({ k, sort, dir }: { k: SortKey; sort: SortKey; dir: "asc" | "desc" }) {
  return (
    <svg className={`w-3 h-3 inline ml-1 ${sort === k ? "opacity-100" : "opacity-20"}`} fill="currentColor" viewBox="0 0 20 20">
      <path d={dir === "asc" || sort !== k
        ? "M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm10 0a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L13 14.586V11z"
        : "M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm13-4a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414-1.414L16 7.586V4z"
      } />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
const PAGE_SIZE = 20;
const API_SORT: Record<SortKey, string> = {
  name: "newest", price: "price-asc", reviewCount: "popular", rating: "rating",
};

export default function AdminProductsPage() {
  const { token } = useAdminAuth();

  const [products, setProducts]       = useState<ApiProduct[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [catFilter, setCat]           = useState("All");
  const [sort, setSort]               = useState<SortKey>("name");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("asc");
  const [page, setPage]               = useState(1);
  const [apiCategories, setApiCats]   = useState<ApiCategory[]>([]);
  const [apiColors, setApiColors]     = useState<ApiColorFull[]>([]);
  const [editProduct, setEdit]        = useState<ApiProduct | null | undefined>(undefined);
  const [deleteProduct, setDelete]    = useState<ApiProduct | null>(null);
  const [discountProduct, setDiscount] = useState<ApiProduct | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const selectedCat = apiCategories.find((c) => c.name === catFilter);
      const [res, cats, colors] = await Promise.all([
        fetchProducts({
          search: search || undefined,
          categoryId: selectedCat?.id,
          sort: API_SORT[sort], page, pageSize: PAGE_SIZE,
        }),
        apiCategories.length === 0 ? fetchCategories() : Promise.resolve(apiCategories),
        apiColors.length === 0     ? fetchColors()     : Promise.resolve(apiColors),
      ]);
      setProducts(res.items);
      setTotal(res.total);
      if (apiCategories.length === 0) setApiCats(cats);
      if (apiColors.length === 0)     setApiColors(colors);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [search, catFilter, sort, page]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  const sorted = [...products].sort((a, b) => {
    let cmp = 0;
    if (sort === "name")        cmp = a.name.localeCompare(b.name);
    if (sort === "price")       cmp = a.price - b.price;
    if (sort === "reviewCount") cmp = a.reviewCount - b.reviewCount;
    if (sort === "rating")      cmp = a.rating - b.rating;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 bg-white rounded-xl outline-none focus:border-zinc-400 transition-colors" />
        </div>
        <select value={catFilter} onChange={(e) => { setCat(e.target.value); setPage(1); }}
          className="text-sm font-medium border border-zinc-200 bg-white rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-zinc-400 transition-colors">
          <option value="All">All Categories</option>
          {apiCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <button onClick={() => setEdit(null)}
          className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {[
                  { label: "Product",  key: "name"        as SortKey },
                  { label: "For",      key: null },
                  { label: "Category", key: null },
                  { label: "Price",    key: "price"       as SortKey },
                  { label: "Stock",    key: null },
                  { label: "Rating",   key: "rating"      as SortKey },
                  { label: "Discount", key: null },
                  { label: "Status",   key: null },
                  { label: "",         key: null },
                ].map(({ label, key }) => (
                  <th key={label}
                    onClick={key ? () => { if (sort === key) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSort(key); setSortDir("asc"); } } : undefined}
                    className={`text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-5 py-3.5 ${key ? "cursor-pointer hover:text-zinc-700 select-none" : ""}`}>
                    {label}{key && <SortIcon k={key} sort={sort} dir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-8 rounded-lg bg-zinc-100 flex-shrink-0" /><div><div className="h-3.5 w-28 bg-zinc-100 rounded-full mb-1" /><div className="h-2.5 w-16 bg-zinc-100 rounded-full" /></div></div></td>
                    {[1,2,3,4,5,6,7].map((j) => <td key={j} className="px-5 py-4"><div className="h-3 w-16 bg-zinc-100 rounded-full" /></td>)}
                    <td className="px-5 py-4" />
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-16 text-center text-zinc-400 text-sm">
                  {search || catFilter !== "All" ? "No products match." : "No products yet."}
                </td></tr>
              ) : sorted.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ShoeThumb bgColor={p.bgColor} imageUrl={p.imageUrls[0]} name={p.name} />
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{p.name}</div>
                        <div className="text-xs text-zinc-400">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">
                      {p.gender ?? "Men"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">{p.category ?? "-"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-zinc-900">{formatZar(p.price)}</span>
                    {p.originalPrice && <span className="text-xs text-zinc-400 line-through ml-1.5">{formatZar(p.originalPrice)}</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.isInStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    }`}>
                      {p.isInStock ? `${p.stockQuantity} in stock` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 fill-zinc-900" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-zinc-700">{p.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {p.discountPercent ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        {p.discountPercent}% off
                      </span>
                    ) : <span className="text-xs text-zinc-300"></span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      p.badge === "Sale" ? "bg-amber-50 text-amber-700" :
                      p.badge === "New"  ? "bg-green-50 text-green-700" :
                      p.badge === "Hot"  ? "bg-orange-50 text-orange-600" :
                      p.badge === "Limited" ? "bg-red-50 text-red-600" :
                      "bg-zinc-100 text-zinc-500"
                    }`}>{p.badge ?? "Active"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/product/${p.id}`} target="_blank"
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors" title="View">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <button onClick={() => setDiscount(p)}
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-amber-600 hover:border-amber-200 transition-colors" title="Discount">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M17 17h.01M6.5 6.5l11 11M6 6l2-2a2 2 0 012.8 0l1.2 1.2a2 2 0 002.8 0L17 4a2 2 0 012.8 0L21 5.5" />
                        </svg>
                      </button>
                      <button onClick={async () => { const full = await fetchProduct(p.id); setEdit(full as ApiProduct); }}
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors" title="Edit">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDelete(p)}
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 transition-colors" title="Delete">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400">{total} product{total !== 1 ? "s" : ""}</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="text-xs font-semibold border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Prev</button>
              <span className="text-xs text-zinc-500 px-2">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                className="text-xs font-semibold border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next →</button>
            </div>
          )}
        </div>
      </div>

      {editProduct !== undefined && (
        <ProductModal product={editProduct} apiCategories={apiCategories} apiColors={apiColors} token={token}
          onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); load(); }} />
      )}
      {deleteProduct && (
        <DeleteConfirm product={deleteProduct} token={token}
          onClose={() => setDelete(null)} onDeleted={() => { setDelete(null); load(); }} />
      )}
      {discountProduct && (
        <DiscountModal product={discountProduct} token={token}
          onClose={() => setDiscount(null)} onSaved={() => { setDiscount(null); load(); }} />
      )}
    </div>
  );
}
