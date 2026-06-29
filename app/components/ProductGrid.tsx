"use client";

import { useState } from "react";
import Link from "next/link";
import { products }     from "../data/products";
import { useCart }      from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

function ShoeCard() {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <ellipse cx="140" cy="148" rx="115" ry="10" fill="rgba(0,0,0,0.05)" />
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
      <path d="M28 118 C24 108 24 88 38 80 L78 72 C88 69 96 72 92 80 L70 90 C50 100 34 110 30 118 Z" fill="rgba(255,255,255,0.12)" />
      <path d="M124 42 C128 30 138 22 156 22 L174 22 L176 26 L170 60 L150 62 Z" fill="rgba(255,255,255,0.15)" />
      <path d="M170 60 L182 22 C198 22 204 34 201 48 L198 60 Z" fill="rgba(255,255,255,0.08)" />
      <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <line x1="128" y1="50" x2="162" y2="48" />
        <line x1="130" y1="58" x2="164" y2="56" />
        <line x1="132" y1="66" x2="166" y2="64" />
        <line x1="128" y1="50" x2="130" y2="58" />
        <line x1="138" y1="49" x2="140" y2="57" />
        <line x1="148" y1="49" x2="150" y2="57" />
        <line x1="158" y1="49" x2="160" y2="57" />
      </g>
      <path d="M88 80 C148 73 208 68 236 68 L248 78 C218 80 158 84 92 92 Z" fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}

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

export default function ProductGrid() {
  const { addItem }             = useCart();
  const { toggle, isFav }       = useFavorites();
  const [added, setAdded]       = useState<number[]>([]);
  const [activeFilter, setActive] = useState("All");

  const filters = ["All", "Running", "Casual", "Trail"];

  const filtered = activeFilter === "All"
    ? products
    : products.filter((p) => p.category === activeFilter);


  const quickAdd = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const product = products.find((p) => p.id === id);
    if (!product) return;
    addItem(product, product.sizes[0], product.colors[0].name);
    setAdded((p) => [...p, id]);
    setTimeout(() => setAdded((p) => p.filter((i) => i !== id)), 2000);
  };

  return (
    <section id="new-arrivals" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">Fresh Drops</p>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">New Arrivals</h2>
          </div>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setActive(f)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const inWish    = isFav(p.id);
            const justAdded = added.includes(p.id);
            const discount  = p.originalPrice
              ? Math.round((1 - p.price / p.originalPrice) * 100) : null;

            return (
              <article key={p.id}
                className="product-card group bg-white border border-zinc-100 rounded-2xl overflow-hidden card-lift relative">

                {/* Clickable image area → detail page */}
                <Link href={`/product/${p.id}`} className="block">
                  <div className="relative h-52 overflow-hidden" style={{ backgroundColor: p.bgColor }}>
                    {p.badge && (
                      <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                        {p.badge}{discount ? ` −${discount}%` : ""}
                      </span>
                    )}
                    <div className="img-zoom absolute inset-0 flex items-center justify-center p-6">
                      <ShoeCard />
                    </div>
                  </div>
                </Link>

                {/* Wishlist */}
                <button onClick={() => toggle(p.id)} aria-label="Wishlist"
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                  <svg className={`w-4 h-4 transition-colors ${inWish ? "text-red-500 fill-red-500" : "text-zinc-400"}`}
                    fill={inWish ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/product/${p.id}`}>
                    <h3 className="text-zinc-900 font-bold text-sm mb-1 hover:text-zinc-600 transition-colors">{p.name}</h3>
                  </Link>

                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={p.rating} />
                    <span className="text-zinc-400 text-[11px]">({p.reviews})</span>
                  </div>

                  {/* Sizes preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.sizes.slice(0, 5).map((sz) => (
                      <span key={sz}
                        className="text-[10px] font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5">
                        {sz}
                      </span>
                    ))}
                    {p.sizes.length > 5 && (
                      <span className="text-[10px] text-zinc-400 px-1 py-0.5">+{p.sizes.length - 5}</span>
                    )}
                  </div>

                  {/* Price + Quick add */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-zinc-900 font-black text-base">${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-zinc-400 text-xs line-through">${p.originalPrice}</span>
                      )}
                    </div>
                    <button onClick={(e) => quickAdd(e, p.id)}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 ${
                        justAdded
                          ? "bg-green-500 text-white"
                          : "bg-zinc-900 text-white hover:bg-zinc-700"
                      }`}>
                      {justAdded ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all */}
        <div className="flex justify-center mt-12">
          <button className="btn-outline group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold">
            View All Products
            <svg className="w-4 h-4 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
