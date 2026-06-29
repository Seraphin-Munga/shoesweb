"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "../data/products";

function ShoeMini() {
  return (
    <svg viewBox="0 0 280 160" className="w-10 h-6" aria-hidden="true">
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
      <path d="M88 80 C148 73 208 68 236 68 L248 78 C218 80 158 84 92 92 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

const POPULAR_TAGS = ["Running", "Trail", "Casual", "Air Vortex", "Sale"];

type Props = { onClose: () => void };

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery]       = useState("");
  const [activeIdx, setActive]  = useState(-1);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  /* focus input on open */
  useEffect(() => { inputRef.current?.focus(); }, []);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const q = query.trim().toLowerCase();
  const results = q.length === 0 ? [] : products.filter((p) =>
    p.name.toLowerCase().includes(q)        ||
    p.brand.toLowerCase().includes(q)       ||
    p.category.toLowerCase().includes(q)    ||
    p.description.toLowerCase().includes(q) ||
    p.features.some((f) => f.toLowerCase().includes(q))
  );

  /* keyboard nav */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter" && activeIdx >= 0 && results[activeIdx]) {
      router.push(`/product/${results[activeIdx].id}`);
      onClose();
    }
  }, [activeIdx, results, router, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* scroll active item into view */
  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const handleChange = (val: string) => { setQuery(val); setActive(-1); };

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel — slides in from top */}
      <div className="relative z-10 bg-white shadow-2xl animate-search-drop">
        <div className="max-w-3xl mx-auto px-6 py-5">

          {/* Input row */}
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search shoes, brands, categories…"
              className="flex-1 text-base text-zinc-900 placeholder-zinc-400 outline-none bg-transparent py-1 min-w-0"
              autoComplete="off"
              spellCheck={false}
            />

            {query && (
              <button onClick={() => handleChange("")}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center transition-colors">
                <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <button onClick={onClose}
              className="flex-shrink-0 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 hover:border-zinc-400 rounded-lg px-2.5 py-1.5">
              ESC
            </button>
          </div>

          {/* ── Results ── */}
          {results.length > 0 && (
            <div
              ref={listRef}
              className="mt-4 pb-2 space-y-0.5 max-h-[28rem] overflow-y-auto scrollbar-thin"
            >
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((p, i) => {
                const discount = p.originalPrice
                  ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
                return (
                  <Link key={p.id} href={`/product/${p.id}`} onClick={onClose}
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 group ${
                      i === activeIdx ? "bg-zinc-100" : "hover:bg-zinc-50"
                    }`}>
                    {/* Thumb */}
                    <div
                      className="w-14 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: p.bgColor }}>
                      <ShoeMini />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-900 text-sm group-hover:text-zinc-600 transition-colors truncate">{p.name}</div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>{p.category}</span>
                        <span className="text-zinc-200">·</span>
                        <span>{p.brand}</span>
                        {p.badge && (
                          <>
                            <span className="text-zinc-200">·</span>
                            <span className="font-semibold text-zinc-500">{p.badge}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <div className="font-black text-zinc-900 text-sm">${p.price}</div>
                      {discount && (
                        <div className="text-[10px] font-semibold text-green-600">−{discount}%</div>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-zinc-300 flex-shrink-0 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}

              {/* View all link */}
              <Link href={`/products`} onClick={onClose}
                className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-zinc-100 hover:border-zinc-300 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-all">
                View all {results.length} results in catalog
                <svg className="w-3.5 h-3.5 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* ── No results ── */}
          {q.length > 0 && results.length === 0 && (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">
                No results for <span className="font-semibold text-zinc-900">"{query}"</span>
              </p>
              <p className="text-xs text-zinc-400 mt-1">Try a different keyword or browse the catalog.</p>
              <Link href="/products" onClick={onClose}
                className="inline-block mt-4 text-xs font-bold text-zinc-900 border border-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white transition-colors">
                Browse all products
              </Link>
            </div>
          )}

          {/* ── Empty state: quick tags ── */}
          {q.length === 0 && (
            <div className="mt-5 pb-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <button key={tag} onClick={() => handleChange(tag)}
                    className="text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-full transition-colors">
                    {tag}
                  </button>
                ))}
              </div>

              {/* Trending products */}
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-5 mb-3">Trending now</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {products.slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} onClick={onClose}
                    className="flex flex-col items-center p-3 rounded-xl hover:bg-zinc-50 transition-colors text-center group">
                    <div className="w-full h-14 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: p.bgColor }}>
                      <ShoeMini />
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-500 transition-colors leading-tight">{p.name}</span>
                    <span className="text-xs font-black text-zinc-900 mt-0.5">${p.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
