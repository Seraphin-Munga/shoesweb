"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useReviews, type Review } from "../context/ReviewsContext";

/* ─── Stars ─────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-zinc-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Quote icon ─────────────────────────────────────────── */
function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.6 6.4 7.2 10.4H12V24H0zm20 0V14.4C20 6.4 24.8 1.6 34.4 0L36 2.4C30.4 3.6 27.6 6.4 27.2 10.4H32V24H20z" />
    </svg>
  );
}

/* ─── Product name map (matches seed productIds) ─────────── */
const PRODUCT_NAMES: Record<number, string> = {
  1: "Air Vortex Pro",
  2: "Urban Runner X",
  3: "Classic Luxe",
  4: "Street Edge V2",
  5: "Cloud Walk Elite",
  6: "Trail Blazer GTX",
  7: "Velocity Sprint",
  8: "Night Runner Dark",
};

/* ─── Review card ────────────────────────────────────────── */
function ReviewCard({ review, dark }: { review: Review; dark?: boolean }) {
  const initials = review.author.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const productName = PRODUCT_NAMES[review.productId] ?? "STRYDE Product";

  return (
    <div className={`flex flex-col rounded-3xl p-7 h-full ${
      dark
        ? "bg-zinc-900 text-white"
        : "bg-white border border-zinc-100"
    }`}>
      {/* Quote + stars */}
      <div className="flex items-start justify-between mb-5">
        <QuoteIcon className={`w-7 h-5 flex-shrink-0 ${dark ? "text-zinc-600" : "text-zinc-200"}`} />
        <Stars rating={review.rating} />
      </div>

      {/* Title */}
      <h4 className={`font-black text-base leading-snug mb-3 ${dark ? "text-white" : "text-zinc-900"}`}>
        &ldquo;{review.title}&rdquo;
      </h4>

      {/* Body */}
      <p className={`text-sm leading-relaxed flex-1 mb-6 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
        {review.body.length > 160 ? review.body.slice(0, 160).trimEnd() + "…" : review.body}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
            dark ? "bg-white/10 text-white" : "bg-zinc-900 text-white"
          }`}>
            {initials}
          </div>
          <div>
            <p className={`text-sm font-bold leading-none mb-0.5 ${dark ? "text-white" : "text-zinc-900"}`}>
              {review.author}
            </p>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/product/${review.productId}`}
                className={`text-[11px] hover:underline transition-colors ${dark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-700"}`}
              >
                {productName}
              </Link>
              {review.verified && (
                <>
                  <span className={`w-px h-3 ${dark ? "bg-zinc-700" : "bg-zinc-200"}`} />
                  <span className={`text-[10px] font-semibold ${dark ? "text-green-400" : "text-green-600"}`}>
                    ✓ Verified
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Helpful count */}
        {review.helpful > 0 && (
          <div className={`flex items-center gap-1 text-[10px] ${dark ? "text-zinc-600" : "text-zinc-300"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {review.helpful}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Overall stats strip ────────────────────────────────── */
function RatingStrip({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const five = reviews.filter((r) => r.rating === 5).length;
  const pct5 = Math.round((five / reviews.length) * 100);

  return (
    <div className="flex flex-wrap items-center gap-6 sm:gap-10">
      {/* Big rating */}
      <div className="flex items-end gap-3">
        <span className="text-6xl font-black text-zinc-900 leading-none">{avg.toFixed(1)}</span>
        <div className="pb-1">
          <Stars rating={avg} />
          <p className="text-xs text-zinc-400 mt-1">{reviews.length} verified reviews</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-14 bg-zinc-100" />

      {/* Stats */}
      <div className="flex gap-8">
        <div>
          <p className="text-2xl font-black text-zinc-900">{pct5}%</p>
          <p className="text-xs text-zinc-400 mt-0.5">5-star reviews</p>
        </div>
        <div>
          <p className="text-2xl font-black text-zinc-900">{reviews.filter((r) => r.verified).length}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Verified buyers</p>
        </div>
        <div>
          <p className="text-2xl font-black text-zinc-900">
            {reviews.reduce((s, r) => s + r.helpful, 0).toLocaleString()}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">Helpful votes</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────── */
export default function CustomerReviews() {
  const { getReviews } = useReviews();
  const [featured, setFeatured] = useState<Review[]>([]);
  const [allReviews, setAll]    = useState<Review[]>([]);
  const [page, setPage]         = useState(0);
  const trackRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Collect all reviews across every product
    const all: Review[] = [];
    for (let id = 1; id <= 8; id++) all.push(...getReviews(id));
    setAll(all);

    // Pick top 6 by helpful votes, must be 5-star or high-rated
    const top = [...all]
      .filter((r) => r.rating >= 4)
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, 6);
    setFeatured(top);
  }, [getReviews]);

  // Carousel: 3 visible on desktop, 1 on mobile
  const total = featured.length;
  const prev = () => setPage((p) => (p - 1 + total) % total);
  const next = () => setPage((p) => (p + 1) % total);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">
              Customer Reviews
            </p>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
              What People Say
            </h2>
          </div>
          <RatingStrip reviews={allReviews} />
        </div>

        {/* Desktop grid (hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-3 gap-5 mb-8">
          {featured.slice(0, 6).map((r, i) => (
            <ReviewCard key={r.id} review={r} dark={i === 1 || i === 4} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden rounded-3xl mb-5">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {featured.map((r, i) => (
                <div key={r.id} className="min-w-full">
                  <ReviewCard review={r} dark={i % 3 === 1} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev}
              className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {featured.map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === page ? "w-5 h-2 bg-zinc-900" : "w-2 h-2 bg-zinc-300"
                  }`}
                />
              ))}
            </div>

            <button onClick={next}
              className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 border border-zinc-200 bg-white rounded-full px-6 py-3 hover:border-zinc-400 transition-colors">
            Shop All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
