"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchOrders, adminUpdateOrderStatus } from "../../lib/api";
import { formatZar } from "../../lib/currency";
import type { ApiOrder, ApiOrderStatus } from "../../lib/types";

/* ─── Status config ──────────────────────────────────────── */
type StatusMeta = { label: string; bg: string; text: string; next?: ApiOrderStatus };

const STATUS: Record<ApiOrderStatus, StatusMeta> = {
  0: { label: "Pending",    bg: "bg-yellow-50",  text: "text-yellow-700", next: 1 },
  1: { label: "Processing", bg: "bg-blue-50",    text: "text-blue-700",   next: 2 },
  2: { label: "Shipped",    bg: "bg-indigo-50",  text: "text-indigo-700", next: 3 },
  3: { label: "Delivered",  bg: "bg-green-50",   text: "text-green-700"  },
  4: { label: "Cancelled",  bg: "bg-red-50",     text: "text-red-600"    },
};

const ALL_STATUSES = [0, 1, 2, 3, 4] as ApiOrderStatus[];
const PAGE_SIZE = 20;

/* ─── Status badge ───────────────────────────────────────── */
function StatusBadge({ status }: { status: ApiOrderStatus }) {
  const s = STATUS[status] ?? { label: String(status), bg: "bg-zinc-100", text: "text-zinc-500" };
  return (
    <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

/* ─── Order detail drawer ────────────────────────────────── */
function OrderDrawer({ order, token, onClose, onUpdated }: {
  order: ApiOrder; token: string | null;
  onClose: () => void; onUpdated: (o: ApiOrder) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [error, setError]       = useState("");
  const meta = STATUS[order.status] ?? STATUS[0];

  const advance = async () => {
    if (!token || meta.next == null) return;
    setUpdating(true); setError("");
    try {
      const updated = await adminUpdateOrderStatus(order.id, meta.next, token);
      onUpdated(updated);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setUpdating(false); }
  };

  const cancel = async () => {
    if (!token) return;
    setUpdating(true); setError("");
    try {
      const updated = await adminUpdateOrderStatus(order.id, 4, token);
      onUpdated(updated);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setUpdating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="font-black text-zinc-900 text-base">Order #{order.id}</h2>
            <p className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>}

          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <div className="flex gap-2">
              {meta.next != null && (
                <button onClick={advance} disabled={updating}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors">
                  {updating ? "Updating…" : `Mark ${STATUS[meta.next].label}`}
                </button>
              )}
              {order.status !== 4 && order.status !== 3 && (
                <button onClick={cancel} disabled={updating}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="p-4 bg-zinc-50 rounded-2xl">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Customer</p>
            <p className="font-bold text-zinc-900 text-sm">{order.customerName}</p>
            <p className="text-xs text-zinc-500">{order.customerEmail}</p>
            {order.phoneNumber && <p className="text-xs text-zinc-500">{order.phoneNumber}</p>}
            {order.shippingAddress && <p className="text-xs text-zinc-400 mt-1">{order.shippingAddress}</p>}
            {(order.shippingCity || order.shippingCountry) && (
              <p className="text-xs text-zinc-400">{[order.shippingCity, order.shippingCountry].filter(Boolean).join(", ")}</p>
            )}
          </div>

          {/* Payment */}
          {order.paymentMethod && (
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Payment</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-900 capitalize">{order.paymentMethod}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  order.status === 1 || order.status === 2 || order.status === 3
                    ? "bg-green-50 text-green-700"
                    : order.status === 4
                    ? "bg-red-50 text-red-600"
                    : "bg-yellow-50 text-yellow-700"
                }`}>
                  {order.status === 0 ? "Pending" : order.status === 4 ? "Failed" : "Paid"}
                </span>
              </div>
              {order.paymentReference && (
                <p className="text-[10px] text-zinc-400 mt-1 font-mono break-all">{order.paymentReference}</p>
              )}
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Items</p>
            <div className="space-y-3">
              {(order.items ?? []).map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-zinc-50 last:border-0">
                  <div className="w-14 h-14 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0 relative">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">👟</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{item.productName}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {[
                        item.size && `Size ${item.size}`,
                        item.color,
                        `×${item.quantity}`,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <p className="font-bold text-zinc-900 text-sm flex-shrink-0">{formatZar(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl">
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-lg font-black text-white">{formatZar(order.totalAmount)}</span>
          </div>

          {order.notes && (
            <div className="p-4 bg-amber-50 rounded-2xl">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Notes</p>
              <p className="text-xs text-amber-900">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const { token } = useAdminAuth();

  const [orders, setOrders]       = useState<ApiOrder[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState<ApiOrderStatus | "all">("all");
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [drawer, setDrawer]       = useState<ApiOrder | null>(null);

  const [fetchError, setFetchError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetchOrders({
        search:   search || undefined,
        status:   statusFilter !== "all" ? statusFilter : undefined,
        page,
        pageSize: PAGE_SIZE,
      }, token ?? undefined);
      setOrders(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e: unknown) {
      setOrders([]);
      setTotal(0);
      setFetchError(e instanceof Error ? e.message : "Failed to load orders");
    }
    finally { setLoading(false); }
  }, [search, statusFilter, page, token]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);

  const toggleAll = () =>
    selected.size === orders.length
      ? setSelected(new Set())
      : setSelected(new Set(orders.map((o) => o.id)));

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleUpdated = (updated: ApiOrder) => {
    setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
    setDrawer(updated);
  };

  /* Count per status from current page (rough, full counts need separate API calls) */
  const counts = ALL_STATUSES.reduce<Record<number, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl space-y-5">

      {/* Status chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ALL_STATUSES.map((s) => {
          const sc = STATUS[s];
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => { setStatus((v) => v === s ? "all" : s); setPage(1); }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                active ? "border-zinc-900 bg-zinc-900" : "bg-white border-zinc-100 hover:border-zinc-300"
              }`}>
              <div className={`text-xl font-black leading-none ${active ? "text-white" : "text-zinc-900"}`}>
                {counts[s] ?? 0}
              </div>
              <div className={`text-[10px] font-semibold mt-1 ${active ? "text-zinc-400" : sc.text}`}>
                {sc.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order number or customer…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 bg-white rounded-xl outline-none focus:border-zinc-400 transition-colors" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl">
            <span>{selected.size} selected</span>
            <button onClick={() => setSelected(new Set())} className="text-zinc-400 hover:text-white ml-1">✕</button>
          </div>
        )}
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-red-600">{fetchError}</p>
          <button onClick={load} className="text-xs font-bold text-red-700 underline hover:no-underline ml-4">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-5 py-3.5 w-10">
                  <input type="checkbox"
                    checked={selected.size === orders.length && orders.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
                </th>
                {["Order", "Customer", "Items", "Date", "Total", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="w-4 h-4 bg-zinc-100 rounded" /></td>
                    {[1,2,3,4,5,6].map((j) => (
                      <td key={j} className="px-3 py-4"><div className="h-3 w-20 bg-zinc-100 rounded-full" /></td>
                    ))}
                    <td />
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-zinc-400 text-sm">No orders found.</p>
                    {(search || statusFilter !== "all") && (
                      <button onClick={() => { setSearch(""); setStatus("all"); setPage(1); }}
                        className="mt-2 text-xs text-zinc-500 underline hover:text-zinc-900">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : orders.map((o) => (
                <tr key={o.id}
                  onClick={() => setDrawer(o)}
                  className={`hover:bg-zinc-50/70 transition-colors cursor-pointer group ${selected.has(o.id) ? "bg-zinc-50" : ""}`}>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleOne(o.id)}
                      className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
                  </td>
                  <td className="px-3 py-3.5 font-mono text-xs font-bold text-zinc-900">#{o.id}</td>
                  <td className="px-3 py-3.5">
                    <div className="font-semibold text-zinc-900 text-xs">{o.customerName}</div>
                    <div className="text-[10px] text-zinc-400">{o.customerEmail}</div>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-zinc-500">
                    {o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? "s" : ""}
                  </td>
                  <td className="px-3 py-3.5 text-xs text-zinc-400">
                    {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-3 py-3.5 font-bold text-zinc-900 text-sm">{formatZar(o.totalAmount)}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-3 py-3.5">
                    <svg className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-zinc-400">{total} order{total !== 1 ? "s" : ""} total</p>
          <p className="text-xs text-zinc-500">
            Page total: <span className="font-black text-zinc-900">{formatZar(totalRevenue)}</span>
          </p>
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

      {/* Order detail drawer */}
      {drawer && (
        <OrderDrawer order={drawer} token={token}
          onClose={() => setDrawer(null)}
          onUpdated={handleUpdated} />
      )}
    </div>
  );
}
