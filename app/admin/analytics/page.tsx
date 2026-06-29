"use client";

import { MONTHLY_REVENUE, ORDERS, STATUS_CONFIG, type OrderStatus } from "../data/mockData";
import { products } from "../../data/products";

export default function AdminAnalyticsPage() {
  const maxRev = Math.max(...MONTHLY_REVENUE.map((d) => d.revenue));
  const total  = MONTHLY_REVENUE.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = MONTHLY_REVENUE.reduce((s, d) => s + d.orders, 0);

  const statusBreakdown = (["delivered", "shipped", "processing", "pending", "cancelled"] as OrderStatus[]).map((s) => ({
    ...STATUS_CONFIG[s],
    status: s,
    count: ORDERS.filter((o) => o.status === s).length,
    pct: Math.round((ORDERS.filter((o) => o.status === s).length / ORDERS.length) * 100),
  }));

  const categoryRevenue = ["Running", "Casual", "Trail"].map((cat) => {
    const ps = products.filter((p) => p.category === cat);
    return {
      cat,
      count: ps.length,
      avgPrice: ps.reduce((s, p) => s + p.price, 0) / ps.length,
    };
  });

  return (
    <div className="max-w-7xl space-y-5">

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "6-Month Revenue", value: `$${total.toLocaleString()}`, sub: "Jan – Jun 2026" },
          { label: "Total Orders",    value: totalOrders,                   sub: "All time tracked" },
          { label: "Avg Monthly Rev", value: `$${Math.round(total / 6).toLocaleString()}`, sub: "Per month" },
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
          <div className="space-y-3">
            {MONTHLY_REVENUE.map((d) => (
              <div key={d.month} className="flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-400 w-6">{d.month}</span>
                <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-zinc-900 rounded-full transition-all duration-500"
                    style={{ width: `${(d.revenue / maxRev) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-zinc-700 w-16 text-right">${(d.revenue / 1000).toFixed(1)}k</span>
                <span className="text-[10px] text-zinc-400 w-16 text-right">{d.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6">
          <h3 className="font-black text-zinc-900 mb-5">Order Status Breakdown</h3>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full w-20 text-center ${s.bg} ${s.text}`}>
                  {s.label}
                </span>
                <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full ${s.status === "delivered" ? "bg-green-500" : s.status === "shipped" ? "bg-blue-500" : s.status === "processing" ? "bg-amber-500" : s.status === "cancelled" ? "bg-red-400" : "bg-zinc-400"}`}
                    style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs font-bold text-zinc-700 w-4">{s.count}</span>
                <span className="text-[10px] text-zinc-400 w-8 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-black text-zinc-900 mb-5">Product Category Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            {categoryRevenue.map((c) => (
              <div key={c.cat} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{c.cat}</p>
                <p className="text-2xl font-black text-zinc-900 mt-1">{c.count}</p>
                <p className="text-xs text-zinc-400 mt-0.5">products</p>
                <div className="mt-3 pt-3 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500">Avg. price</p>
                  <p className="text-sm font-black text-zinc-900">${c.avgPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
