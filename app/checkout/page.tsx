"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toZar, formatZarAmount } from "../lib/currency";
import { createOrder } from "../lib/api";
import type { ValidatePromoResponse } from "../lib/types";

type PaymentMethod = "yoco";

type ShippingForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

const COUNTRIES = ["South Africa", "Zimbabwe", "Botswana", "Namibia", "Mozambique", "Zambia", "Other"];

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user, token } = useAuth();
  const [promo, setPromo] = useState<ValidatePromoResponse | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("stryde_promo");
      if (raw) setPromo(JSON.parse(raw));
    } catch {}
  }, []);

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: user?.firstName ?? "",
    lastName:  user?.lastName  ?? "",
    email:     user?.email     ?? "",
    phone:     "",
    address:   "",
    city:      "",
    country:   "South Africa",
  });
  const [method] = useState<PaymentMethod>("yoco");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const subtotalZar  = toZar(subtotal);
  const shippingZar  = subtotalZar >= 2775 ? 0 : toZar(12.99);
  const discountZar  = (() => {
    if (!promo?.valid) return 0;
    if (promo.discountType === "percent")
      return Math.round(subtotalZar * (promo.discountValue! / 100) * 100) / 100;
    return Math.min(promo.discountValue!, subtotalZar);
  })();
  const totalZar     = subtotalZar + shippingZar - discountZar;

  const field = (key: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShipping((prev) => ({ ...prev, [key]: e.target.value }));

  const valid = Object.values(shipping).every((v) => v.trim() !== "");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // Step 1: create the order (Pending, not yet paid)
      const order = await createOrder({
        customerName:    `${shipping.firstName} ${shipping.lastName}`,
        customerEmail:   shipping.email,
        phoneNumber:     shipping.phone,
        shippingAddress: shipping.address,
        shippingCity:    shipping.city,
        shippingCountry: shipping.country,
        paymentMethod:   method,
        paymentConfirmed: false,
        items: items.map((i) => ({
          productId:   i.product.id,
          productName: i.product.name,
          quantity:    i.quantity,
          unitPrice:   i.product.price,
          size:        i.size,
          color:       i.color,
        })),
      }, token ?? undefined);

      // Step 2: redirect to Yoco with the real order ID
      await redirectToYoco(order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function redirectToYoco(orderId: number) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api";
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${apiUrl}/payments/yoco/checkout`, {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId, amountZar: totalZar, frontendBaseUrl: window.location.origin }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message ?? "Could not initiate Yoco checkout.");

    window.location.href = json.data.redirectUrl;
  }

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <Navbar />
        <main className="min-h-screen bg-white pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Your cart is empty.</p>
            <Link href="/products" className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
              Shop Now
            </Link>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="mb-10">
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Cart
            </Link>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Checkout</h1>
          </div>

          <form onSubmit={handleCheckout}>
            <div className="grid lg:grid-cols-5 gap-12">

              {/* ── Left: Shipping + Payment ── */}
              <div className="lg:col-span-3 space-y-8">

                {/* Shipping */}
                <section>
                  <h2 className="text-lg font-black text-zinc-900 mb-5">Shipping Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">First Name</label>
                      <input value={shipping.firstName} onChange={field("firstName")} required
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Last Name</label>
                      <input value={shipping.lastName} onChange={field("lastName")} required
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Email Address</label>
                      <input type="email" value={shipping.email} onChange={field("email")} required
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Phone Number</label>
                      <input type="tel" value={shipping.phone} onChange={field("phone")} required placeholder="+27 81 234 5678"
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Street Address</label>
                      <input value={shipping.address} onChange={field("address")} required placeholder="123 Main Street"
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">City</label>
                      <input value={shipping.city} onChange={field("city")} required
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Country</label>
                      <select value={shipping.country} onChange={field("country")} required
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900 transition-colors bg-white">
                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section>
                  <h2 className="text-lg font-black text-zinc-900 mb-5">Payment</h2>
                  <div className="flex items-center gap-3 p-5 rounded-2xl border-2 border-zinc-900 bg-zinc-900 text-white">
                    <div className="font-black text-2xl tracking-tight">yoco</div>
                    <p className="text-xs text-zinc-300">Visa · Mastercard · Amex</p>
                  </div>
                  <p className="text-xs mt-3 flex items-center gap-1.5 text-zinc-400">
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Your payment is secured by Yoco, your card details never touch our servers.
                  </p>
                </section>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}
              </div>

              {/* ── Right: Order Summary ── */}
              <div className="lg:col-span-2">
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-black text-zinc-900 mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                    {items.map((item) => {
                      const key = `${item.product.id}-${item.size}-${item.color}`;
                      return (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-zinc-600 truncate pr-2">
                            {item.product.name}
                            <span className="text-zinc-400 ml-1">× {item.quantity}</span>
                            <span className="text-zinc-400 ml-1">US {item.size}</span>
                          </span>
                          <span className="font-semibold text-zinc-900 flex-shrink-0">
                            {formatZarAmount(toZar(item.product.price * item.quantity))}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-zinc-200 pt-4 space-y-2 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="font-semibold">{formatZarAmount(subtotalZar)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Shipping</span>
                      <span className={`font-semibold ${shippingZar === 0 ? "text-green-600" : "text-zinc-900"}`}>
                        {shippingZar === 0 ? "Free" : formatZarAmount(shippingZar)}
                      </span>
                    </div>
                    {discountZar > 0 && promo && (
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {promo.code}
                        </span>
                        <span className="font-semibold text-green-600">- {formatZarAmount(discountZar)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-200 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-black text-zinc-900">Total</span>
                      <span className="font-black text-xl text-zinc-900">{formatZarAmount(totalZar)}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading || !valid}
                    className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Redirecting to Yoco…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay {formatZarAmount(totalZar)} with Yoco
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
