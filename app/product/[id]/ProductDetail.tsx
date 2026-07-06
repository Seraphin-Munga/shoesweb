"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ApiProduct }      from "../../lib/types";
import { useCart }           from "../../context/CartContext";
import { useFavorites }      from "../../context/FavoritesContext";
import { useReviews, type Review } from "../../context/ReviewsContext";
import { useAuth }           from "../../context/AuthContext";
import { formatZar }  from "../../lib/currency";

/* ─── SVG ─────────────────────────────────────────────────── */
function ShoeDisplay({ bgColor }: { bgColor: string }) {
  return (
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <ellipse cx="250" cy="278" rx="200" ry="16" fill="rgba(0,0,0,0.07)" />
      <path d="M48 218 C44 206 44 182 62 170 L152 152 C178 145 196 134 204 112 C212 96 226 84 252 82 L306 80 C336 78 348 94 344 112 L340 126 L392 124 C420 123 446 138 451 164 L454 180 C457 198 449 210 430 214 L68 222 Z" fill="#1a1a1a" />
      <path d="M48 218 L430 214 L434 224 Q438 236 416 240 L82 244 Q60 244 54 232 Z" fill="#2d2d2d" />
      <path d="M48 218 C44 206 44 182 62 170 L110 160 C128 155 136 157 131 167 L108 178 C82 190 60 204 52 218 Z" fill="rgba(255,255,255,0.1)" />
      <path d="M204 112 C212 96 226 84 252 82 L288 81 L294 84 L288 116 L244 118 Z" fill="rgba(255,255,255,0.12)" />
      <path d="M294 84 L306 80 C336 78 348 94 344 112 L340 126 L308 128 L302 116 Z" fill="rgba(255,255,255,0.08)" />
      <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" fill="none">
        <line x1="208" y1="100" x2="246" y2="98" /><line x1="210" y1="110" x2="248" y2="108" />
        <line x1="212" y1="120" x2="250" y2="118" /><line x1="208" y1="100" x2="210" y2="110" />
        <line x1="218" y1="99"  x2="220" y2="109" /><line x1="228" y1="99"  x2="230" y2="109" />
        <line x1="238" y1="98"  x2="240" y2="108" />
      </g>
      <path d="M152 168 C212 161 292 154 352 152 L372 162 C312 164 232 170 164 180 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

/* ─── Stars (display) ──────────────────────────────────────── */
function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`${cls} ${s <= Math.round(rating) ? "text-zinc-900" : "text-zinc-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Interactive star picker ──────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((s) => (
        <button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110">
          <svg className={`w-8 h-8 transition-colors ${s <= (hover || value) ? "text-zinc-900" : "text-zinc-200"}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-zinc-400 self-center">
        {(hover || value) > 0 ? ["","Poor","Fair","Good","Great","Excellent"][hover || value] : ""}
      </span>
    </div>
  );
}

/* ─── Rating distribution bars ────────────────────────────── */
function RatingSummary({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const counts = [5,4,3,2,1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="flex flex-col sm:flex-row gap-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 mb-8">
      {/* Big avg */}
      <div className="flex flex-col items-center justify-center flex-shrink-0 sm:border-r sm:border-zinc-200 sm:pr-8">
        <span className="text-6xl font-black text-zinc-900 leading-none">{avg.toFixed(1)}</span>
        <Stars rating={avg} size="md" />
        <span className="text-xs text-zinc-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Bars */}
      <div className="flex-1 space-y-2">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-500 w-6 text-right">{star}</span>
            <svg className="w-3 h-3 text-zinc-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 bg-zinc-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-zinc-900 rounded-full transition-all duration-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-400 w-6">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Review card ──────────────────────────────────────────── */
function ReviewCard({ review, voted, onVote }: {
  review: Review;
  voted: boolean;
  onVote: (vote: "up" | "down") => void;
}) {
  const date = new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const initials = review.author.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="py-7 border-b border-zinc-100 last:border-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 text-white text-xs font-black flex items-center justify-center">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-bold text-zinc-900 text-sm">{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Purchase
              </span>
            )}
            <span className="text-xs text-zinc-400 ml-auto">{date}</span>
          </div>

          {/* Stars + title */}
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={review.rating} size="sm" />
            <span className="font-semibold text-zinc-900 text-sm">{review.title}</span>
          </div>

          {/* Body */}
          <p className="text-sm text-zinc-600 leading-relaxed">{review.body}</p>

          {/* Helpful */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-zinc-400">Helpful?</span>
            <button onClick={() => onVote("up")} disabled={voted}
              className={`flex items-center gap-1.5 text-xs border rounded-full px-3 py-1 transition-colors ${
                voted ? "text-zinc-300 border-zinc-100 cursor-default" : "text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Yes ({review.helpful})
            </button>
            <button onClick={() => onVote("down")} disabled={voted}
              className={`flex items-center gap-1.5 text-xs border rounded-full px-3 py-1 transition-colors ${
                voted ? "text-zinc-300 border-zinc-100 cursor-default" : "text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-600"
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              No ({review.notHelpful})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Write a review form ──────────────────────────────────── */
function ReviewForm({ productId, onSubmitted }: { productId: number; onSubmitted: () => void }) {
  const { addReview }  = useReviews();
  const { user }       = useAuth();
  const [rating, setRating] = useState(0);
  const [form, setForm]     = useState({ author: user ? `${user.firstName} ${user.lastName}` : "", title: "", body: "" });
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0)         { setError("Please select a star rating."); return; }
    if (!form.author.trim())  { setError("Please enter your name."); return; }
    if (!form.title.trim())   { setError("Please enter a review title."); return; }
    if (form.body.trim().length < 10) { setError("Review must be at least 10 characters."); return; }
    setError("");
    addReview({ productId, rating, author: form.author.trim(), title: form.title.trim(), body: form.body.trim() });
    setDone(true);
    setTimeout(onSubmitted, 1500);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-zinc-900 mb-1">Thank you for your review!</h3>
        <p className="text-sm text-zinc-400">Your review has been posted.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
      <h3 className="font-black text-zinc-900 text-base">Write a Review</h3>

      {/* Star rating */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-2">Your rating *</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Your name *</label>
        <input type="text" required value={form.author} onChange={set("author")}
          placeholder="Jane D."
          className="w-full border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white placeholder-zinc-400" />
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Review title *</label>
        <input type="text" required value={form.title} onChange={set("title")}
          placeholder="Great shoe for running"
          className="w-full border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white placeholder-zinc-400" />
      </div>

      {/* Body */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Your review *</label>
        <textarea required value={form.body} onChange={set("body")} rows={4}
          placeholder="Tell others about your experience with this product..."
          className="w-full border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white placeholder-zinc-400 resize-none" />
        <p className="text-xs text-zinc-400 mt-1">{form.body.length} / 500 characters</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <button type="submit"
        className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-zinc-700 transition-colors">
        Submit Review
      </button>
    </form>
  );
}

/* ─── Reviews tab content ──────────────────────────────────── */
type SortKey = "helpful" | "newest" | "highest" | "lowest";

function ReviewsSection({ productId }: { productId: number }) {
  const { getReviews, voteHelpful } = useReviews();
  const [sort, setSort]   = useState<SortKey>("helpful");
  const [showForm, setShowForm] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const rawReviews = getReviews(productId);

  const sorted = useMemo(() => {
    const c = [...rawReviews];
    switch (sort) {
      case "newest":  return c.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "highest": return c.sort((a, b) => b.rating - a.rating);
      case "lowest":  return c.sort((a, b) => a.rating - b.rating);
      default:        return c.sort((a, b) => b.helpful - a.helpful);
    }
  }, [rawReviews, sort]);

  const handleVote = (id: string, vote: "up" | "down") => {
    if (votedIds.has(id)) return;
    voteHelpful(id, vote);
    setVotedIds((v) => new Set([...v, id]));
  };

  return (
    <div>
      <RatingSummary reviews={rawReviews} />

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-zinc-500">Sort by</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-sm font-semibold border border-zinc-200 rounded-xl px-3 py-2 bg-white outline-none cursor-pointer hover:border-zinc-400 transition-colors">
            <option value="helpful">Most Helpful</option>
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <button onClick={() => setShowForm((v) => !v)}
          className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border transition-all duration-200 ${
            showForm ? "bg-zinc-100 border-zinc-200 text-zinc-600" : "bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-700"
          }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={showForm ? "M6 18L18 6M6 6l12 12" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
          </svg>
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="mb-8">
          <ReviewForm productId={productId} onSubmitted={() => setShowForm(false)} />
        </div>
      )}

      {/* Review list */}
      {rawReviews.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">No reviews yet</h3>
          <p className="text-sm text-zinc-400">Be the first to share your experience.</p>
        </div>
      ) : (
        <div>
          {sorted.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              voted={votedIds.has(r.id)}
              onVote={(vote) => handleVote(r.id, vote)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────── */
type TabKey = "description" | "details" | "reviews";

export default function ProductDetail({ product, related }: { product: ApiProduct; related: ApiProduct[] }) {
  const { addItem }             = useCart();
  const { toggle, isFav }       = useFavorites();
  const { getReviews }          = useReviews();
  const [selectedSize,  setSize]  = useState<number | null>(null);
  const [selectedColor, setColor] = useState(product?.colors?.[0]?.name ?? "");
  const imageUrls: string[] = (product as any).imageUrls ?? [];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty]             = useState(1);
  const [added, setAdded]         = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setTab]       = useState<TabKey>("description");

  if (!product) return null;

  const liveReviews  = getReviews(product.id);
  const reviewCount  = liveReviews.length || product.reviewCount || 0;

  const saleDiscount    = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const activeDiscount  = product.discountPercent ?? product.activeDiscount?.percent ?? null;
  const displayDiscount = activeDiscount ?? saleDiscount;
  const displayPrice    = product.discountedPrice ?? product.activeDiscount?.discountedPrice ?? product.price;
  const showStrike      = product.discountedPrice || product.activeDiscount
    ? product.price
    : product.originalPrice;
  const discountLabel   = product.discountLabel ?? product.activeDiscount?.label;
  const saveAmount      = showStrike ? showStrike - displayPrice : 0;

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, selectedSize, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-zinc-900 transition-colors">All Products</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left – shoe visual */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden flex items-center justify-center p-10"
              style={{ backgroundColor: product.bgColor, minHeight: 420 }}>
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
                {!product.isInStock && (
                  <span className="text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-zinc-400 text-white">
                    Out of Stock
                  </span>
                )}
                {displayDiscount && product.isInStock && (
                  <span className="text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-red-500 text-white">
                    {discountLabel ?? (product.badge ?? "Sale")} −{displayDiscount}%
                  </span>
                )}
                {product.badge && !displayDiscount && product.isInStock && (
                  <span className="text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-zinc-900 text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              <button onClick={() => toggle(product.id)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                <svg className={`w-5 h-5 transition-colors ${isFav(product.id) ? "text-red-500 fill-red-500" : "text-zinc-400"}`}
                  fill={isFav(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Prev / Next arrows (only when >1 image) */}
              {imageUrls.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10">
                    <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button onClick={() => setActiveImg((i) => (i + 1) % imageUrls.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10">
                    <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              <div className="w-full max-w-sm">
                {imageUrls.length > 0 ? (
                  <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                    <Image
                      key={activeImg}
                      src={imageUrls[activeImg]}
                      alt={`${product.name} — photo ${activeImg + 1}`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <ShoeDisplay bgColor={product.bgColor} />
                )}
              </div>
            </div>

            {/* Image thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2">
                {imageUrls.map((url, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-zinc-900" : "border-transparent hover:border-zinc-300"
                    }`}
                    style={{ aspectRatio: "1 / 1", backgroundColor: product.bgColor }}>
                    <Image src={url} alt={`view ${i + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Color swatches */}
            {(product.colors ?? []).length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {(product.colors ?? []).map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)}
                    className={`rounded-2xl h-16 border-2 transition-all duration-200 ${
                      selectedColor === c.name ? "border-zinc-900 scale-95" : "border-transparent hover:border-zinc-300"
                    }`}
                    style={{ backgroundColor: product.bgColor }} title={c.name}>
                    <span className="flex items-center justify-center h-full gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: c.hex }} />
                      <span className="text-[10px] font-medium text-zinc-500">{c.name}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right – info */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">{product.brand}</p>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">{product.name}</h1>

            {/* Rating summary + shortcut to reviews tab */}
            <button onClick={() => setTab("reviews")}
              className="flex items-center gap-3 mb-5 w-fit hover:opacity-70 transition-opacity">
              <Stars rating={product.rating} />
              <span className="text-sm text-zinc-500">{product.rating} · {reviewCount} reviews</span>
            </button>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 flex-wrap">
              <span className={`text-3xl font-black ${displayDiscount ? "text-red-600" : "text-zinc-900"}`}>
                {formatZar(displayPrice)}
              </span>
              {showStrike && (
                <>
                  <span className="text-xl text-zinc-400 line-through">{formatZar(showStrike)}</span>
                  {saveAmount > 0 && (
                    <span className="text-sm font-bold text-green-600">Save {formatZar(saveAmount)}</span>
                  )}
                </>
              )}
            </div>

            {/* Color */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-900">Color</span>
                <span className="text-sm text-zinc-500">{selectedColor}</span>
              </div>
              <div className="flex gap-2">
                {(product.colors ?? []).map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === c.name ? "border-zinc-900 scale-110" : "border-zinc-200 hover:border-zinc-400"
                    }`}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-900">Size (US)</span>
                <button className="text-xs text-zinc-400 underline hover:text-zinc-700 transition-colors">Size guide</button>
              </div>
              <div className={`grid grid-cols-6 gap-2 ${sizeError ? "ring-2 ring-red-400 ring-offset-2 rounded-xl p-1" : ""}`}>
                {(product.sizes ?? []).map((s) => (
                  <button key={s} onClick={() => { setSize(s); setSizeError(false); }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      selectedSize === s
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              {sizeError ? (
                <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Please select a size before adding to cart
                </p>
              ) : !selectedSize ? (
                <p className="text-xs text-zinc-400 mt-2">Select your size to continue</p>
              ) : null}
            </div>

            {/* Qty + Add */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-lg font-light">−</button>
                <span className="px-4 text-sm font-semibold text-zinc-900 min-w-[2.5rem] text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-lg font-light">+</button>
              </div>

              <button onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white"
                    : sizeError
                    ? "bg-red-500 text-white"
                    : selectedSize
                    ? "bg-zinc-900 text-white hover:bg-zinc-700"
                    : "bg-zinc-900 text-white hover:bg-zinc-700"
                }`}>
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </>
                ) : sizeError ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Select a Size First
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            <Link href="/cart"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold border border-zinc-200 hover:border-zinc-900 transition-colors mb-8">
              View Cart
            </Link>

            {/* Perks */}
            <div className="border-t border-zinc-100 pt-6 space-y-3">
              {[
                { icon: "🚚", text: "Free shipping on orders over $150" },
                { icon: "↩️", text: "Free returns within 5 days" },
                { icon: "✅", text: "Authenticity guaranteed" },
              ].map((p) => (
                <div key={p.text} className="flex items-center gap-3 text-sm text-zinc-500">
                  <span className="text-base">{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-20 border-t border-zinc-100 pt-12">
          <div className="flex gap-0 mb-8 border-b border-zinc-100 overflow-x-auto">
            {([
              { key: "description" as TabKey, label: "Description" },
              { key: "details"     as TabKey, label: "Details" },
              { key: "reviews"     as TabKey, label: `Reviews (${reviewCount})` },
            ]).map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`pb-3 px-1 mr-8 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === key ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div
              className="text-zinc-600 leading-relaxed max-w-2xl text-[15px] prose prose-sm prose-zinc [&_ul]:list-disc [&_ol]:list-decimal [&_a]:text-blue-600"
              dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
            />
          )}

          {activeTab === "details" && (
            <ul className="space-y-3 max-w-2xl">
              {(product.features ?? []).map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-zinc-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "reviews" && (
            <ReviewsSection productId={product.id} />
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-zinc-100 pt-12">
            <h2 className="text-2xl font-black text-zinc-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => {
                const pSaleDiscount = p.originalPrice
                  ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
                const pActiveDiscount = p.discountPercent ?? p.activeDiscount?.percent ?? null;
                const pDisplayDiscount = pActiveDiscount ?? pSaleDiscount;
                const pDisplayPrice = p.discountedPrice ?? p.activeDiscount?.discountedPrice ?? p.price;
                const pShowStrike = p.discountedPrice || p.activeDiscount ? p.price : p.originalPrice;

                return (
                <Link key={p.id} href={`/product/${p.id}`}
                  className="group bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl overflow-hidden transition-all duration-300 card-lift">
                  <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: p.bgColor }}>
                    {pDisplayDiscount && p.isInStock && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                        −{pDisplayDiscount}%
                      </span>
                    )}
                    <div className="w-32">
                      {p.imageUrls[0] ? (
                        <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                          <Image src={p.imageUrls[0]} alt={p.name} fill unoptimized className="object-contain" />
                        </div>
                      ) : (
                        <ShoeDisplay bgColor={p.bgColor} />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{p.name}</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-sm font-black ${pDisplayDiscount ? "text-red-600" : "text-zinc-900"}`}>
                        {formatZar(pDisplayPrice)}
                      </span>
                      {pShowStrike && (
                        <span className="text-xs text-zinc-400 line-through">{formatZar(pShowStrike)}</span>
                      )}
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
