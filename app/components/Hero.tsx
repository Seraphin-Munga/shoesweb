import Link from "next/link";
import Image from "next/image";
import { fetchHeroContent } from "../lib/api";
import type { ApiHeroContent } from "../lib/types";

export default async function Hero() {
  let hero: ApiHeroContent | null = null;
  try {
    hero = await fetchHeroContent();
  } catch {
    // API unreachable
  }

  if (!hero || !hero.headline?.trim()) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-zinc-950">
        <p className="text-zinc-500 text-sm">
          No banner content — configure it in{" "}
          <span className="font-bold text-zinc-300">/admin → Hero Banner</span>.
        </p>
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
    <section className="relative min-h-screen bg-zinc-950 pt-16 overflow-hidden">

      {/* ── Right-half image — absolutely positioned, full clarity ── */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[55%]">
        <Image
          src={bannerSrc}
          alt="Featured sneaker"
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-center"
          unoptimized={isExternalImg}
          priority
        />
        {/* Fade edge — blends into dark left panel on desktop only */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-zinc-950 to-transparent" />
        {/* Dark tint for mobile so text stays readable */}
        <div className="lg:hidden absolute inset-0 bg-zinc-950/75" />
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20"
        style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)" }}
      />

      {/* ── Left-half content ── */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full lg:w-[52%] px-8 sm:px-14 lg:px-20 py-28">

          {/* Badge */}
          {hero.badge?.trim() && (
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-8 h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }}
              />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-400">
                {hero.badge}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="mb-5">
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className="block text-[clamp(3.5rem,7vw,6rem)] font-black leading-[0.88] tracking-tight text-white"
              >
                {word}
              </span>
            ))}
            {hero.accent?.trim() && (
              <span
                className="block text-[clamp(3.5rem,7vw,6rem)] font-black leading-[0.88] tracking-tight"
                style={{
                  background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {hero.accent}
              </span>
            )}
          </h1>

          {/* Divider */}
          <div
            className="h-[2px] w-14 rounded-full mb-7"
            style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }}
          />

          {/* Sub-text */}
          {hero.subtext?.trim() && (
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm mb-10">
              {hero.subtext}
            </p>
          )}

          {/* CTAs */}
          {(hasCta1 || hasCta2) && (
            <div className="flex flex-wrap gap-4 mb-14">
              {hasCta1 && (
                <Link
                  href={hero.cta1Url?.trim() || "/products"}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
                >
                  {hero.cta1Label}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              {hasCta2 && (
                <Link
                  href={hero.cta2Url?.trim() || "#categories"}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white border border-zinc-600 hover:border-zinc-400 transition-colors"
                >
                  {hero.cta2Label}
                </Link>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-8 pt-8 border-t border-zinc-800">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Styles Available" },
              { value: "4.9★", label: "Average Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-8 bg-zinc-800" />}
                <div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating cards (desktop, over image side) ── */}

      {hasBestSeller && (
        <div className="absolute bottom-12 right-10 bg-white rounded-2xl shadow-2xl px-5 py-4 z-20 hidden lg:block">
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

      {hasPromo && (
        <div className="absolute top-24 right-10 bg-white rounded-2xl shadow-2xl px-5 py-4 z-20 hidden lg:block max-w-[200px]">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent" />
        <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">Scroll</span>
      </div>

    </section>
  );
}
