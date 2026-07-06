import Link from "next/link";

const STEPS = [
  { step: "1", title: "Initiate Return",  body: "Log in to your account, go to Orders, and click 'Return' next to the item. Or email us at info@fenwalk.com with your order number." },
  { step: "2", title: "Pack Your Shoes",  body: "Place shoes in their original box with all packaging, laces, and accessories. Attach the prepaid return label we email you." },
  { step: "3", title: "Drop Off",         body: "Drop the package at any PostNet, Courier Guy drop-off point, or schedule a free collection from your address." },
  { step: "4", title: "Get Refunded",     body: "We'll inspect the return within 1 business day. Your refund is processed within 2 business days and appears on your statement in 3–5 days." },
];

const ELIGIBLE = [
  "Unworn shoes in original condition",
  "Within 5 days of delivery",
  "Original packaging included",
  "Tags and laces still attached",
];

const NOT_ELIGIBLE = [
  "Worn or damaged shoes",
  "After 5 days of delivery",
  "Items marked 'Final Sale'",
  "Missing original packaging",
];

export default function ReturnsPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Returns & Refunds</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-5">
            Easy returns.<br />
            <span className="text-zinc-400">No hassle.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            Not the right fit? Return within 5 days for a full refund, free of charge.
          </p>
        </div>
      </section>

      {/* Policy summary */}
      <section className="py-12 px-6 border-b border-zinc-100 bg-zinc-50">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          {[
            { title: "30 Days",           sub: "Return window from delivery" },
            { title: "Free Returns",      sub: "Prepaid label provided" },
            { title: "2 Business Days",   sub: "Refund processing time" },
          ].map(({ title, sub }) => (
            <div key={title} className="bg-white border border-zinc-100 rounded-2xl p-6 text-center">
              <p className="text-2xl font-black text-zinc-900 mb-1">{title}</p>
              <p className="text-xs text-zinc-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">How It Works</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-10">Return in 4 easy steps</h2>
          <div className="space-y-5">
            {STEPS.map(({ step, title, body }) => (
              <div key={step} className="flex gap-5 border border-zinc-100 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white text-sm font-black flex items-center justify-center flex-shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="font-black text-zinc-900 mb-1">{title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-black text-zinc-900 mb-5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Eligible for return
            </h3>
            <div className="space-y-2">
              {ELIGIBLE.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-black text-zinc-900 mb-5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              Not eligible
            </h3>
            <div className="space-y-2">
              {NOT_ELIGIBLE.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-zinc-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-black text-zinc-900 mb-2">Ready to return?</h2>
          <p className="text-zinc-400 text-sm mb-6">Log in to your account to start the process, takes under 2 minutes.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/account"
              className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
              My Account
            </Link>
            <a href="mailto:info@fenwalk.com"
              className="border border-zinc-200 text-zinc-700 font-bold text-sm px-8 py-3.5 rounded-full hover:border-zinc-400 transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
