"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { formatZar, toZar } from "../lib/currency";

function ShoeThumb() {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-3" aria-hidden="true">
      <ellipse cx="140" cy="148" rx="115" ry="10" fill="rgba(0,0,0,0.05)" />
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
      <path d="M124 42 C128 30 138 22 156 22 L174 22 L176 26 L170 60 L150 62 Z" fill="rgba(255,255,255,0.15)" />
      <path d="M88 80 C148 73 208 68 236 68 L248 78 C218 80 158 84 92 92 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

export default function CartPage() {
  const { items, count, subtotal, removeItem, updateQty, clearCart } = useCart();

  const subtotalZar = toZar(subtotal);
  const shippingZar = subtotalZar >= 2775 ? 0 : toZar(12.99); // R2775 ≈ $150
  const totalZar    = subtotalZar + shippingZar;

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Your Cart</h1>
              {count > 0 && (
                <p className="text-sm text-zinc-400 mt-1">{count} {count === 1 ? "item" : "items"}</p>
              )}
            </div>
            {count > 0 && (
              <button onClick={clearCart}
                className="text-sm text-zinc-400 hover:text-red-500 transition-colors underline">
                Clear cart
              </button>
            )}
          </div>

          {count === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Your cart is empty</h2>
              <p className="text-zinc-400 text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
              <Link href="/products"
                className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const key = `${item.product.id}-${item.size}-${item.color}`;
                  const colorHex = item.product.colors.find((c) => c.name === item.color)?.hex ?? "#888";

                  return (
                    <div key={key}
                      className="flex gap-5 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-colors">

                      {/* Thumbnail */}
                      <Link href={`/product/${item.product.id}`}
                        className="relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden"
                        style={{ backgroundColor: item.product.bgColor }}>
                        {item.product.imageUrls?.[0] ? (
                          <Image
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <ShoeThumb />
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/product/${item.product.id}`}
                              className="font-bold text-zinc-900 hover:text-zinc-600 transition-colors text-sm leading-snug">
                              {item.product.name}
                            </Link>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-zinc-400">Size US {item.size}</span>
                              <span className="w-px h-3 bg-zinc-200" />
                              <span className="flex items-center gap-1 text-xs text-zinc-400">
                                <span className="w-2.5 h-2.5 rounded-full border border-white/50" style={{ backgroundColor: colorHex }} />
                                {item.color}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-zinc-900 flex-shrink-0">
                            {formatZar(item.product.price * item.quantity)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty stepper */}
                          <div className="flex items-center border border-zinc-200 bg-white rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="px-3 py-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-base"
                            >−</button>
                            <span className="px-3 text-sm font-semibold text-zinc-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="px-3 py-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-base"
                            >+</button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            className="text-xs text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Continue shopping */}
                <Link href="/products"
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-black text-zinc-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal ({count} items)</span>
                      <span className="font-semibold text-zinc-900">{formatZar(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Shipping</span>
                      <span className={`font-semibold ${shippingZar === 0 ? "text-green-600" : "text-zinc-900"}`}>
                        {shippingZar === 0 ? "Free" : `R ${shippingZar.toFixed(2)}`}
                      </span>
                    </div>
                    {shippingZar > 0 && (
                      <p className="text-[11px] text-zinc-400">
                        Add {formatZar((2775 - subtotalZar) / 18.5)} more for free shipping
                      </p>
                    )}
                  </div>

                  {/* Promo */}
                  <div className="flex gap-2 mb-6">
                    <input type="text" placeholder="Promo code"
                      className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
                    <button className="bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
                      Apply
                    </button>
                  </div>

                  <div className="border-t border-zinc-200 pt-5 mb-6">
                    <div className="flex justify-between">
                      <span className="font-black text-zinc-900">Total</span>
                      <span className="font-black text-xl text-zinc-900">R {totalZar.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">Taxes calculated at checkout</p>
                  </div>

                  <button className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Checkout Securely
                  </button>

                  {/* Payment icons */}
                  <div className="flex justify-center gap-2 mt-4">
                    {["VISA","MC","AMEX","PAYPAL"].map((p) => (
                      <span key={p} className="text-[9px] font-black tracking-wider text-zinc-400 border border-zinc-200 rounded px-1.5 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
