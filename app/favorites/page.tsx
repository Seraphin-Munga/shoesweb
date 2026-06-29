"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useFavorites } from "../context/FavoritesContext";
import { useCart }      from "../context/CartContext";
import { products }     from "../data/products";

function ShoeThumb() {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <ellipse cx="140" cy="148" rx="115" ry="10" fill="rgba(0,0,0,0.05)" />
      <path d="M28 118 C24 108 24 88 38 80 L88 70 C108 65 120 56 124 42 C128 30 138 22 156 22 L182 22 C198 22 204 34 201 48 L198 60 L226 60 C250 60 266 74 270 96 L272 110 C274 122 268 130 252 132 L42 134 Z" fill="#1a1a1a" />
      <path d="M28 118 L252 132 L256 140 Q260 150 242 152 L48 152 Q32 152 28 142 Z" fill="#2d2d2d" />
      <path d="M124 42 C128 30 138 22 156 22 L174 22 L176 26 L170 60 L150 62 Z" fill="rgba(255,255,255,0.15)" />
      <path d="M88 80 C148 73 208 68 236 68 L248 78 C218 80 158 84 92 92 Z" fill="rgba(255,255,255,0.2)" />
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

export default function FavoritesPage() {
  const { ids, toggle } = useFavorites();
  const { addItem }     = useCart();

  const favProducts = products.filter((p) => ids.includes(p.id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">Saved Items</p>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">My Favorites</h1>
              {favProducts.length > 0 && (
                <p className="text-sm text-zinc-400 mt-1">{favProducts.length} {favProducts.length === 1 ? "item" : "items"} saved</p>
              )}
            </div>
            {favProducts.length > 0 && (
              <Link href="/#new-arrivals"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                Browse more
                <svg className="w-4 h-4 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {favProducts.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">No favorites yet</h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-xs">
                Tap the heart on any product to save it here for later.
              </p>
              <Link href="/#new-arrivals"
                className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {favProducts.map((p) => (
                <article key={p.id}
                  className="group bg-white border border-zinc-100 rounded-2xl overflow-hidden card-lift">

                  <Link href={`/product/${p.id}`} className="block">
                    <div className="relative h-52 overflow-hidden" style={{ backgroundColor: p.bgColor }}>
                      {p.badge && (
                        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                          {p.badge}
                        </span>
                      )}
                      <div className="img-zoom absolute inset-0 flex items-center justify-center p-6">
                        <ShoeThumb />
                      </div>
                    </div>
                  </Link>

                  {/* Remove from favorites */}
                  <button onClick={() => toggle(p.id)} aria-label="Remove from favorites"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors group/heart z-10">
                    <svg className="w-4 h-4 text-red-500 fill-red-500 group-hover/heart:fill-none group-hover/heart:text-zinc-400 transition-all"
                      fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <div className="p-4">
                    <Link href={`/product/${p.id}`}>
                      <h3 className="text-zinc-900 font-bold text-sm mb-1 hover:text-zinc-600 transition-colors">{p.name}</h3>
                    </Link>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Stars rating={p.rating} />
                      <span className="text-zinc-400 text-[11px]">({p.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-zinc-900 font-black text-base">${p.price}</span>
                        {p.originalPrice && (
                          <span className="text-zinc-400 text-xs line-through">${p.originalPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(p, p.sizes[0], p.colors[0].name)}
                        className="text-xs font-bold px-3.5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-700 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
