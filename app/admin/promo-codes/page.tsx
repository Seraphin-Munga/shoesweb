"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchPromoCodes, adminCreatePromoCode, adminUpdatePromoCode, adminDeletePromoCode,
} from "../../lib/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import type { ApiPromoCode, CreatePromoCodePayload } from "../../lib/types";

/* ── Helpers ─────────────────────────────────────────────── */
function generateCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusable chars
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function isExpired(expiresAt?: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function statusLabel(c: ApiPromoCode) {
  if (!c.isActive)           return { label: "Inactive",  bg: "bg-zinc-100", text: "text-zinc-500" };
  if (isExpired(c.expiresAt)) return { label: "Expired",   bg: "bg-red-50",   text: "text-red-600"  };
  if (c.maxUses != null && c.usedCount >= c.maxUses)
    return { label: "Used up",  bg: "bg-amber-50", text: "text-amber-600" };
  return { label: "Active", bg: "bg-green-50", text: "text-green-700" };
}

/* ── Modal ───────────────────────────────────────────────── */
function PromoModal({ promo, token, onClose, onSaved }: {
  promo: ApiPromoCode | null; token: string | null;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!promo;
  const [code,          setCode]          = useState(promo?.code          ?? generateCode());
  const [discountType,  setDiscountType]  = useState<"percent" | "fixed">(promo?.discountType ?? "percent");
  const [discountValue, setDiscountValue] = useState(String(promo?.discountValue ?? ""));
  const [maxUses,       setMaxUses]       = useState(promo?.maxUses != null ? String(promo.maxUses) : "");
  const [minOrderZar,   setMinOrderZar]   = useState(promo?.minOrderZar != null ? String(promo.minOrderZar) : "");
  const [expiresAt,     setExpiresAt]     = useState(promo?.expiresAt ? promo.expiresAt.slice(0, 10) : "");
  const [isActive,      setIsActive]      = useState(promo?.isActive ?? true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) { setError("Discount value must be > 0"); return; }
    if (discountType === "percent" && val > 100) { setError("Percent discount cannot exceed 100"); return; }

    setSaving(true); setError("");
    const payload: CreatePromoCodePayload = {
      code:          code.trim().toUpperCase(),
      discountType,
      discountValue: val,
      maxUses:       maxUses       ? parseInt(maxUses)       : null,
      minOrderZar:   minOrderZar   ? parseFloat(minOrderZar) : null,
      expiresAt:     expiresAt     ? new Date(expiresAt).toISOString() : null,
      isActive,
    };
    try {
      if (isEdit) {
        await adminUpdatePromoCode(promo!.id, payload, token);
      } else {
        await adminCreatePromoCode(payload, token);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <h3 className="font-black text-zinc-900 mb-5 text-lg">
          {isEdit ? `Edit, ${promo!.code}` : "New Promo Code"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Code */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Code</label>
            <div className="flex gap-2">
              <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SUMMER20"
                className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-zinc-900 transition-colors uppercase" />
              <button type="button" onClick={() => setCode(generateCode())}
                title="Generate random code"
                className="px-3 border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors text-xs font-bold">
                ↻ New
              </button>
            </div>
          </div>

          {/* Discount type + value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Type</label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors bg-white">
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (ZAR)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Value {discountType === "percent" ? "(%)" : "(R)"}
              </label>
              <input required type="number" min="0.01" step="0.01" value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percent" ? "20" : "50"}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
            </div>
          </div>

          {/* Max uses */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
              Max Uses <span className="font-normal normal-case text-zinc-400">(blank = unlimited)</span>
            </label>
            <input type="number" min="1" value={maxUses} onChange={(e) => setMaxUses(e.target.value)}
              placeholder="e.g. 100"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>

          {/* Min order */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
              Min Order Amount (R) <span className="font-normal normal-case text-zinc-400">(optional)</span>
            </label>
            <input type="number" min="0" step="0.01" value={minOrderZar} onChange={(e) => setMinOrderZar(e.target.value)}
              placeholder="e.g. 500"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>

          {/* Expiry date */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
              Expires At <span className="font-normal normal-case text-zinc-400">(optional)</span>
            </label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only" />
              <div className={`w-10 h-5 rounded-full transition-colors ${isActive ? "bg-zinc-900" : "bg-zinc-200"}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-semibold text-zinc-700">Active</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-zinc-200 text-zinc-700 font-bold py-3 rounded-xl hover:border-zinc-400 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors text-sm disabled:opacity-50">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete confirm ──────────────────────────────────────── */
function DeleteConfirm({ promo, onConfirm, onCancel, deleting }: {
  promo: ApiPromoCode; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h4 className="font-black text-zinc-900 mb-1">Delete {promo.code}?</h4>
        <p className="text-sm text-zinc-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 border border-zinc-200 text-zinc-700 font-bold py-2.5 rounded-xl hover:border-zinc-400 text-sm transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 text-sm transition-colors disabled:opacity-50">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function AdminPromoCodesPage() {
  const { token } = useAdminAuth();
  const [promos,   setPromos]   = useState<ApiPromoCode[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [modal,    setModal]    = useState<"create" | ApiPromoCode | null>(null);
  const [toDelete, setToDelete] = useState<ApiPromoCode | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied,   setCopied]   = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError("");
    try {
      setPromos(await fetchPromoCodes(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!toDelete || !token) return;
    setDeleting(true);
    try {
      await adminDeletePromoCode(toDelete.id, token);
      setToDelete(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const copyCode = async (promo: ApiPromoCode) => {
    await navigator.clipboard.writeText(promo.code);
    setCopied(promo.id);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleToggleActive = async (promo: ApiPromoCode) => {
    if (!token) return;
    try {
      const updated = await adminUpdatePromoCode(promo.id, { isActive: !promo.isActive }, token);
      setPromos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Promo Codes</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {promos.length} code{promos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setModal("create")}
          className="flex items-center gap-2 bg-zinc-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Code
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <svg className="w-6 h-6 text-zinc-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : promos.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">No promo codes yet.</p>
            <button onClick={() => setModal("create")}
              className="mt-3 text-xs font-bold text-zinc-900 underline hover:no-underline">
              Create your first code →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="border-b border-zinc-100">
                <tr>
                  {["Code", "Discount", "Uses", "Min Order", "Expires", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {promos.map((promo) => {
                  const st = statusLabel(promo);
                  return (
                    <tr key={promo.id} className="hover:bg-zinc-50/50 transition-colors">

                      {/* Code */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-zinc-900 tracking-wider text-sm">
                            {promo.code}
                          </span>
                          <button onClick={() => copyCode(promo)} title="Copy"
                            className="text-zinc-300 hover:text-zinc-700 transition-colors">
                            {copied === promo.id ? (
                              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-zinc-900">
                          {promo.discountType === "percent"
                            ? `${promo.discountValue}% off`
                            : `R${promo.discountValue.toFixed(2)} off`}
                        </span>
                      </td>

                      {/* Uses */}
                      <td className="px-6 py-4 text-zinc-600">
                        {promo.usedCount}
                        {promo.maxUses != null && (
                          <span className="text-zinc-400"> / {promo.maxUses}</span>
                        )}
                        {promo.maxUses == null && (
                          <span className="text-zinc-400"> / ∞</span>
                        )}
                      </td>

                      {/* Min order */}
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {promo.minOrderZar != null ? `R${promo.minOrderZar.toFixed(0)}` : "-"}
                      </td>

                      {/* Expires */}
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {promo.expiresAt
                          ? new Date(promo.expiresAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
                          : "Never"}
                      </td>

                      {/* Status + toggle */}
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleActive(promo)} title="Toggle active">
                          <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${st.bg} ${st.text}`}>
                            {st.label}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setModal(promo)} title="Edit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setToDelete(promo)} title="Delete"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal !== null && (
        <PromoModal
          promo={modal === "create" ? null : modal}
          token={token}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
      {toDelete && (
        <DeleteConfirm
          promo={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
