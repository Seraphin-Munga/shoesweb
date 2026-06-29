"use client";

import Link from "next/link";
import { products } from "../data/products";
import { ORDERS, MONTHLY_REVENUE, STATS, STATUS_CONFIG } from "./data/mockData";

/* ─── Stat card ─────────────────────────────────────────── */
function StatCard({
  label, value, change, positive, icon, iconBg,
}: {
  label: string; value: string; change: string; positive: boolean;
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
      </div>
    </div>
  );
}

/* ─── Revenue bar chart (SVG) ───────────────────────────── */
function RevenueChart() {
  const max = Math.max(...MONTHLY_REVENUE.map((d) => d.revenue));
  const chartH = 140;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-black text-zinc-900">Revenue</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-zinc-900">$24,800</p>
          <p className="text-xs font-semibold text-green-600 mt-0.5">↑ 28.5% this month</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${MONTHLY_REVENUE.length * 60} ${chartH + 28}`} className="w-full">
        {MONTHLY_REVENUE.map((d, i) => {
          const barH   = (d.revenue / max) * chartH;
          const x      = i * 60 + 10;
          const y      = chartH - barH;
          const isLast = i === MONTHLY_REVENUE.length - 1;
          return (
            <g key={d.month}>
              <rect x={x} y={y} width={40} height={barH} rx={6}
                fill={isLast ? "#09090b" : "#f4f4f5"} />
              {isLast && (
                <text x={x + 20} y={y - 6} textAnchor="middle" fontSize="9" fill="#09090b" fontWeight="700">
                  ${(d.revenue / 1000).toFixed(1)}k
                </text>
              )}
              <text x={x + 20} y={chartH + 18} textAnchor="middle" fontSize="10" fill="#a1a1aa">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Top products mini list ────────────────────────────── */
function TopProducts() {
  const top = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 5);

  const maxRev = Math.max(...top.map((p) => p.reviews));

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-zinc-900">Top Products</h3>
        <Link href="/admin/products" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">
          View all →
        </Link>
      </div>
      <div className="space-y-4">
        {top.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xs font-black text-zinc-300 w-4">{i + 1}</span>
            <div
              className="w-10 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: p.bgColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">{p.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-1 bg-zinc-900 rounded-full"
                    style={{ width: `${(p.reviews / maxRev) * 100}%` }} />
                </div>
                <span className="text-[10px] text-zinc-400">{p.reviews}</span>
              </div>
            </div>
            <span className="text-xs font-black text-zinc-900 flex-shrink-0">${p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recent orders table ───────────────────────────────── */
function RecentOrders() {
  const recent = ORDERS.slice(0, 8);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-zinc-900">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">
          View all →
        </Link>
      </div>

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
            {recent.map((o) => {
              const sc = STATUS_CONFIG[o.status];
              return (
                <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs font-bold text-zinc-500">{o.id}</td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-zinc-900 text-xs">{o.customer}</div>
                    <div className="text-[10px] text-zinc-400">{o.country}</div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-zinc-600 truncate max-w-[140px]">{o.product}</td>
                  <td className="py-3 pr-4 font-bold text-zinc-900 text-xs">${o.amount.toFixed(2)}</td>
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
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue" value={`$${STATS.totalRevenue.toLocaleString()}`}
          change={`${STATS.revenueGrowth}%`} positive
          iconBg="bg-green-50"
          icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Total Orders" value={STATS.totalOrders.toLocaleString()}
          change={`${STATS.ordersGrowth}%`} positive
          iconBg="bg-blue-50"
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          label="Customers" value={STATS.totalCustomers.toLocaleString()}
          change={`${STATS.customersGrowth}%`} positive
          iconBg="bg-purple-50"
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Avg. Order Value" value={`$${STATS.avgOrderValue}`}
          change={`${STATS.avgOrderGrowth}%`} positive
          iconBg="bg-amber-50"
          icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      {/* Chart + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <TopProducts />
      </div>

      {/* Recent orders */}
      <RecentOrders />
    </div>
  );
}
