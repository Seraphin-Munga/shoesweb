"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { fetchMyOrders } from "../lib/api";
import { formatZar } from "../lib/currency";
import type { ApiUserOrder, ApiUserOrderStatus } from "../lib/types";

/* ── Status config ───────────────────────────────────────── */
const STATUS_META: Record<ApiUserOrderStatus, { label: string; dot: string; badge: string }> = {
  pending:    { label: "Pending",    dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  processing: { label: "Processing", dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700 border-blue-100" },
  shipped:    { label: "Shipped",    dot: "bg-indigo-400", badge: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  delivered:  { label: "Delivered",  dot: "bg-green-400",  badge: "bg-green-50 text-green-700 border-green-100" },
  cancelled:  { label: "Cancelled",  dot: "bg-red-400",    badge: "bg-red-50 text-red-600 border-red-100" },
};

function StatusBadge({ status }: { status: ApiUserOrderStatus }) {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${m.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

/* ── Order card ──────────────────────────────────────────── */
function OrderCard({ order }: { order: ApiUserOrder }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
  const preview = order.items.slice(0, 3);
  const rest    = order.items.length - preview.length;

  return (
    <Link href={`/orders/${order.id}`}
      className="group block bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl p-5 transition-all hover:shadow-sm">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] text-zinc-400 font-medium mb-0.5">Order #{order.id}</p>
          <p className="text-xs text-zinc-500">{date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Item previews */}
      <div className="flex items-center gap-2 mb-4">
        {preview.map((item) => (
          <div key={item.id}
            className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.productName} width={48} height={48}
                className="w-full h-full object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
            )}
          </div>
        ))}
        {rest > 0 && (
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-zinc-400">+{rest}</span>
          </div>
        )}
        <div className="ml-auto text-right">
          <p className="text-[11px] text-zinc-400 mb-0.5">
            {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm font-bold text-zinc-900">{formatZar(order.totalAmount)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
        <p className="text-xs text-zinc-400 truncate max-w-[200px]">
          {order.shippingCity}, {order.shippingCountry}
        </p>
        <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-900 flex items-center gap-1 transition-colors">
          Track order
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders,  setOrders]  = useState<ApiUserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetchMyOrders(token)
      .then(setOrders)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-8">
            <Link href="/account" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 mb-5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              My Account
            </Link>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">History</p>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">My Orders</h1>
          </div>

          {/* Not signed in */}
          {!user && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">Sign in to view your orders</h2>
              <p className="text-sm text-zinc-400 mb-6">Track your purchases and manage your order history.</p>
              <Link href="/account?redirect=/orders"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                Sign In
              </Link>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-zinc-50 rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-px" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && user && orders.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">No orders yet</h2>
              <p className="text-sm text-zinc-400 mb-6">When you place an order, it will appear here.</p>
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                Start Shopping
              </Link>
            </div>
          )}

          {/* Order list */}
          {!loading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
