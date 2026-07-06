"use client";

import Link from "next/link";
import { Suspense } from "react";

function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}

const cols: Record<string, { label: string; href: string }[]> = {
  Shop: [
    { label: "New Arrivals",  href: "/products?sort=newest" },
    { label: "Men's",         href: "/products?gender=Men" },
    { label: "Women's",       href: "/products?gender=Women" },
    { label: "Kids'",         href: "/products?gender=Kids" },
    { label: "Sale",          href: "/products?sale=true" },
    { label: "Collections",   href: "/products" },
  ],
  Company: [
    { label: "About Us",      href: "/about" },
    { label: "Careers",       href: "/careers" },
    { label: "Press",         href: "/press" },
    { label: "Sustainability", href: "/sustainability" },
  ],
  Support: [
    { label: "Help Center",   href: "/help" },
    { label: "Order Status",  href: "/account" },
    { label: "Returns",       href: "/returns" },
    { label: "Size Guide",    href: "/size-guide" },
  ],
  Legal: [
    { label: "Privacy",       href: "/privacy" },
    { label: "Terms",         href: "/terms" },
    { label: "Cookies",       href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

const socials = [
  { label: "Instagram", href: "https://instagram.com/stryde", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label: "X / Twitter", href: "https://x.com/stryde", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: "TikTok", href: "https://tiktok.com/@stryde", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg> },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Main */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <svg width="110" height="38" viewBox="0 0 260 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fenwalk">
                <path d="M28 46 Q58 22 98 34 Q138 46 178 24 L182 32 Q142 54 102 42 Q62 30 28 56 Z" fill="#8fb3c8"/>
                <path d="M22 36 Q52 12 92 24 Q132 36 172 14 L176 22 Q136 44 96 32 Q56 20 22 46 Z" fill="#1d6b6a"/>
                <text x="22" y="80" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" fontSize="30" fontWeight="400" letterSpacing="0.5" fill="#354266">fenwalk</text>
              </svg>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">
              Premium footwear engineered for every stride. Where performance meets refined design.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-900 hover:text-white flex items-center justify-center text-zinc-500 transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(cols).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold tracking-[0.15em] text-zinc-900 uppercase mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            © <Suspense fallback="2026"><CurrentYear /></Suspense> Fenwalk. All rights reserved.
          </p>
          <div className="flex gap-2">
            {["VISA","MC","AMEX","PAYPAL"].map((p) => (
              <span key={p}
                className="text-[9px] font-black tracking-wider text-zinc-400 border border-zinc-200 rounded px-2 py-1">
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-5 text-xs text-zinc-400">
            <Link href="/privacy"  className="hover:text-zinc-700 transition-colors">Privacy</Link>
            <Link href="/terms"    className="hover:text-zinc-700 transition-colors">Terms</Link>
            <Link href="/cookies"  className="hover:text-zinc-700 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
