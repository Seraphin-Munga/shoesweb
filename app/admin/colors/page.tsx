"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  fetchColors, adminCreateColor, adminUpdateColor, adminDeleteColor,
} from "../../lib/api";
import type { ApiColorFull } from "../../lib/types";

/* ─── Color Modal ────────────────────────────────────────── */
function ColorModal({ color, token, onClose, onSaved }: {
  color: ApiColorFull | null; token: string | null;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!color;
  const [name, setName]         = useState(color?.name ?? "");
  const [hex, setHex]           = useState(color?.hex ?? "#000000");
  const [isActive, setActive]   = useState(color?.isActive ?? true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("Not authenticated."); return; }
    if (!name.trim()) { setError("Name is required."); return; }
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) { setError("Hex must be a valid 6-digit hex code."); return; }
    setSaving(true); setError("");
    try {
      if (isEdit) await adminUpdateColor(color!.id, { name: name.trim(), hex, isActive }, token);
      else        await adminCreateColor({ name: name.trim(), hex, isActive }, token);
      onSaved();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-black text-zinc-900 mb-5">{isEdit ? `Edit — ${color!.name}` : "Add New Color"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Color Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ocean Blue"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Hex Code *</label>
            <div className="flex items-center gap-3">
              <input type="color" value={hex} onChange={(e) => setHex(e.target.value)}
                className="w-12 h-10 rounded-lg border border-zinc-200 cursor-pointer p-0.5 flex-shrink-0" />
              <input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#000000"
                className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors font-mono uppercase" />
            </div>
            <div className="mt-2 h-6 rounded-lg" style={{ backgroundColor: hex }} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer" onClick={() => setActive(!isActive)}>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${isActive ? "bg-zinc-900" : "bg-zinc-200"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-medium text-zinc-700">Active (visible in filters)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Color"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────── */
function DeleteConfirm({ color, token, onClose, onDeleted }: {
  color: ApiColorFull; token: string | null;
  onClose: () => void; onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState("");

  const handleDelete = async () => {
    if (!token) { setError("Not authenticated."); return; }
    setDeleting(true);
    try { await adminDeleteColor(color.id, token); onDeleted(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 border-4 border-white shadow-lg"
          style={{ backgroundColor: color.hex }} />
        <h3 className="font-black text-zinc-900 mb-1">Delete &ldquo;{color.name}&rdquo;?</h3>
        <p className="text-xs text-zinc-400 mb-2">
          {color.productCount > 0
            ? `This color is linked to ${color.productCount} product${color.productCount !== 1 ? "s" : ""}. Those links will be removed.`
            : "This color has no associated products."}
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

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminColorsPage() {
  const { token } = useAdminAuth();
  const [colors, setColors]     = useState<ApiColorFull[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editColor, setEdit]    = useState<ApiColorFull | null | undefined>(undefined);
  const [deleteColor, setDelete] = useState<ApiColorFull | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setColors(await fetchColors()); }
    catch { setColors([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalProducts = colors.reduce((sum, c) => sum + c.productCount, 0);
  const activeCount   = colors.filter((c) => c.isActive).length;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Colors",   value: colors.length },
          { label: "Active Colors",  value: activeCount },
          { label: "Total Products", value: totalProducts },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl px-5 py-4">
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <p className="text-2xl font-black text-zinc-900">{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-zinc-900">All Colors</h2>
        <button onClick={() => setEdit(null)}
          className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Color
        </button>
      </div>

      {/* Color grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-4 animate-pulse">
              <div className="w-full h-20 rounded-xl bg-zinc-100 mb-3" />
              <div className="h-3.5 w-20 bg-zinc-100 rounded-full mb-2" />
              <div className="h-2.5 w-14 bg-zinc-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : colors.length === 0 ? (
        <div className="bg-white border border-zinc-100 rounded-2xl py-20 text-center">
          <p className="text-zinc-400 text-sm mb-4">No colors defined yet.</p>
          <button onClick={() => setEdit(null)}
            className="bg-zinc-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
            Add Your First Color
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {colors.map((color) => (
            <div key={color.id}
              className={`bg-white border rounded-2xl p-4 group relative transition-all hover:shadow-md ${
                color.isActive ? "border-zinc-100" : "border-zinc-100 opacity-50"
              }`}>
              {/* Swatch */}
              <div className="w-full h-20 rounded-xl mb-3 border border-zinc-100 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex }} />

              <p className="font-bold text-zinc-900 text-sm mb-0.5">{color.name}</p>
              <p className="text-xs text-zinc-400 font-mono uppercase">{color.hex}</p>
              <p className="text-[10px] text-zinc-400 mt-1">
                {color.productCount} product{color.productCount !== 1 ? "s" : ""}
              </p>

              {!color.isActive && (
                <span className="absolute top-3 right-3 text-[9px] font-bold bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hidden
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-x-4 bottom-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEdit(color)}
                  className="flex-1 py-1.5 rounded-lg bg-zinc-900 text-white text-[10px] font-bold hover:bg-zinc-700 transition-colors">
                  Edit
                </button>
                <button onClick={() => setDelete(color)}
                  className="w-7 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editColor !== undefined && (
        <ColorModal color={editColor} token={token}
          onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); load(); }} />
      )}
      {deleteColor && (
        <DeleteConfirm color={deleteColor} token={token}
          onClose={() => setDelete(null)} onDeleted={() => { setDelete(null); load(); }} />
      )}
    </div>
  );
}
