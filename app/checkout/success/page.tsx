"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

function SuccessContent() {
  const params   = useSearchParams();
  const orderId  = params.get("orderId");
  const { clearCart } = useCart();
  const ran      = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    clearCart();
    sessionStorage.removeItem("stryde_promo");
  }, [clearCart]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 py-20 text-center">

          <div className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Payment Successful!</h1>
          <p className="text-zinc-400 text-sm mb-2">
            Thank you for your order. We&apos;ve received your payment via{" "}
            <span className="font-semibold text-zinc-600">Yoco</span>.
          </p>

          {orderId && (
            <p className="text-zinc-400 text-sm mb-6">
              Order reference: <span className="font-bold text-zinc-900">#{orderId}</span>
            </p>
          )}

          <p className="text-zinc-400 text-sm mb-10">
            You&apos;ll receive a confirmation email shortly. Your shoes are on their way!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {orderId ? (
              <Link href={`/orders/${orderId}`}
                className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Track My Order
              </Link>
            ) : (
              <Link href="/orders"
                className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                View Orders
              </Link>
            )}
            <Link href="/products"
              className="border border-zinc-200 text-zinc-700 font-bold text-sm px-8 py-3.5 rounded-full hover:border-zinc-400 transition-colors">
              Continue Shopping
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-zinc-300">
            <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured by Yoco
          </div>
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
