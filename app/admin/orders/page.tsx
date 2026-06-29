"use client";

import { useState } from "react";
import { ORDERS, STATUS_CONFIG, type OrderStatus } from "../data/mockData";

const ALL_STATUSES: OrderStatus[] = ["delivered", "shipped", "processing", "pending", "cancelled"];

export default function AdminOrdersPage() {
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatus] = useState<OrderStatus | "all">("all");
  const [selected, setSelected]   = useState<Set<string>>(new Set());

  const filtered = ORDERS.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchQ = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || o.status === statusFilter;
    return matchQ && matchS;
  });

  const totalRevenue = filtered.reduce((s, o) => s + o.amount, 0);

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((o) => o.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const counts = ALL_STATUSES.reduce<Record<OrderStatus, number>>((acc, s) => {
    acc[s] = ORDERS.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  return (
    <div className="max-w-7xl space-y-5">

      {/* Status summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ALL_STATUSES.map((s) => {
          const sc = STATUS_CONFIG[s];
          return (
            <button key={s}
              onClick={() => setStatus((v) => v === s ? "all" : s)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                statusFilter === s
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "bg-white border-zinc-100 hover:border-zinc-300"
              }`}>
              <div className={`text-xl font-black leading-none ${statusFilter === s ? "text-white" : "text-zinc-900"}`}>
                {counts[s]}
              </div>
              <div className={`text-[10px] font-semibold mt-1 ${statusFilter === s ? "text-zinc-400" : sc.text}`}>
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
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer, product…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 bg-white rounded-xl outline-none focus:border-zinc-400 transition-colors" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl">
            <span>{selected.size} selected</span>
            <button onClick={() => setSelected(new Set())} className="text-zinc-400 hover:text-white ml-1">✕</button>
          </div>
        )}
        <button className="flex items-center gap-2 border border-zinc-200 bg-white text-zinc-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:border-zinc-400 transition-colors ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-5 py-3.5 w-10">
                  <input type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
                </th>
                {["Order ID", "Customer", "Product", "Date", "Qty", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((o) => {
                const sc   = STATUS_CONFIG[o.status];
                const date = new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const sel  = selected.has(o.id);
                return (
                  <tr key={o.id}
                    className={`hover:bg-zinc-50/70 transition-colors group ${sel ? "bg-zinc-50" : ""}`}>
                    <td className="px-5 py-3.5">
                      <input type="checkbox" checked={sel} onChange={() => toggleOne(o.id)}
                        className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs font-bold text-zinc-500">{o.id}</td>
                    <td className="px-3 py-3.5">
                      <div className="font-semibold text-zinc-900 text-xs">{o.customer}</div>
                      <div className="text-[10px] text-zinc-400">{o.email}</div>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-zinc-600">{o.product}</td>
                    <td className="px-3 py-3.5 text-xs text-zinc-400">{date}</td>
                    <td className="px-3 py-3.5 text-xs font-medium text-zinc-500">×{o.qty}</td>
                    <td className="px-3 py-3.5 font-bold text-zinc-900 text-sm">${o.amount.toFixed(2)}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors" title="View order">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-zinc-400">
            Showing {filtered.length} of {ORDERS.length} orders
          </p>
          <p className="text-xs text-zinc-500">
            Filtered total:{" "}
            <span className="font-black text-zinc-900">${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
