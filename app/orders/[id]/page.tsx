"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { fetchMyOrder } from "../../lib/api";
import { formatZar } from "../../lib/currency";
import type { ApiUserOrder, ApiOrderStatus } from "../../lib/types";

/* ── Status stepper ──────────────────────────────────────── */
const STEPS: { key: ApiOrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: 0,
    label: "Order Placed",
    desc: "We've received your order",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 1,
    label: "Processing",
    desc: "Preparing your items",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    key: 2,
    label: "Shipped",
    desc: "On the way to you",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    key: 3,
    label: "Delivered",
    desc: "Enjoy your new kicks!",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

const ORDER_INDEX: Record<ApiOrderStatus, number> = {
  0:  0,
  1:  1,
  2:  2,
  3:  3,
  4: -1,
};

function StatusStepper({ status }: { status: ApiOrderStatus }) {
  const current = ORDER_INDEX[status] ?? 0;

  if (status === 4) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500 mt-0.5">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-zinc-100 hidden sm:block" style={{ zIndex: 0 }} />
      <div
        className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 hidden sm:block transition-all duration-500"
        style={{ width: `${(current / (STEPS.length - 1)) * (100 - (10 / STEPS.length))}%`, zIndex: 1 }}
      />

      <div className="relative flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-0">
        {STEPS.map((step, i) => {
          const done    = i < current;
          const active  = i === current;
          const pending = i > current;

          return (
            <div key={step.key} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 flex-1">
              {/* Circle */}
              <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                done   ? "bg-indigo-500 border-indigo-500 text-white" :
                active ? "bg-white border-indigo-500 text-indigo-600 shadow-lg shadow-indigo-100" :
                         "bg-white border-zinc-200 text-zinc-300"
              }`}>
                {done ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.icon}
              </div>

              {/* Labels */}
              <div className={`sm:text-center ${pending ? "opacity-40" : ""}`}>
                <p className={`text-sm font-bold ${active ? "text-zinc-900" : done ? "text-zinc-700" : "text-zinc-400"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-zinc-400 hidden sm:block">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function OrderDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const { token }  = useAuth();
  const [order,   setOrder]   = useState<ApiUserOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!token || !id) { setLoading(false); return; }
    fetchMyOrder(Number(id), token)
      .then(setOrder)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [token, id]);

  const date = order
    ? new Date(order.createdAt).toLocaleDateString("en-ZA", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* Back nav */}
          <Link href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 mb-8 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            My Orders
          </Link>

          {/* Loading */}
          {loading && (
            <div className="space-y-6">
              <div className="h-8 bg-zinc-50 rounded-xl animate-pulse w-48" />
              <div className="h-32 bg-zinc-50 rounded-2xl animate-pulse" />
              <div className="h-40 bg-zinc-50 rounded-2xl animate-pulse" />
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

          {!loading && order && (
            <div className="space-y-6">

              {/* Header */}
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-1">Order #{order.id}</p>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Track Your Order</h1>
                <p className="text-sm text-zinc-400 mt-1">{date}</p>
              </div>

              {/* Status stepper */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-zinc-900 mb-6">Delivery Status</h2>
                <StatusStepper status={order.status} />
              </div>

              {/* Items */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-zinc-900 mb-4">
                  Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                </h2>
                <div className="divide-y divide-zinc-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.productName} width={56} height={56}
                            className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productId}`}
                          className="text-sm font-semibold text-zinc-900 hover:underline truncate block">
                          {item.productName}
                        </Link>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Size {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-zinc-900">{formatZar(item.subtotal)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-zinc-400">{formatZar(item.unitPrice)} each</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two-col: shipping + summary */}
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Shipping address */}
                <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-zinc-900 mb-3">Shipping To</h2>
                  <div className="text-sm text-zinc-600 space-y-0.5">
                    <p className="font-semibold text-zinc-900">{order.shippingName}</p>
                    {order.phoneNumber && <p className="text-zinc-500">{order.phoneNumber}</p>}
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}</p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-zinc-900 mb-3">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="font-medium text-zinc-900">{formatZar(order.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Shipping</span>
                      <span className={`font-medium ${order.shippingAmount === 0 ? "text-green-600" : "text-zinc-900"}`}>
                        {order.shippingAmount === 0 ? "Free" : formatZar(order.shippingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-zinc-100">
                      <span className="text-zinc-900">Total</span>
                      <span
                        className="text-base"
                        style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                      >
                        {formatZar(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link href="/products"
                  className="flex-1 text-center bg-zinc-900 text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                  Continue Shopping
                </Link>
                <Link href="/orders"
                  className="flex-1 text-center border border-zinc-200 text-zinc-700 font-bold text-sm px-6 py-3.5 rounded-full hover:border-zinc-400 transition-colors">
                  All Orders
                </Link>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
