"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    section: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?",            a: "Standard delivery takes 3–5 business days within South Africa. Express (1–2 days) is available at checkout. Free standard shipping on orders over R1,500." },
      { q: "Can I track my order?",                   a: "Yes — once your order ships you'll receive an email with a tracking link. You can also track via the Order Status page in your account." },
      { q: "Can I change or cancel my order?",        a: "Orders can be changed or cancelled within 1 hour of placing them. After that, the order may have already been picked and packed. Contact us immediately at info@fenwalk.com." },
      { q: "Do you ship internationally?",            a: "We currently ship to South Africa, Namibia, Botswana, Zimbabwe, Zambia, and Mozambique. International expansion is coming in 2027." },
    ],
  },
  {
    section: "Returns & Refunds",
    items: [
      { q: "What is your return policy?",             a: "You have 5 days from delivery to return unworn shoes in original packaging. Worn or damaged items are not eligible. See our full Returns page for details." },
      { q: "How long do refunds take?",               a: "Once we receive your return, we process the refund within 2 business days. It may take a further 3–5 days to appear on your statement depending on your bank." },
      { q: "Can I exchange for a different size?",    a: "Yes. Simply return the original pair and place a new order for the correct size — we'll expedite your replacement order. Contact us for help." },
    ],
  },
  {
    section: "Products & Sizing",
    items: [
      { q: "How do I find my size?",                  a: "Visit our Size Guide for detailed charts and a how-to-measure guide. When in doubt, we recommend sizing up half a size for running shoes." },
      { q: "Are your shoes true to size?",            a: "Generally yes. Each product page notes if a style runs narrow or wide. Read product reviews for real-world sizing feedback." },
      { q: "What materials are used?",                a: "We use a mix of performance mesh, recycled polyester, EVA foam, and natural rubber depending on the shoe. Full material breakdowns are on each product page." },
    ],
  },
  {
    section: "Account & Payment",
    items: [
      { q: "What payment methods do you accept?",     a: "Visa, Mastercard, Amex, PayPal, and EFT. We do not store card details — all payments are processed via Stripe." },
      { q: "Is my payment information secure?",       a: "Yes. We use TLS encryption and PCI-compliant payment processing. We never see or store your full card number." },
      { q: "How do I reset my password?",             a: "Click 'Forgot password' on the login page and we'll email you a reset link within 5 minutes. Check your spam folder if it doesn't arrive." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-sm font-semibold text-zinc-800">{q}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <p className="text-sm text-zinc-500 leading-relaxed pb-4 pr-8">{a}</p>}
    </div>
  );
}

export default function HelpPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Help Center</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">How can we help?</h1>
          <p className="text-zinc-400 leading-relaxed">Find answers to common questions or get in touch with our team.</p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-12 px-6 border-b border-zinc-100 bg-zinc-50">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          {[
            { icon: "✉️", label: "Email Us",    detail: "info@fenwalk.com",     sub: "Reply within 24 hours" },
            { icon: "💬", label: "Live Chat",   detail: "Available 9am – 6pm",    sub: "Mon – Fri (SAST)" },
            { icon: "📞", label: "Call Us",     detail: "+27631920607",         sub: "Mon – Fri 9am – 5pm" },
          ].map(({ icon, label, detail, sub }) => (
            <div key={label} className="bg-white border border-zinc-100 rounded-2xl p-5 text-center">
              <span className="text-2xl mb-2 block">{icon}</span>
              <p className="font-black text-zinc-900 text-sm mb-0.5">{label}</p>
              <p className="text-zinc-600 text-xs font-medium">{detail}</p>
              <p className="text-zinc-400 text-[11px]">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {FAQS.map(({ section, items }) => (
            <div key={section}>
              <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-4">{section}</h2>
              <div className="bg-white border border-zinc-100 rounded-2xl px-5 divide-y divide-zinc-50">
                {items.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-16 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-black text-zinc-900 mb-2">Still need help?</h2>
          <p className="text-zinc-400 text-sm mb-6">Our support team is standing by.</p>
          <a href="mailto:info@fenwalk.com"
            className="inline-block bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
