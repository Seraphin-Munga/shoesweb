"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar  from "../components/Navbar";
import Footer  from "../components/Footer";
import { fetchProducts, fetchCategories, fetchColors } from "../lib/api";
import { formatZar }     from "../lib/currency";
import { useCart }       from "../context/CartContext";
import { useFavorites }  from "../context/FavoritesContext";
import { useReviews }    from "../context/ReviewsContext";
import type { ApiProduct, ApiCategory, ApiColorFull, ProductQuery } from "../lib/types";

/* ─── Types ──────────────────────────────────────────────── */
type SortKey  = "newest" | "price-asc" | "price-desc" | "rating" | "popular";
type ViewMode = "grid"   | "list";

type Filters = {
  categories: string[];  // category names
  colorIds:   number[];
  prices:     string[];
  sizes:      number[];
  inStock:    boolean;
};

/* ─── Constants ──────────────────────────────────────────── */
const ALL_SIZES = [6, 7, 8, 9, 10, 11, 12, 13];
const PRICE_BANDS    = [
  { label: "Under R2,775",    key: "under150" },
  { label: "R2,775 – R3,700", key: "150-200"  },
  { label: "Over R3,700",     key: "over200"  },
];
const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: "Newest",            key: "newest"     },
  { label: "Price: Low → High", key: "price-asc"  },
  { label: "Price: High → Low", key: "price-desc" },
  { label: "Top Rated",         key: "rating"     },
  { label: "Most Popular",      key: "popular"    },
];

/* ─── SVG ────────────────────────────────────────────────── */
function ShoeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
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

/* ─── Skeleton cards ─────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-zinc-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-100 rounded-full w-3/4" />
        <div className="h-3 bg-zinc-100 rounded-full w-1/2" />
        <div className="flex gap-1">
          {[1,2,3,4].map((i) => <div key={i} className="h-5 w-8 bg-zinc-100 rounded" />)}
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-zinc-100 rounded-full w-20" />
          <div className="h-8 w-8 bg-zinc-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Product image ──────────────────────────────────────── */
function ProductImg({ product, className }: { product: ApiProduct; className?: string }) {
  if (product.imageUrls[0])
    return <Image src={product.imageUrls[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className={`object-cover ${className ?? ""}`} />;
  return <ShoeSvg className={`w-full h-full p-4 ${className ?? ""}`} />;
}

/* ─── Grid card ──────────────────────────────────────────── */
function GridCard({ product }: { product: ApiProduct }) {
  const { addItem }       = useCart();
  const { toggle, isFav } = useFavorites();
  const { getReviews }    = useReviews();
  const [added, setAdded] = useState(false);

  const fav             = isFav(product.id);
  const saleDiscount    = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const activeDiscount  = product.discountPercent ?? null;
  const displayDiscount = activeDiscount ?? saleDiscount;
  const displayPrice    = product.discountedPrice ?? product.price;
  const showStrike      = product.discountedPrice ? product.price : product.originalPrice;
  const localReviews    = getReviews(product.id);
  const totalCount      = localReviews.length + product.reviewCount;
  const displayRating   = localReviews.length > 0
    ? localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length
    : product.rating;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isInStock) return;
    addItem(product as any, product.sizes[0] ?? 9, product.colors[0]?.name ?? "Default");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="relative group bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-100 transition-all duration-300">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden" style={{ backgroundColor: product.bgColor || "#f4f4f5" }}>
          {/* Badge row */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {!product.isInStock && (
              <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-zinc-400 text-white">
                Out of Stock
              </span>
            )}
            {displayDiscount && product.isInStock && (
              <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-red-500 text-white">
                {product.discountLabel ?? (product.badge ?? "Sale")} −{displayDiscount}%
              </span>
            )}
            {product.badge && !displayDiscount && product.isInStock && (
              <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                {product.badge}
              </span>
            )}
          </div>
          <ProductImg product={product} />
        </div>
      </Link>

      <button onClick={() => toggle(product.id)} aria-label="Favorite"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
        <svg className={`w-4 h-4 ${fav ? "text-red-500 fill-red-500" : "text-zinc-400"}`}
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
          <Stars rating={displayRating} />
          <span className="text-zinc-400 text-[11px]">({totalCount})</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {product.sizes.slice(0, 5).map((sz) => (
            <span key={sz} className="text-[10px] font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5">{sz}</span>
          ))}
          {product.sizes.length > 5 && <span className="text-[10px] text-zinc-400 px-1 py-0.5">+{product.sizes.length - 5}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`font-black text-base ${displayDiscount ? "text-red-600" : "text-zinc-900"}`}>
              {formatZar(displayPrice)}
            </span>
            {showStrike && (
              <span className="text-zinc-400 text-xs line-through">{formatZar(showStrike)}</span>
            )}
          </div>
          <button onClick={handleAdd} disabled={!product.isInStock}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 ${
              !product.isInStock ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : added ? "bg-green-500 text-white"
              : "bg-zinc-900 text-white hover:bg-zinc-700"
            }`}>
            {!product.isInStock ? "—" : added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── List row ───────────────────────────────────────────── */
function ListRow({ product }: { product: ApiProduct }) {
  const { addItem }       = useCart();
  const { toggle, isFav } = useFavorites();
  const { getReviews }    = useReviews();
  const [added, setAdded] = useState(false);

  const fav             = isFav(product.id);
  const activeDiscount  = product.discountPercent ?? null;
  const saleDiscount    = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const displayDiscount = activeDiscount ?? saleDiscount;
  const displayPrice    = product.discountedPrice ?? product.price;
  const showStrike      = product.discountedPrice ? product.price : product.originalPrice;
  const localReviews    = getReviews(product.id);
  const totalCount      = localReviews.length + product.reviewCount;
  const displayRating   = localReviews.length > 0
    ? localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length
    : product.rating;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isInStock) return;
    addItem(product as any, product.sizes[0] ?? 9, product.colors[0]?.name ?? "Default");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="flex gap-5 bg-white border border-zinc-100 hover:border-zinc-200 rounded-2xl overflow-hidden p-4 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-100">
      <Link href={`/product/${product.id}`}
        className="flex-shrink-0 w-36 h-28 rounded-xl overflow-hidden relative flex items-center justify-center"
        style={{ backgroundColor: product.bgColor || "#f4f4f5" }}>
        <ProductImg product={product} />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-bold text-zinc-900 hover:text-zinc-600 transition-colors">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!product.isInStock && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-200 text-zinc-500">
                  Out of Stock
                </span>
              )}
              {displayDiscount && product.isInStock && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
                  {product.discountLabel ?? (product.badge ?? "Sale")} −{displayDiscount}%
                </span>
              )}
              {product.badge && !displayDiscount && product.isInStock && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={displayRating} />
            <span className="text-zinc-400 text-xs">({totalCount} reviews)</span>
            <span className="text-xs text-zinc-300">·</span>
            <span className="text-xs text-zinc-400">{product.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-50">
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 6).map((sz) => (
              <span key={sz} className="text-[10px] font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5">{sz}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span className={`font-black ${displayDiscount ? "text-red-600" : "text-zinc-900"}`}>
                {formatZar(displayPrice)}
              </span>
              {showStrike && (
                <span className="block text-xs text-zinc-400 line-through">{formatZar(showStrike)}</span>
              )}
            </div>
            <button onClick={() => toggle(product.id)} aria-label="Favorite"
              className="p-2 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors">
              <svg className={`w-4 h-4 ${fav ? "text-red-500 fill-red-500" : "text-zinc-400"}`}
                fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={handleAdd} disabled={!product.isInStock}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 ${
                !product.isInStock ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : added ? "bg-green-500 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-700"
              }`}>
              {!product.isInStock ? "Out of Stock" : added ? "✓ Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Filter sidebar ─────────────────────────────────────── */
function FilterPanel({
  filters, search, apiCategories, apiColors, onChange, onReset,
}: {
  filters: Filters;
  search:  string;
  apiCategories: ApiCategory[];
  apiColors:     ApiColorFull[];
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  function toggleArr<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  const hasActive =
    filters.categories.length > 0 || filters.colorIds.length > 0 ||
    filters.prices.length > 0 || filters.sizes.length > 0 || filters.inStock;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-zinc-900 tracking-wide uppercase">Filters</h2>
        {hasActive && (
          <button onClick={onReset} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors underline">
            Clear all
          </button>
        )}
      </div>

      {search && (
        <div className="bg-zinc-50 rounded-xl px-3 py-2.5">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Search</p>
          <p className="text-sm font-semibold text-zinc-900 truncate">&ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* Availability */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Availability</h3>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input type="checkbox" checked={filters.inStock}
            onChange={() => onChange({ ...filters, inStock: !filters.inStock })}
            className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
          <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">In Stock Only</span>
        </label>
      </div>

      {/* Category — dynamic from API */}
      {apiCategories.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Category</h3>
          <div className="space-y-2">
            {apiCategories.filter((c) => c.isActive).map((cat) => (
              <label key={cat.id} className="flex items-center justify-between gap-2.5 cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <input type="checkbox"
                    checked={filters.categories.includes(cat.name)}
                    onChange={() => onChange({ ...filters, categories: toggleArr(filters.categories, cat.name) })}
                    className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{cat.name}</span>
                </div>
                <span className="text-[10px] text-zinc-400">{cat.productCount}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Price (ZAR)</h3>
        <div className="space-y-2">
          {PRICE_BANDS.map((band) => (
            <label key={band.key} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox"
                checked={filters.prices.includes(band.key)}
                onChange={() => onChange({ ...filters, prices: toggleArr(filters.prices, band.key) })}
                className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer" />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{band.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors — dynamic from API */}
      {apiColors.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {apiColors.filter((c) => c.isActive).map((color) => (
              <button key={color.id} title={color.name}
                onClick={() => onChange({ ...filters, colorIds: toggleArr(filters.colorIds, color.id) })}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  filters.colorIds.includes(color.id)
                    ? "border-zinc-900 scale-110 shadow-md"
                    : "border-transparent hover:border-zinc-400"
                }`}
                style={{ backgroundColor: color.hex }}>
                {color.hex === "#ffffff" && (
                  <span className="block w-full h-full rounded-full border border-zinc-200" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Size (US)</h3>
        <div className="grid grid-cols-4 gap-1.5">
          {ALL_SIZES.map((sz) => (
            <button key={sz}
              onClick={() => onChange({ ...filters, sizes: toggleArr(filters.sizes, sz) })}
              className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
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

/* ─── Active chips ───────────────────────────────────────── */
function ActiveChips({
  filters, sort, onRemoveCategory, onRemovePrice, onRemoveSize, onChangeSort,
}: {
  filters: Filters;
  sort: SortKey;
  onRemoveCategory: (c: string) => void;
  onRemovePrice:    (p: string) => void;
  onRemoveSize:     (s: number) => void;
  onChangeSort:     (s: SortKey) => void;
}) {
  const chips = [
    ...filters.categories.map((c) => ({ label: c, remove: () => onRemoveCategory(c) })),
    ...filters.prices.map((p) => ({ label: PRICE_BANDS.find((b) => b.key === p)?.label ?? p, remove: () => onRemovePrice(p) })),
    ...filters.sizes.map((s)  => ({ label: `US ${s}`, remove: () => onRemoveSize(s) })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {c.label}
          <button onClick={c.remove} className="hover:text-zinc-300 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}

      <div className="ml-auto lg:hidden">
        <select value={sort} onChange={(e) => onChangeSort(e.target.value as SortKey)}
          className="text-xs font-semibold border border-zinc-200 rounded-full px-3 py-1.5 outline-none bg-white text-zinc-700 cursor-pointer">
          {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ─── Pagination ─────────────────────────────────────────── */
function Pagination({ page, total, pageSize, onPage }: {
  page: number; total: number; pageSize: number; onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button disabled={page === 1} onClick={() => onPage(page - 1)}
        className="px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        ← Prev
      </button>

      {pages.reduce<(number | "...")[]>((acc, p, i, arr) => {
        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, []).map((p, i) => (
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-zinc-400 px-1">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)}
            className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${
              p === page
                ? "bg-zinc-900 text-white border-zinc-900"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}>
            {p}
          </button>
        )
      ))}

      <button disabled={page === totalPages} onClick={() => onPage(page + 1)}
        className="px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        Next →
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
const EMPTY_FILTERS: Filters = { categories: [], colorIds: [], prices: [], sizes: [], inStock: false };
const PAGE_SIZE = 12;

function ProductsContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const urlSearch   = searchParams.get("search")   ?? "";
  const urlCategory = searchParams.get("category") ?? "";
  const urlGender   = (searchParams.get("gender")  ?? "") as "Men" | "Women" | "";
  const urlSale     = searchParams.get("sale") === "true";
  const urlSort     = searchParams.get("sort") as SortKey | null;
  const urlPage     = Number(searchParams.get("page") ?? "1");

  const [products, setProducts]       = useState<ApiProduct[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [apiCategories, setApiCats]   = useState<ApiCategory[]>([]);
  const [apiColors, setApiColors]     = useState<ApiColorFull[]>([]);

  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY_FILTERS,
    categories: urlCategory ? [urlCategory] : [],
  }));
  const [gender, setGender]       = useState<"Men" | "Women" | "">(urlGender);
  const [sale, setSale]           = useState(urlSale);
  const [sort, setSort]           = useState<SortKey>(urlSort ?? "newest");
  const [view, setView]           = useState<ViewMode>("grid");
  const [page, setPage]           = useState(urlPage);
  const [search, setSearch]       = useState(urlSearch);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [drawerOpen, setDrawer]   = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load filter options once
  useEffect(() => {
    fetchCategories().then(setApiCats).catch(() => {});
    fetchColors().then(setApiColors).catch(() => {});
  }, []);

  // Sync URL → state when navigated from navbar or search modal
  useEffect(() => {
    setSearch(urlSearch);
    setSearchInput(urlSearch);
    setGender(urlGender);
    setSale(urlSale);
    if (urlSort) setSort(urlSort); else setSort("newest");
    setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlGender, urlSale, urlSort]);

  // Fetch products from API
  useEffect(() => {
    const query: ProductQuery = {
      search:     search || undefined,
      category:   filters.categories[0] || undefined,
      colorId:    filters.colorIds[0]   || undefined,
      priceRange: filters.prices[0]     || undefined,
      size:       filters.sizes[0]      || undefined,
      inStock:    filters.inStock || undefined,
      gender:     gender || undefined,
      sale:       sale || undefined,
      sort,
      page,
      pageSize: PAGE_SIZE,
    };

    setLoading(true);
    setError(null);

    fetchProducts(query)
      .then((res) => {
        setProducts(res.items);
        setTotal(res.total);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => setError("Failed to load products. Make sure the API is running."))
      .finally(() => setLoading(false));
  }, [search, filters, sort, page, gender, sale]);

  // Update URL when search changes
  const pushUrl = useCallback((q: string) => {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (page > 1) params.set("page", String(page));
    router.replace(`/products${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [router, page]);

  // Debounced inline search
  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
      pushUrl(val);
    }, 350);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    router.replace(`/products?${params}`, { scroll: false });
  };

  const resetFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  const hasFilters = filters.categories.length > 0 || filters.colorIds.length > 0 ||
    filters.prices.length > 0 || filters.sizes.length > 0 || filters.inStock;

  return (
    <>
      <Navbar />

      {/* Mobile filter drawer */}
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
            <FilterPanel filters={filters} search={search} apiCategories={apiCategories} apiColors={apiColors} onChange={(f) => { setFilters(f); setPage(1); }} onReset={resetFilters} />
            <button onClick={() => setDrawer(false)}
              className="w-full mt-8 bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm">
              {loading ? "Loading…" : `Show ${total} results`}
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-zinc-50 pt-16">
        {/* Header */}
        <div className="bg-white border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
            <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
              <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-zinc-900 transition-colors">All Products</Link>
              {(gender || sale || urlSort === "newest") && (
                <>
                  <span>/</span>
                  <span className="text-zinc-900 font-medium">
                    {gender ? `${gender}'s` : sale ? "Sale" : "New Arrivals"}
                  </span>
                </>
              )}
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                  {search
                    ? `Results for "${search}"`
                    : gender
                    ? `${gender}'s Shoes`
                    : sale
                    ? "Sale"
                    : urlSort === "newest"
                    ? "New Arrivals"
                    : "All Products"}
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                  {loading ? "Loading…" : `${total} product${total !== 1 ? "s" : ""} found`}
                </p>
              </div>

              {/* Inline search bar */}
              <div className="relative w-full sm:w-72">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-colors bg-white placeholder-zinc-400"
                />
                {searchInput && (
                  <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); pushUrl(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 bg-white border border-zinc-100 rounded-2xl p-6">
                <FilterPanel filters={filters} search={search} apiCategories={apiCategories} apiColors={apiColors} onChange={(f) => { setFilters(f); setPage(1); }} onReset={resetFilters} />
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">

              {/* Top bar */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-500 font-medium">
                    {loading ? "Loading products…" : `${products.length} of ${total}`}
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Mobile filter */}
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

                    {/* Sort */}
                    <div className="hidden lg:flex items-center gap-2">
                      <label className="text-xs text-zinc-500 font-medium">Sort by</label>
                      <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
                        className="text-sm font-semibold border border-zinc-200 bg-white rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-zinc-400 transition-colors">
                        {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
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
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {hasFilters && (
                  <ActiveChips
                    filters={filters} sort={sort}
                    onRemoveCategory={(c) => { setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })); setPage(1); }}
                    onRemovePrice={(p) => { setFilters((f) => ({ ...f, prices: f.prices.filter((x) => x !== p) })); setPage(1); }}
                    onRemoveSize={(s) => { setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })); setPage(1); }}
                    onChangeSort={(s) => { setSort(s); setPage(1); }}
                  />
                )}
              </div>

              {/* Error state */}
              {error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-1">API not reachable</h3>
                  <p className="text-zinc-400 text-sm max-w-xs">{error}</p>
                  <button onClick={() => window.location.reload()}
                    className="mt-4 text-xs font-bold text-zinc-900 border border-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white transition-colors">
                    Retry
                  </button>
                </div>
              )}

              {/* Products */}
              {!error && loading && (
                <div className={view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "space-y-4"}>
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {!error && !loading && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-1">No products found</h3>
                  <p className="text-zinc-400 text-sm mb-5">
                    {search ? `Nothing matched "${search}". Try different keywords.` : "Try removing some filters."}
                  </p>
                  <button onClick={() => { resetFilters(); setSearch(""); setSearchInput(""); pushUrl(""); }}
                    className="bg-zinc-900 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-zinc-700 transition-colors">
                    Clear All Filters
                  </button>
                </div>
              )}

              {!error && !loading && products.length > 0 && (
                view === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((p) => <GridCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((p) => <ListRow key={p.id} product={p} />)}
                  </div>
                )
              )}

              {!error && !loading && (
                <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPage={handlePageChange} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
