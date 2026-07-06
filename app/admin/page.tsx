"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAdminAuth } from "./context/AdminAuthContext";
import { fetchAdminDashboard } from "../lib/api";
import { formatZar } from "../lib/currency";
import type { ApiDashboardStats, ApiMonthlyRevenue, ApiTopProduct, ApiDashboardOrder, ApiOrderStatus } from "../lib/types";

const STATUS_CONFIG: Record<ApiOrderStatus, { label: string; bg: string; text: string }> = {
  0: { label: "Pending",    bg: "bg-zinc-100",  text: "text-zinc-600"  },
  1: { label: "Processing", bg: "bg-amber-50",  text: "text-amber-700" },
  2: { label: "Shipped",    bg: "bg-blue-50",   text: "text-blue-700"  },
  3: { label: "Delivered",  bg: "bg-green-50",  text: "text-green-700" },
  4: { label: "Cancelled",  bg: "bg-red-50",    text: "text-red-600"   },
};

function orderLabel(id: number) {
  return `ORD-${String(id).padStart(4, "0")}`;
}

function revenueGrowth(monthly: ApiMonthlyRevenue[]) {
  if (!monthly.length) return { current: 0, changePct: null as number | null };
  const current = monthly[monthly.length - 1].revenue;
  if (monthly.length < 2) return { current, changePct: null };
  const prev = monthly[monthly.length - 2].revenue;
  if (prev <= 0) return { current, changePct: null };
  return { current, changePct: ((current - prev) / prev) * 100 };
}

/* ─── Stat card ─────────────────────────────────────────── */
function StatCard({
  label, value, change, positive, icon, iconBg,
}: {
  label: string; value: string; change?: string; positive?: boolean;
  icon: React.ReactNode; iconBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-black text-zinc-900 leading-none">{value}</p>
        {change != null && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${positive ? "text-green-600" : "text-red-500"}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d={positive
                  ? "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  : "M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"}
                clipRule="evenodd" />
            </svg>
            {change} vs last month
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Revenue bar chart (SVG) ───────────────────────────── */
function RevenueChart({ monthly }: { monthly: ApiMonthlyRevenue[] }) {
  const { current, changePct } = revenueGrowth(monthly);
  const max    = Math.max(...monthly.map((d) => d.revenue), 1);
  const chartH = 140;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-black text-zinc-900">Revenue</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-zinc-900">{formatZar(current)}</p>
          {changePct != null && (
            <p className={`text-xs font-semibold mt-0.5 ${changePct >= 0 ? "text-green-600" : "text-red-500"}`}>
              {changePct >= 0 ? "↑" : "↓"} {Math.abs(changePct).toFixed(1)}% this month
            </p>
          )}
        </div>
      </div>

      {monthly.length === 0 ? (
        <p className="text-sm text-zinc-400 py-8 text-center">No revenue data yet</p>
      ) : (
        <svg viewBox={`0 0 ${monthly.length * 60} ${chartH + 28}`} className="w-full">
          {monthly.map((d, i) => {
            const barH   = (d.revenue / max) * chartH;
            const x      = i * 60 + 10;
            const y      = chartH - barH;
            const isLast = i === monthly.length - 1;
            return (
              <g key={`${d.month}-${i}`}>
                <rect x={x} y={y} width={40} height={barH} rx={6}
                  fill={isLast ? "#09090b" : "#f4f4f5"} />
                {isLast && d.revenue > 0 && (
                  <text x={x + 20} y={y - 6} textAnchor="middle" fontSize="9" fill="#09090b" fontWeight="700">
                    {formatZar(d.revenue)}
                  </text>
                )}
                <text x={x + 20} y={chartH + 18} textAnchor="middle" fontSize="10" fill="#a1a1aa">
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ─── Top products mini list ────────────────────────────── */
function TopProducts({ products }: { products: ApiTopProduct[] }) {
  const maxSales = Math.max(...products.map((p) => p.totalSales), 1);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-zinc-900">Top Products</h3>
        <Link href="/admin/products" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">
          View all →
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4 text-center">No products yet</p>
      ) : (
        <div className="space-y-4">
          {products.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-xs font-black text-zinc-300 w-4">{i + 1}</span>
              <div
                className="w-10 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `hsl(${(p.id * 47) % 360}, 18%, 88%)` }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">{p.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-1 bg-zinc-900 rounded-full"
                      style={{ width: `${(p.totalSales / maxSales) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-400">{p.reviewCount} reviews</span>
                </div>
              </div>
              <span className="text-xs font-black text-zinc-900 flex-shrink-0">{formatZar(p.totalSales)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Recent orders table ───────────────────────────────── */
function RecentOrders({ orders }: { orders: ApiDashboardOrder[] }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-zinc-900">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">
          View all →
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4 text-center">No orders yet</p>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                {["Order", "Customer", "Product", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest pb-3 pr-4 first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.map((o) => {
                const sc = STATUS_CONFIG[o.status] ?? STATUS_CONFIG[0];
                const product = o.items.map((i) => i.productName).join(", ") || "-";
                return (
                  <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs font-bold text-zinc-500">{orderLabel(o.id)}</td>
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-zinc-900 text-xs">{o.customerName}</div>
                      <div className="text-[10px] text-zinc-400">{o.shippingCountry}</div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-zinc-600 truncate max-w-[140px]">{product}</td>
                    <td className="py-3 pr-4 font-bold text-zinc-900 text-xs">{formatZar(o.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats]     = useState<ApiDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setStats(await fetchAdminDashboard(token));
    } catch (e: unknown) {
      setStats(null);
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="max-w-7xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100 p-6 h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 h-64 animate-pulse" />
          <div className="bg-white rounded-2xl border border-zinc-100 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
          <p className="text-sm text-red-600 mb-4">{error || "Could not load dashboard data"}</p>
          <button onClick={load} className="text-xs font-bold text-zinc-900 underline hover:no-underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { changePct } = revenueGrowth(stats.monthlyRevenue);

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue" value={formatZar(stats.totalRevenue)}
          change={changePct != null ? `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%` : undefined}
          positive={changePct == null || changePct >= 0}
          iconBg="bg-green-50"
          icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Total Orders" value={stats.totalOrders.toLocaleString()}
          iconBg="bg-blue-50"
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          label="Customers" value={stats.totalCustomers.toLocaleString()}
          iconBg="bg-purple-50"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Avg. Order Value" value={formatZar(stats.avgOrderValue)}
          iconBg="bg-amber-50"
          icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      {/* Chart + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart monthly={stats.monthlyRevenue} />
        </div>
        <TopProducts products={stats.topProducts} />
      </div>

      {/* Recent orders */}
      <RecentOrders orders={stats.recentOrders} />
    </div>
  );
}
