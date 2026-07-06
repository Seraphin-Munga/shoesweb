"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchAdminAnalytics } from "../../lib/api";
import { formatZar } from "../../lib/currency";
import type { ApiAnalyticsStats } from "../../lib/types";

const STATUS_BAR: Record<string, string> = {
  delivered:  "bg-green-500",
  shipped:    "bg-blue-500",
  processing: "bg-amber-500",
  cancelled:  "bg-red-400",
  pending:    "bg-zinc-400",
};

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  delivered:  { bg: "bg-green-50",  text: "text-green-700" },
  shipped:    { bg: "bg-blue-50",   text: "text-blue-700"  },
  processing: { bg: "bg-amber-50",  text: "text-amber-700" },
  cancelled:  { bg: "bg-red-50",    text: "text-red-600"   },
  pending:    { bg: "bg-zinc-100",  text: "text-zinc-600"  },
};

export default function AdminAnalyticsPage() {
  const { token } = useAdminAuth();
  const [stats, setStats]     = useState<ApiAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setStats(await fetchAdminAnalytics(token));
    } catch (e: unknown) {
      setStats(null);
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="max-w-7xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-6 h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-zinc-100 rounded-2xl h-72 animate-pulse" />
          <div className="bg-white border border-zinc-100 rounded-2xl h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
          <p className="text-sm text-red-600 mb-4">{error || "Could not load analytics"}</p>
          <button onClick={load} className="text-xs font-bold text-zinc-900 underline hover:no-underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxRev = Math.max(...stats.monthlyPerformance.map((d) => d.revenue), 1);

  return (
    <div className="max-w-7xl space-y-5">

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "6-Month Revenue", value: formatZar(stats.periodRevenue), sub: stats.periodLabel },
          { label: "Total Orders",    value: stats.totalOrders.toLocaleString(), sub: "All time" },
          { label: "Avg Monthly Rev", value: formatZar(stats.avgMonthlyRevenue), sub: "Per month" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-zinc-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-black text-zinc-900 mt-1">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly breakdown */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6">
          <h3 className="font-black text-zinc-900 mb-5">Monthly Performance</h3>
          {stats.monthlyPerformance.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.monthlyPerformance.map((d) => (
                <div key={d.month} className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-zinc-400 w-6">{d.month}</span>
                  <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-zinc-900 rounded-full transition-all duration-500"
                      style={{ width: `${(d.revenue / maxRev) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-zinc-700 w-20 text-right">{formatZar(d.revenue)}</span>
                  <span className="text-[10px] text-zinc-400 w-16 text-right">{d.orders} orders</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6">
          <h3 className="font-black text-zinc-900 mb-5">Order Status Breakdown</h3>
          {stats.statusBreakdown.every((s) => s.count === 0) ? (
            <p className="text-sm text-zinc-400 text-center py-6">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.statusBreakdown.map((s) => {
                const badge = STATUS_BADGE[s.status] ?? STATUS_BADGE.pending;
                return (
                  <div key={s.status} className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full w-20 text-center ${badge.bg} ${badge.text}`}>
                      {s.label}
                    </span>
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${STATUS_BAR[s.status] ?? "bg-zinc-400"}`}
                        style={{ width: `${s.percent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-zinc-700 w-4">{s.count}</span>
                    <span className="text-[10px] text-zinc-400 w-8 text-right">{s.percent}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-black text-zinc-900 mb-5">Product Category Overview</h3>
          {stats.categories.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-6">No categories with products yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.categories.map((c) => (
                <div key={c.name} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{c.name}</p>
                  <p className="text-2xl font-black text-zinc-900 mt-1">{c.productCount}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">products</p>
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <p className="text-xs text-zinc-500">Avg. price</p>
                    <p className="text-sm font-black text-zinc-900">
                      {c.avgPrice != null ? formatZar(c.avgPrice) : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
