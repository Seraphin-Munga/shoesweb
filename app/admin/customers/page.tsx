"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchAdminCustomers } from "../../lib/api";
import { formatZar } from "../../lib/currency";
import type { ApiCustomer } from "../../lib/types";

const TIER_STYLE: Record<string, { bg: string; text: string }> = {
  Gold:     { bg: "bg-amber-50", text: "text-amber-700" },
  Silver:   { bg: "bg-zinc-100", text: "text-zinc-600"  },
  Standard: { bg: "bg-blue-50",  text: "text-blue-600"  },
};

function tierStyle(tier: string) {
  return TIER_STYLE[tier] ?? TIER_STYLE.Standard;
}

export default function AdminCustomersPage() {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setCustomers(await fetchAdminCustomers(token));
    } catch (e: unknown) {
      setCustomers([]);
      setError(e instanceof Error ? e.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);

  if (loading) {
    return (
      <div className="max-w-7xl space-y-5">
        <div className="bg-white border border-zinc-100 rounded-2xl h-96 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button onClick={load} className="text-xs font-bold text-zinc-900 underline hover:no-underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-5">
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["Customer", "Country", "Orders", "Total Spent", "Member Since", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-400">
                    No customers yet
                  </td>
                </tr>
              ) : customers.map((c) => {
                const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
                const joined   = new Date(c.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const tier     = tierStyle(c.tier);
                return (
                  <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 text-xs">{c.name}</div>
                          <div className="text-[10px] text-zinc-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-zinc-500">{c.country || "-"}</td>
                    <td className="px-5 py-4 text-xs font-bold text-zinc-900">{c.orderCount}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-zinc-900 text-xs">{formatZar(c.totalSpent)}</div>
                      <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${tier.bg} ${tier.text}`}>
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-400">{joined}</td>
                    <td className="px-5 py-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-zinc-400 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-2.5 py-1.5 rounded-lg">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400">{customers.length} customers</p>
          <p className="text-xs text-zinc-500">
            Total spent: <span className="font-black text-zinc-900">{formatZar(totalSpent)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
