import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex items-center justify-center px-6 pt-16">
        <div className="max-w-lg w-full text-center">

          {/* Large 404 */}
          <div className="relative mb-8 select-none">
            <span
              className="text-[clamp(8rem,22vw,14rem)] font-black leading-none tracking-tight"
              style={{
                background: "linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              404
            </span>
            {/* Shoe icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-zinc-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h1l1 2h13l1-2h1M5 12l-1 4h16l-1-4M8 12V8a4 4 0 018 0v4"
                />
              </svg>
            </div>
          </div>

          {/* Fenwalk wave mark */}
          <div className="flex justify-center mb-6">
            <svg width="80" height="28" viewBox="0 0 260 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 46 Q58 22 98 34 Q138 46 178 24 L182 32 Q142 54 102 42 Q62 30 28 56 Z" fill="#8fb3c8"/>
              <path d="M22 36 Q52 12 92 24 Q132 36 172 14 L176 22 Q136 44 96 32 Q56 20 22 46 Z" fill="#1d6b6a"/>
            </svg>
          </div>

          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Looks like this page stepped out. The link may be broken, or the page may have been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-zinc-700 border border-zinc-200 hover:border-zinc-900 transition-colors"
            >
              Browse Products
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-14 pt-8 border-t border-zinc-100">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Popular pages</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "New Arrivals", href: "/products?sort=newest" },
                { label: "Men",          href: "/products?gender=Men" },
                { label: "Women",        href: "/products?gender=Women" },
                { label: "Sale",         href: "/products?sale=true" },
                { label: "My Orders",    href: "/orders" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 bg-zinc-50 border border-zinc-100 hover:border-zinc-300 hover:text-zinc-900 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
