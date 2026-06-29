"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products, type Product } from "../data/products";
import { useCart }      from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

/* ─── Types ──────────────────────────────────────────────── */
type SortKey   = "newest" | "price-asc" | "price-desc" | "rating" | "popular";
type ViewMode  = "grid" | "list";

type Filters = {
  categories: string[];
  prices:     string[];
  sizes:      number[];
};

/* ─── Constants ──────────────────────────────────────────── */
const ALL_CATEGORIES = ["Running", "Casual", "Trail"];
const ALL_SIZES      = [6, 7, 8, 9, 10, 11, 12, 13];
const PRICE_BANDS    = [
  { label: "Under $150",   key: "under150" },
  { label: "$150 – $200",  key: "150to200" },
  { label: "Over $200",    key: "over200"  },
];
const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: "Newest",             key: "newest"     },
  { label: "Price: Low → High",  key: "price-asc"  },
  { label: "Price: High → Low",  key: "price-desc" },
  { label: "Top Rated",          key: "rating"     },
  { label: "Most Popular",       key: "popular"    },
];

/* ─── Helpers ────────────────────────────────────────────── */
function matchesPrice(p: Product, bands: string[]) {
  if (bands.length === 0) return true;
  return bands.some((b) =>
    (b === "under150" && p.price < 150) ||
    (b === "150to200" && p.price >= 150 && p.price <= 200) ||
    (b === "over200"  && p.price > 200)
  );
}

function applySort(list: Product[], sort: SortKey) {
  const c = [...list];
  switch (sort) {
    case "price-asc":  return c.sort((a, b) => a.price - b.price);
    case "price-desc": return c.sort((a, b) => b.price - a.price);
    case "rating":     return c.sort((a, b) => b.rating - a.rating);
    case "popular":    return c.sort((a, b) => b.reviews - a.reviews);
    default:           return c; // newest = original order
  }
}

/* ─── Shoe SVG ───────────────────────────────────────────── */
function ShoeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <ellipse cx="140" cy="148" rx="115" ry="10" fill="rgba(0,0,0,0.05)" />
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
      <path d="M124 42 C128 30 138 22 156 22 L174 22 L176 26 L170 60 L150 62 Z" fill="rgba(255,255,255,0.15)" />
      <path d="M88 80 C148 73 208 68 236 68 L248 78 C218 80 158 84 92 92 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

/* ─── Stars ──────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-zinc-900" : "text-zinc-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Filter Sidebar ─────────────────────────────────────── */
function FilterPanel({
  filters, onChange, onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  function toggleArr<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  const hasActive =
    filters.categories.length > 0 || filters.prices.length > 0 || filters.sizes.length > 0;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-zinc-900 tracking-wide uppercase">Filters</h2>
        {hasActive && (
          <button onClick={onReset}
            className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors underline">
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Category</h3>
        <div className="space-y-2">
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => onChange({ ...filters, categories: toggleArr(filters.categories, cat) })}
                className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
              />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{cat}</span>
              <span className="ml-auto text-xs text-zinc-400">
                {products.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Price</h3>
        <div className="space-y-2">
          {PRICE_BANDS.map((band) => (
            <label key={band.key} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox"
                checked={filters.prices.includes(band.key)}
                onChange={() => onChange({ ...filters, prices: toggleArr(filters.prices, band.key) })}
                className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
              />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{band.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Size (US)</h3>
        <div className="grid grid-cols-4 gap-1.5">
          {ALL_SIZES.map((sz) => (
            <button key={sz}
              onClick={() => onChange({ ...filters, sizes: toggleArr(filters.sizes, sz) })}
              className={`py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                filters.sizes.includes(sz)
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-600"
              }`}>
              {sz}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Active filter chips ────────────────────────────────── */
function ActiveChips({
  filters, sort, onRemoveCategory, onRemovePrice, onRemoveSize, onChangeSort,
}: {
  filters: Filters;
  sort: SortKey;
  onRemoveCategory: (c: string)  => void;
  onRemovePrice:    (p: string)  => void;
  onRemoveSize:     (s: number)  => void;
  onChangeSort:     (s: SortKey) => void;
}) {
  const chips = [
    ...filters.categories.map((c) => ({ label: c,    remove: () => onRemoveCategory(c) })),
    ...filters.prices.map((p)     => ({ label: PRICE_BANDS.find((b) => b.key === p)?.label ?? p, remove: () => onRemovePrice(p) })),
    ...filters.sizes.map((s)      => ({ label: `US ${s}`, remove: () => onRemoveSize(s) })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c, i) => (
        <span key={i}
          className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {c.label}
          <button onClick={c.remove} className="hover:text-zinc-300 transition-colors leading-none">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}

      {/* Sort pill on mobile */}
      <div className="ml-auto lg:hidden">
        <select value={sort} onChange={(e) => onChangeSort(e.target.value as SortKey)}
          className="text-xs font-semibold border border-zinc-200 rounded-full px-3 py-1.5 outline-none bg-white text-zinc-700 cursor-pointer">
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ─── Grid card ──────────────────────────────────────────── */
function GridCard({ product }: { product: Product }) {
  const { addItem }       = useCart();
  const { toggle, isFav } = useFavorites();
  const [added, setAdded] = useState(false);

  const fav      = isFav(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.sizes[0], product.colors[0].name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="product-card group bg-white border border-zinc-100 rounded-2xl overflow-hidden card-lift">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden" style={{ backgroundColor: product.bgColor }}>
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-zinc-900 text-white">
              {product.badge}{discount ? ` −${discount}%` : ""}
            </span>
          )}
          <div className="img-zoom absolute inset-0 flex items-center justify-center p-6">
            <ShoeSvg className="w-full h-full" />
          </div>
        </div>
      </Link>

      <button onClick={() => toggle(product.id)} aria-label="Favorite"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
        <svg className={`w-4 h-4 transition-colors ${fav ? "text-red-500 fill-red-500" : "text-zinc-400"}`}
          fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-zinc-900 font-bold text-sm mb-1 hover:text-zinc-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating} />
          <span className="text-zinc-400 text-[11px]">({product.reviews})</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {product.sizes.slice(0, 5).map((sz) => (
            <span key={sz} className="text-[10px] font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5">{sz}</span>
          ))}
          {product.sizes.length > 5 && <span className="text-[10px] text-zinc-400 px-1 py-0.5">+{product.sizes.length - 5}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-zinc-900 font-black text-base">${product.price}</span>
            {product.originalPrice && (
              <span className="text-zinc-400 text-xs line-through">${product.originalPrice}</span>
            )}
          </div>
          <button onClick={handleAdd}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 ${
              added ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"
            }`}>
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── List row ───────────────────────────────────────────── */
function ListRow({ product }: { product: Product }) {
  const { addItem }       = useCart();
  const { toggle, isFav } = useFavorites();
  const [added, setAdded] = useState(false);

  const fav      = isFav(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.sizes[0], product.colors[0].name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group flex gap-5 bg-white border border-zinc-100 hover:border-zinc-200 rounded-2xl overflow-hidden p-4 transition-all duration-300 card-lift">
      {/* Image */}
      <Link href={`/product/${product.id}`}
        className="flex-shrink-0 w-36 h-28 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: product.bgColor }}>
        <ShoeSvg className="w-28" />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-bold text-zinc-900 hover:text-zinc-600 transition-colors">{product.name}</h3>
            </Link>
            {product.badge && (
              <span className="flex-shrink-0 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                {product.badge}{discount ? ` −${discount}%` : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={product.rating} />
            <span className="text-zinc-400 text-xs">({product.reviews} reviews)</span>
            <span className="text-xs text-zinc-300">·</span>
            <span className="text-xs text-zinc-400">{product.category}</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-50">
          {/* Sizes */}
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 6).map((sz) => (
              <span key={sz} className="text-[10px] font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5">{sz}</span>
            ))}
          </div>

          {/* Price + actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span className="font-black text-zinc-900">${product.price}</span>
              {product.originalPrice && (
                <span className="block text-xs text-zinc-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            <button onClick={() => toggle(product.id)} aria-label="Favorite"
              className="p-2 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors">
              <svg className={`w-4 h-4 transition-colors ${fav ? "text-red-500 fill-red-500" : "text-zinc-400"}`}
                fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={handleAdd}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 ${
                added ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"
              }`}>
              {added ? "✓ Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
const EMPTY_FILTERS: Filters = { categories: [], prices: [], sizes: [] };

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort]       = useState<SortKey>("newest");
  const [view, setView]       = useState<ViewMode>("grid");
  const [drawerOpen, setDrawer] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const catOk  = filters.categories.length === 0 || filters.categories.includes(p.category);
      const priceOk = matchesPrice(p, filters.prices);
      const sizeOk  = filters.sizes.length === 0 || filters.sizes.some((s) => p.sizes.includes(s));
      return catOk && priceOk && sizeOk;
    });
    return applySort(list, sort);
  }, [filters, sort]);

  const hasFilters =
    filters.categories.length > 0 || filters.prices.length > 0 || filters.sizes.length > 0;

  return (
    <>
      <Navbar />

      {/* Mobile filter drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="relative ml-auto w-72 bg-white h-full shadow-2xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-zinc-900">Filters</span>
              <button onClick={() => setDrawer(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
            <button onClick={() => setDrawer(false)}
              className="w-full mt-8 bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm">
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-zinc-50 pt-16">
        {/* Page header */}
        <div className="bg-white border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
            <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
              <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-zinc-900 font-medium">All Products</span>
            </nav>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">All Products</h1>
            <p className="text-zinc-500 text-sm mt-1">{products.length} styles available</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex gap-8">

            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 bg-white border border-zinc-100 rounded-2xl p-6">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(EMPTY_FILTERS)}
                />
              </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 min-w-0">

              {/* Top bar */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-500 font-medium">
                    {filtered.length === products.length
                      ? `${products.length} products`
                      : `${filtered.length} of ${products.length} products`}
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Mobile filter button */}
                    <button onClick={() => setDrawer(true)}
                      className="lg:hidden flex items-center gap-1.5 text-sm font-semibold border border-zinc-200 bg-white px-3 py-2 rounded-xl hover:border-zinc-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                      </svg>
                      Filter
                      {hasFilters && (
                        <span className="w-4 h-4 bg-zinc-900 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                          {filters.categories.length + filters.prices.length + filters.sizes.length}
                        </span>
                      )}
                    </button>

                    {/* Sort (desktop) */}
                    <div className="hidden lg:flex items-center gap-2">
                      <label className="text-xs text-zinc-500 font-medium whitespace-nowrap">Sort by</label>
                      <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                        className="text-sm font-semibold border border-zinc-200 bg-white rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-zinc-400 transition-colors">
                        {SORT_OPTIONS.map((o) => (
                          <option key={o.key} value={o.key}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center border border-zinc-200 bg-white rounded-xl overflow-hidden">
                      {(["grid", "list"] as const).map((v) => (
                        <button key={v} onClick={() => setView(v)} aria-label={v}
                          className={`p-2.5 transition-colors ${
                            view === v ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700"
                          }`}>
                          {v === "grid" ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active chips */}
                {hasFilters && (
                  <ActiveChips
                    filters={filters}
                    sort={sort}
                    onRemoveCategory={(c) => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) }))}
                    onRemovePrice={(p)    => setFilters((f) => ({ ...f, prices: f.prices.filter((x) => x !== p) }))}
                    onRemoveSize={(s)     => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) }))}
                    onChangeSort={setSort}
                  />
                )}
              </div>

              {/* Products */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-1">No products match your filters</h3>
                  <p className="text-zinc-400 text-sm mb-5">Try removing some filters to see more results.</p>
                  <button onClick={() => setFilters(EMPTY_FILTERS)}
                    className="bg-zinc-900 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-zinc-700 transition-colors">
                    Clear Filters
                  </button>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => <GridCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((p) => <ListRow key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
