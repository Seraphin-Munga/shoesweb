"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { BASE } from "../../lib/api";
import { formatZar } from "../../lib/currency";
import type { ApiUserOrder } from "../../lib/types";

function SuccessContent() {
  const params   = useSearchParams();
  const orderId  = params.get("orderId");
  const { clearCart } = useCart();
  const { token } = useAuth();
  const ran      = useRef(false);
  const [order,   setOrder]   = useState<ApiUserOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!orderId || !token || ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const res = await fetch(`${BASE}/orders/${orderId}/confirm-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success && json.data) setOrder(json.data as ApiUserOrder);
      } catch {
        setError("Could not load order details. Your payment was received.");
      } finally {
        clearCart();
        sessionStorage.removeItem("stryde_promo");
        setLoading(false);
      }
    })();
  }, [clearCart, orderId, token]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Success header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Payment Successful!</h1>
            <p className="text-zinc-400 text-sm">
              Secured by{" "}
              <span className="font-semibold text-zinc-600">Yoco</span>
              {orderId && (
                <> · Order <span className="font-bold text-zinc-900">#{orderId}</span></>
              )}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-center">
              <p className="text-sm text-amber-700">{error}</p>
              {orderId && (
                <Link href={`/orders/${orderId}`} className="inline-block mt-3 text-sm font-bold text-zinc-900 underline underline-offset-2">
                  View my order →
                </Link>
              )}
            </div>
          )}

          {!loading && order && (
            <div className="space-y-4">

              {/* Email notification */}
              <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">Confirmation email sent</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    We&apos;ve emailed your order details to{" "}
                    <span className="font-bold">{order.customerEmail}</span>
                  </p>
                </div>
              </div>

              {/* Order items */}
              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-100">
                  <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your Items</h2>
                </div>
                <ul className="divide-y divide-zinc-100">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">👟</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{item.productName}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {[
                            item.size > 0 && `Size ${item.size}`,
                            item.color,
                            `×${item.quantity}`,
                          ].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-zinc-900 flex-shrink-0">{formatZar(item.subtotal)}</p>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="px-5 py-4 border-t border-zinc-100 space-y-2 bg-zinc-50">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Subtotal</span>
                    <span>{formatZar(order.subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Shipping</span>
                    <span>{order.shippingAmount === 0 ? "Free" : formatZar(order.shippingAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-200">
                    <span>Total paid</span>
                    <span>{formatZar(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-white rounded-2xl border border-zinc-100 px-5 py-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Shipping to</h2>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{order.shippingName}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {[order.shippingAddress, order.shippingCity, order.shippingCountry].filter(Boolean).join(", ")}
                    </p>
                    {order.phoneNumber && (
                      <p className="text-xs text-zinc-400 mt-0.5">{order.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* What's next */}
              <div className="bg-white rounded-2xl border border-zinc-100 px-5 py-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">What happens next?</h2>
                <div className="space-y-3">
                  {[
                    { icon: "📦", label: "Packing", desc: "Your order is being prepared for dispatch." },
                    { icon: "🚚", label: "Shipping", desc: "You'll receive a tracking number once your parcel is on its way." },
                    { icon: "🏠", label: "Delivery", desc: "Your shoes will be delivered to your shipping address." },
                  ].map((s) => (
                    <div key={s.label} className="flex items-start gap-3">
                      <span className="text-lg leading-none mt-0.5">{s.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">{s.label}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={`/orders/${order.id}`}
                  className="flex-1 bg-zinc-900 text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Track My Order
                </Link>
                <Link href="/products"
                  className="flex-1 border border-zinc-200 text-zinc-700 font-bold text-sm px-6 py-3.5 rounded-full hover:border-zinc-400 transition-colors flex items-center justify-center">
                  Continue Shopping
                </Link>
              </div>

              {/* Help */}
              <p className="text-center text-xs text-zinc-400 pb-4">
                Questions?{" "}
                <a href="mailto:info@fenwalk.com" className="text-zinc-600 hover:text-zinc-900 font-semibold transition-colors">
                  info@fenwalk.com
                </a>
              </p>

            </div>
          )}

          {/* Static fallback when no order loaded and not loading */}
          {!loading && !order && !error && (
            <div className="text-center py-8 space-y-4">
              <p className="text-zinc-400 text-sm">Your order has been placed. We&apos;ll email your confirmation shortly.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/orders"
                  className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                  View My Orders
                </Link>
                <Link href="/products"
                  className="border border-zinc-200 text-zinc-700 font-bold text-sm px-8 py-3.5 rounded-full hover:border-zinc-400 transition-colors">
                  Continue Shopping
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
