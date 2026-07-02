"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchProducts } from "../lib/api";
import { formatZar } from "../lib/currency";
import type { ApiProduct } from "../lib/types";

const POPULAR_TAGS = ["Running", "Trail", "Casual", "Air Vortex", "Sale"];

function ShoeMini() {
  return (
    <svg viewBox="0 0 280 160" className="w-10 h-6" aria-hidden="true">
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
      <path d="M88 80 C148 73 208 68 236 68 L248 78 C218 80 158 84 92 92 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

type Props = { onClose: () => void };

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<ApiProduct[]>([]);
  const [loading, setLoading]     = useState(false);
  const [trending, setTrending]   = useState<ApiProduct[]>([]);
  const [activeIdx, setActive]    = useState(-1);
  const inputRef   = useRef<HTMLInputElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router     = useRouter();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Load trending on mount
  useEffect(() => {
    searchProducts("", 4).catch(() => {});
    // fetch popular products for "trending now"
    import("../lib/api").then(({ fetchProducts }) =>
      fetchProducts({ sort: "popular", pageSize: 4 })
        .then((r) => setTrending(r.items))
        .catch(() => {})
    );
  }, []);

  // Debounced search
  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); setLoading(false); return; }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchProducts(q, 8);
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleChange = (val: string) => { setQuery(val); setActive(-1); };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter") {
      if (activeIdx >= 0 && results[activeIdx]) {
        router.push(`/product/${results[activeIdx].id}`);
        onClose();
      } else if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  }, [activeIdx, results, router, onClose, query]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const q = query.trim();

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative z-10 bg-white shadow-2xl animate-search-drop">
        <div className="max-w-3xl mx-auto px-6 py-5">

          {/* Input */}
          <div className="flex items-center gap-4">
            {loading ? (
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}

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
              className="flex-shrink-0 text-xs font-bold text-zinc-400 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-2.5 py-1.5 transition-colors">
              ESC
            </button>
          </div>

          {/* Results */}
          {q.length > 0 && !loading && results.length > 0 && (
            <div ref={listRef} className="mt-4 pb-2 space-y-0.5 max-h-[28rem] overflow-y-auto scrollbar-thin">
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

                    <div className="w-14 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: p.bgColor || "#f4f4f5" }}>
                      {p.imageUrls[0] ? (
                        <Image src={p.imageUrls[0]} alt={p.name} width={56} height={40}
                          unoptimized className="object-cover w-full h-full" />
                      ) : (
                        <ShoeMini />
                      )}
                    </div>

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

                    <div className="flex-shrink-0 text-right">
                      <div className="font-black text-zinc-900 text-sm">{formatZar(p.price)}</div>
                      {discount && (
                        <div className="text-[10px] font-semibold text-green-600">−{discount}%</div>
                      )}
                    </div>

                    <svg className="w-4 h-4 text-zinc-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}

              <Link
                href={`/products?search=${encodeURIComponent(q)}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-zinc-100 hover:border-zinc-300 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-all">
                View all results for &ldquo;{q}&rdquo; in catalog
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* No results */}
          {q.length > 0 && !loading && results.length === 0 && (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">
                No results for <span className="font-semibold text-zinc-900">&ldquo;{query}&rdquo;</span>
              </p>
              <p className="text-xs text-zinc-400 mt-1">Try a different keyword or browse the catalog.</p>
              <Link href="/products" onClick={onClose}
                className="inline-block mt-4 text-xs font-bold text-zinc-900 border border-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white transition-colors">
                Browse all products
              </Link>
            </div>
          )}

          {/* Loading shimmer */}
          {loading && q.length > 0 && (
            <div className="mt-4 space-y-2 pb-2">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-3 py-3 rounded-xl animate-pulse">
                  <div className="w-14 h-10 rounded-xl bg-zinc-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 rounded-full w-3/4" />
                    <div className="h-2.5 bg-zinc-100 rounded-full w-1/2" />
                  </div>
                  <div className="h-4 bg-zinc-100 rounded-full w-16 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state: tags + trending */}
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

              {trending.length > 0 && (
                <>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-5 mb-3">Trending now</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {trending.map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} onClick={onClose}
                        className="flex flex-col items-center p-3 rounded-xl hover:bg-zinc-50 transition-colors text-center group">
                        <div className="w-full h-14 rounded-lg flex items-center justify-center mb-2 overflow-hidden"
                          style={{ backgroundColor: p.bgColor || "#f4f4f5" }}>
                          {p.imageUrls[0] ? (
                            <Image src={p.imageUrls[0]} alt={p.name} width={80} height={56}
                              unoptimized className="object-cover w-full h-full" />
                          ) : (
                            <ShoeMini />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-500 transition-colors leading-tight">{p.name}</span>
                        <span className="text-xs font-black text-zinc-900 mt-0.5">{formatZar(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
