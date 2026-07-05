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

  if (!hero || !hero.headline?.trim()) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-zinc-950">
        <div className="text-center px-6">
          <p className="text-zinc-500 text-sm">
            No banner content yet — set it up in{" "}
            <span className="font-bold text-zinc-300">/admin → Hero Banner</span>.
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
    <section className="relative min-h-screen flex pt-16 overflow-hidden">

      {/* ── Left panel — dark, solid, text content ── */}
      <div className="relative z-10 flex flex-col justify-center bg-zinc-950 w-full lg:w-[52%] xl:w-[48%] px-10 sm:px-16 lg:px-20 py-24 lg:py-32">

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 h-[3px] w-full"
          style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)" }}
        />

        {/* Badge */}
        {hero.badge?.trim() && (
          <div className="animate-slide-left flex items-center gap-3 mb-8">
            <div
              className="w-8 h-[2px] rounded-full"
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
              className="animate-fade-up block text-[clamp(2.8rem,6vw,5rem)] font-black leading-[0.92] tracking-tight text-white"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              {word}
            </span>
          ))}
          {hero.accent?.trim() && (
            <span
              className="animate-fade-up delay-300 block text-[clamp(2.8rem,6vw,5rem)] font-black leading-[0.92] tracking-tight"
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
          className="animate-fade-up delay-300 h-[2px] w-12 rounded-full mb-7"
          style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
        />

        {/* Sub-text */}
        {hero.subtext?.trim() && (
          <p className="animate-fade-up delay-400 text-zinc-400 text-base leading-relaxed max-w-xs mb-10">
            {hero.subtext}
          </p>
        )}

        {/* CTAs */}
        {(hasCta1 || hasCta2) && (
          <div className="animate-fade-up delay-500 flex flex-wrap gap-4 mb-14">
            {hasCta1 && (
              <Link
                href={hero.cta1Url?.trim() || "/products"}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white border border-zinc-600 hover:border-zinc-400 transition-colors duration-300"
              >
                {hero.cta2Label}
              </Link>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="animate-fade-up delay-600 flex items-center gap-8 pt-8 border-t border-zinc-800">
          <div>
            <div className="text-2xl font-black text-white">10K+</div>
            <div className="text-[11px] text-zinc-500 mt-0.5 tracking-wide">Happy Customers</div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <div className="text-2xl font-black text-white">500+</div>
            <div className="text-[11px] text-zinc-500 mt-0.5 tracking-wide">Styles Available</div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <div className="text-2xl font-black text-white">4.9★</div>
            <div className="text-[11px] text-zinc-500 mt-0.5 tracking-wide">Average Rating</div>
          </div>
        </div>
      </div>

      {/* ── Right panel — image at full clarity ── */}
      <div className="hidden lg:block relative flex-1 bg-zinc-900">
        <Image
          src={bannerSrc}
          alt="Featured sneaker"
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover object-center"
          unoptimized={isExternalImg}
          priority
        />

        {/* Very subtle bottom fade only — to blend into page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/60 to-transparent" />

        {/* Best Seller card — solid */}
        {hasBestSeller && (
          <div className="animate-scale-in delay-700 absolute bottom-10 left-10 bg-white rounded-2xl shadow-2xl px-5 py-4 z-20">
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

        {/* Promo card — solid */}
        {hasPromo && (
          <div className="animate-scale-in delay-800 absolute top-10 right-10 bg-white rounded-2xl shadow-2xl px-5 py-4 z-20 max-w-[200px]">
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
      </div>

      {/* Mobile: show image behind with very minimal dark overlay */}
      <div className="absolute inset-0 lg:hidden -z-10">
        <Image
          src={bannerSrc}
          alt="Featured sneaker"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20"
          unoptimized={isExternalImg}
          priority
        />
      </div>

    </section>
  );
}
