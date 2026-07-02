"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "../lib/api";
import type { ApiCategory } from "../lib/types";

function ShoeOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M30 118 C26 108 26 88 40 80 L90 70 C110 65 122 56 126 42 C130 30 140 22 158 22 L184 22 C200 22 206 34 203 48 L200 60 L228 60 C252 60 268 74 272 96 L274 110 C276 122 270 130 254 132 L44 134 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 118 L254 132 L258 140 Q262 150 244 152 L50 152 Q34 152 30 142 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M126 42 C130 30 140 22 158 22 L176 22 L178 26 L172 60 L152 62 Z"
        fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="130" y1="50" x2="164" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="132" y1="58" x2="166" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="134" y1="66" x2="168" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

const CAT_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  Running: { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-900"  },
  Casual:  { bg: "bg-green-50",  border: "border-green-100",  text: "text-green-900" },
  Trail:   { bg: "bg-amber-50",  border: "border-amber-100",  text: "text-amber-900" },
  Sale:    { bg: "bg-red-50",    border: "border-red-100",    text: "text-red-900"   },
};

function catStyle(name: string) {
  return CAT_STYLES[name] ?? { bg: "bg-zinc-50", border: "border-zinc-200", text: "text-zinc-900" };
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">Shop by Category</p>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Find Your Fit</h2>
          </div>
          <Link href="/products"
            className="group hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-zinc-100 min-h-64" />
            ))}
          </div>
        )}

        {/* API categories */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const style = catStyle(cat.name);
              return (
                <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className={`group card-lift relative rounded-3xl overflow-hidden border ${cat.imageUrl ? "border-zinc-200" : style.border} flex flex-col cursor-pointer min-h-64`}>

                  {cat.imageUrl ? (
                    /* Real image — full bleed with dark overlay */
                    <>
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="relative mt-auto p-6">
                        <div className="text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1">
                          {cat.productCount} style{cat.productCount !== 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black text-white">{cat.name}</h3>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* SVG fallback */
                    <div className={`flex-1 flex flex-col ${style.bg} p-8`}>
                      <div className="flex-1 flex items-center justify-center py-6">
                        <ShoeOutline className="w-52 text-zinc-300 group-hover:text-zinc-400 transition-colors duration-300 img-zoom" />
                      </div>
                      <div className="mt-auto">
                        <div className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase mb-1">
                          {cat.productCount} style{cat.productCount !== 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-2xl font-black ${style.text}`}>{cat.name}</h3>
                          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Fallback when API has no categories yet */}
        {!loading && categories.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Running", count: "Shop now", bg: "bg-zinc-50",  border: "border-zinc-200" },
              { label: "Casual",  count: "Shop now", bg: "bg-stone-50", border: "border-stone-200" },
              { label: "Trail",   count: "Shop now", bg: "bg-slate-50", border: "border-slate-200" },
            ].map((cat) => (
              <Link key={cat.label} href={`/products?category=${cat.label}`}
                className={`group card-lift relative rounded-3xl overflow-hidden ${cat.bg} border ${cat.border} p-8 flex flex-col cursor-pointer min-h-64`}>
                <div className="flex-1 flex items-center justify-center py-6">
                  <ShoeOutline className="w-52 text-zinc-300 group-hover:text-zinc-400 transition-colors duration-300" />
                </div>
                <div className="mt-auto">
                  <div className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase mb-1">{cat.count}</div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-zinc-900">{cat.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
