"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function CancelContent() {
  const params  = useSearchParams();
  const payment = params.get("payment");
  const isError = params.get("error") === "1";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 py-20 text-center">

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">
            {isError ? "Payment Failed" : "Payment Cancelled"}
          </h1>
          <p className="text-zinc-400 text-sm mb-10">
            {isError
              ? `Your payment via ${payment === "payfast" ? "PayFast" : "Yoco"} could not be processed. No charge was made.`
              : "You cancelled the payment. Your cart is still saved — you can try again whenever you're ready."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/checkout"
              className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
              Try Again
            </Link>
            <Link href="/cart"
              className="border border-zinc-200 text-zinc-700 font-bold text-sm px-8 py-3.5 rounded-full hover:border-zinc-400 transition-colors">
              Back to Cart
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
