"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  fetchCategories, adminCreateCategory, adminUpdateCategory,
  adminDeleteCategory, adminUploadCategoryImage,
} from "../../lib/api";
import { formatZar } from "../../lib/currency";
import { useAdminAuth } from "../context/AdminAuthContext";
import type { ApiCategory } from "../../lib/types";

function getCatIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("run"))    return "🏃";
  if (n.includes("casual")) return "👟";
  if (n.includes("trail"))  return "🥾";
  if (n.includes("sale"))   return "🔥";
  if (n.includes("sport"))  return "⚽";
  if (n.includes("hike"))   return "🏔️";
  return "📦";
}

/* ─── Category Modal (create / edit) ────────────────────── */
function CategoryModal({ category, token, onClose, onSaved }: {
  category: ApiCategory | null; token: string | null;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!category;
  const [name, setName]           = useState(category?.name ?? "");
  const [description, setDesc]    = useState(category?.description ?? "");
  const [isActive, setActive]     = useState(category?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("Not authenticated."); return; }
    if (!name.trim()) { setError("Name is required."); return; }
    setSaving(true); setError("");
    try {
      if (isEdit) {
        await adminUpdateCategory(category!.id, {
          name: name.trim(), description: description.trim() || undefined,
          isActive, sortOrder: parseInt(sortOrder) || 0,
        }, token);
      } else {
        await adminCreateCategory({
          name: name.trim(), description: description.trim() || undefined,
          isActive, sortOrder: parseInt(sortOrder) || 0,
        }, token);
      }
      onSaved();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-black text-zinc-900 mb-5">{isEdit ? `Edit, ${category!.name}` : "New Category"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Trail Running"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Optional short description"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Sort Order</label>
            <input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
            <p className="text-[10px] text-zinc-400 mt-1">Lower = appears first in filters.</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer" onClick={() => setActive(!isActive)}>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${isActive ? "bg-zinc-900" : "bg-zinc-200"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-medium text-zinc-700">Active (visible in store)</span>
          </label>
          {isEdit && (
            <p className="text-[10px] text-zinc-400">To upload a category image, use the image button on the card.</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete confirm ─────────────────────────────────────── */
function DeleteConfirm({ category, token, onClose, onDeleted }: {
  category: ApiCategory; token: string | null;
  onClose: () => void; onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState("");

  const handleDelete = async () => {
    if (!token) { setError("Not authenticated."); return; }
    setDeleting(true);
    try { await adminDeleteCategory(category.id, token); onDeleted(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-2xl">
          {getCatIcon(category.name)}
        </div>
        <h3 className="font-black text-zinc-900 mb-1">Delete &ldquo;{category.name}&rdquo;?</h3>
        <p className="text-xs text-zinc-400 mb-1">
          {category.productCount > 0
            ? `${category.productCount} product${category.productCount !== 1 ? "s" : ""} will be unlinked (not deleted).`
            : "No products are linked to this category."}
        </p>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Category Card ──────────────────────────────────────── */
function CategoryCard({ cat, token, onEdit, onDelete, onImageUploaded }: {
  cat: ApiCategory;
  token: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onImageUploaded: (id: number, url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await adminUploadCategoryImage(cat.id, file, token);
      onImageUploaded(cat.id, url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-100 transition-all duration-300 group relative ${
      cat.isActive ? "border-zinc-100" : "border-zinc-100 opacity-60"
    }`}>

      {/* Image area */}
      <div className="relative h-36 bg-zinc-50 flex items-center justify-center overflow-hidden">
        {cat.imageUrl ? (
          <Image
            src={cat.imageUrl}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="text-4xl">{getCatIcon(cat.name)}</div>
        )}

        {/* Upload overlay */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title={cat.imageUrl ? "Change image" : "Upload image"}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          {uploading ? (
            <div className="bg-white/90 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading…
            </div>
          ) : (
            <div className="bg-white/90 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {cat.imageUrl ? "Change Image" : "Upload Image"}
            </div>
          )}
        </button>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {/* Action buttons top-right */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-white/90 shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors" title="Edit">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={onDelete}
            className="w-7 h-7 rounded-lg bg-white/90 shadow-sm flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors" title="Delete">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        {uploadError && (
          <p className="text-[10px] text-red-500 mb-2">{uploadError}</p>
        )}
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-base font-black text-zinc-900">{cat.name}</h3>
          {!cat.isActive && (
            <span className="text-[9px] font-bold bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
          )}
        </div>
        {cat.description && <p className="text-xs text-zinc-400 mb-2 line-clamp-1">{cat.description}</p>}
        <p className="text-sm text-zinc-500 mb-4">{cat.productCount} product{cat.productCount !== 1 ? "s" : ""}</p>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-50 text-center">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide mb-0.5">Min</p>
            <p className="text-xs font-bold text-zinc-900">{cat.minPrice ? formatZar(cat.minPrice) : "-"}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide mb-0.5">Avg</p>
            <p className="text-xs font-bold text-zinc-900">{cat.avgPrice ? formatZar(cat.avgPrice) : "-"}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide mb-0.5">Max</p>
            <p className="text-xs font-bold text-zinc-900">{cat.maxPrice ? formatZar(cat.maxPrice) : "-"}</p>
          </div>
        </div>

        <Link href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 border border-zinc-100 hover:border-zinc-300 py-2.5 rounded-xl transition-all">
          View products
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [editCat, setEdit]          = useState<ApiCategory | null | undefined>(undefined);
  const [deleteCat, setDelete]      = useState<ApiCategory | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await fetchCategories()); }
    catch { setCategories([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleImageUploaded = (id: number, url: string) => {
    setCategories((prev) =>
      prev.map((c) => c.id === id ? { ...c, imageUrl: url } : c)
    );
  };

  const totalProducts = categories.reduce((s, c) => s + c.productCount, 0);
  const mostPopular   = [...categories].sort((a, b) => b.productCount - a.productCount)[0];
  const highestAvgCat = [...categories].filter((c) => c.avgPrice).sort((a, b) => (b.avgPrice ?? 0) - (a.avgPrice ?? 0))[0];

  return (
    <div className="max-w-7xl space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Categories",  value: loading ? "-" : String(categories.length) },
          { label: "Total Products",    value: loading ? "-" : String(totalProducts) },
          { label: "Most Popular",      value: loading || !mostPopular ? "-" : mostPopular.name },
          { label: "Highest Avg Price", value: loading || !highestAvgCat ? "-" : formatZar(highestAvgCat.avgPrice ?? 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wide">All Categories</h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">Hover a card to upload or change its image.</p>
        </div>
        <button onClick={() => setEdit(null)}
          className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-36 bg-zinc-100" />
              <div className="p-5 space-y-2">
                <div className="h-5 w-24 bg-zinc-100 rounded-full" />
                <div className="h-3.5 w-32 bg-zinc-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-zinc-100 rounded-2xl p-16 text-center">
          <p className="text-zinc-400 text-sm mb-4">No categories yet.</p>
          <button onClick={() => setEdit(null)}
            className="bg-zinc-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              token={token}
              onEdit={() => setEdit(cat)}
              onDelete={() => setDelete(cat)}
              onImageUploaded={handleImageUploaded}
            />
          ))}
        </div>
      )}

      {editCat !== undefined && (
        <CategoryModal category={editCat} token={token}
          onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); load(); }} />
      )}
      {deleteCat && (
        <DeleteConfirm category={deleteCat} token={token}
          onClose={() => setDelete(null)} onDeleted={() => { setDelete(null); load(); }} />
      )}
    </div>
  );
}
