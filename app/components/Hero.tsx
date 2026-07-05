import Link from "next/link";
import Image from "next/image";
import { fetchHeroContent } from "../lib/api";
import type { ApiHeroContent } from "../lib/types";

export default async function Hero() {
  let hero: ApiHeroContent | null = null;
  try {
    hero = await fetchHeroContent();
  } catch {
    // API unreachable — render nothing rather than stale hardcoded text
  }

  // If admin hasn't saved any content yet, show a setup prompt
  if (!hero || !hero.headline?.trim()) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-zinc-50">
        <div className="text-center px-6">
          <p className="text-zinc-400 text-sm">
            No banner content yet — set it up in{" "}
            <span className="font-bold text-zinc-600">/admin → Hero Banner</span>.
          </p>
        </div>
      </section>
    );
  }

  const headlineWords = hero.headline.trim().split(/\s+/).filter(Boolean);
  const hasCta1       = !!hero.cta1Label?.trim();
  const hasCta2       = !!hero.cta2Label?.trim();
  const hasPromo      = !!(hero.promoTitle?.trim() || hero.promoBody?.trim());
  const hasBestSeller = !!(hero.bestSellerName?.trim() || hero.bestSellerPrice?.trim());
  const bannerSrc     = hero.bannerImageUrl?.trim() || "/shoe-banner.png";
  const isExternalImg = bannerSrc.startsWith("http");

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-white">

      {/* ── Background shoe image ── */}
      <div className="absolute inset-0 animate-hero-image">
        <Image
          src={bannerSrc}
          alt="Featured sneaker"
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
          unoptimized={isExternalImg}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/20" />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-[3px] w-full z-10"
        style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
        <div className="max-w-[520px]">

          {/* Badge */}
          {hero.badge?.trim() && (
            <div className="animate-slide-left flex items-center gap-3 mb-8">
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
              />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-400">
                {hero.badge}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="mb-6">
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className="animate-fade-up block text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.9] tracking-tight text-zinc-900"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                {word}
              </span>
            ))}
            {hero.accent?.trim() && (
              <span
                className="animate-fade-up delay-300 block text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.9] tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {hero.accent}
              </span>
            )}
          </h1>

          <div
            className="animate-fade-up delay-300 h-0.5 w-12 rounded-full mb-7"
            style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
          />

          {/* Sub-text */}
          {hero.subtext?.trim() && (
            <p className="animate-fade-up delay-400 text-zinc-500 text-lg leading-relaxed max-w-xs mb-10">
              {hero.subtext}
            </p>
          )}

          {/* CTAs */}
          {(hasCta1 || hasCta2) && (
            <div className="animate-fade-up delay-500 flex flex-wrap gap-4 mb-14">
              {hasCta1 && (
                <Link
                  href={hero.cta1Url?.trim() || "/products"}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow duration-300"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                >
                  {hero.cta1Label}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              {hasCta2 && (
                <Link
                  href={hero.cta2Url?.trim() || "#categories"}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-zinc-800 border-2 border-zinc-300 hover:border-zinc-500 bg-white/70 backdrop-blur-sm transition-colors duration-300"
                >
                  {hero.cta2Label}
                </Link>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Floating card — Best Seller ── */}
      {hasBestSeller && (
        <div className="animate-scale-in delay-700 absolute bottom-24 right-10 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white px-5 py-4 z-20 hidden md:block">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase">Best Seller</span>
          </div>
          {hero.bestSellerName?.trim() && (
            <div className="text-zinc-900 font-bold text-sm">{hero.bestSellerName}</div>
          )}
          {hero.bestSellerPrice?.trim() && (
            <div
              className="font-black text-xl mt-0.5"
              style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {hero.bestSellerPrice}
            </div>
          )}
        </div>
      )}

      {/* ── Floating card — Promo ── */}
      {hasPromo && (
        <div className="animate-scale-in delay-800 absolute top-28 right-10 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white px-5 py-4 z-20 hidden md:block">
          {hero.promoLabel?.trim() && (
            <div className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase mb-1">{hero.promoLabel}</div>
          )}
          {hero.promoTitle?.trim() && (
            <div className="text-zinc-900 font-bold text-sm">{hero.promoTitle}</div>
          )}
          {hero.promoBody?.trim() && (
            <div className="text-zinc-500 text-xs mt-0.5">{hero.promoBody}</div>
          )}
        </div>
      )}

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-fade-up delay-800">
        <div className="w-px h-10 bg-gradient-to-b from-zinc-400 to-transparent" />
        <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase">Scroll</span>
      </div>
    </section>
  );
}
