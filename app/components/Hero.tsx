import Link from "next/link";

function ShoeIllustration() {
  return (
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      {/* Soft shadow under shoe */}
      <ellipse cx="258" cy="268" rx="190" ry="18" fill="rgba(0,0,0,0.06)" />

      {/* Sole */}
      <path
        d="M58 218 Q58 238 88 246 L408 246 Q442 246 448 230 L453 213 Q456 200 438 196 L378 196 L58 218 Z"
        fill="#1a1a1a"
      />

      {/* Midsole highlight */}
      <path
        d="M58 218 L438 210 L440 222 Q444 236 408 238 L88 238 Q66 238 60 226 Z"
        fill="#2d2d2d"
      />

      {/* Main upper body */}
      <path
        d="M63 218 C53 208 53 183 73 170 L158 153 C183 146 203 136 213 116 C220 101 233 88 258 86 L308 84 C336 82 346 96 343 114 L340 128 L388 126 C418 125 443 138 448 163 L452 178 C455 196 447 208 430 213 L78 220 Z"
        fill="#e8e8e8"
      />

      {/* Upper surface gradient overlay */}
      <path
        d="M63 218 C53 208 53 183 73 170 L130 158 C148 153 158 155 153 165 L125 178 C98 190 76 203 68 217 Z"
        fill="rgba(255,255,255,0.4)"
      />

      {/* Tongue */}
      <path
        d="M213 116 C220 101 233 88 258 86 L293 85 L298 88 L293 118 L248 120 Z"
        fill="#d4d4d4"
      />

      {/* Ankle collar */}
      <path
        d="M298 88 L308 84 C336 82 346 96 343 114 L340 128 L308 130 L303 118 L298 88 Z"
        fill="#c8c8c8"
      />

      {/* Lace eyelets */}
      <g fill="#888">
        <circle cx="227" cy="106" r="3" />
        <circle cx="240" cy="100" r="3" />
        <circle cx="253" cy="95" r="3" />
        <circle cx="266" cy="91" r="3" />
        <circle cx="279" cy="88" r="3" />

        <circle cx="234" cy="118" r="3" />
        <circle cx="247" cy="113" r="3" />
        <circle cx="260" cy="108" r="3" />
        <circle cx="273" cy="104" r="3" />
        <circle cx="286" cy="100" r="3" />
      </g>

      {/* Laces */}
      <g stroke="#999" strokeWidth="2" strokeLinecap="round" fill="none">
        <line x1="227" y1="106" x2="234" y2="118" />
        <line x1="240" y1="100" x2="247" y2="113" />
        <line x1="253" y1="95"  x2="260" y2="108" />
        <line x1="266" y1="91"  x2="273" y2="104" />
        <line x1="279" y1="88"  x2="286" y2="100" />
        <path d="M227 106 Q253 102 279 88" />
        <path d="M234 118 Q260 114 286 100" />
      </g>

      {/* Side stripe – clean black */}
      <path
        d="M158 163 C218 156 298 148 368 148 L388 158 C328 160 248 166 173 176 Z"
        fill="#0a0a0a"
      />

      {/* Brand text */}
      <text x="372" y="178" fontFamily="Arial" fontWeight="900" fontSize="9"
        fill="#0a0a0a" letterSpacing="2" opacity="0.6">STRYDE</text>

      {/* Toe highlight */}
      <path
        d="M63 218 C53 208 53 183 73 170 L98 164 L113 168 C93 180 73 196 66 218 Z"
        fill="rgba(255,255,255,0.15)"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white flex items-center pt-16 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#e5e5e5 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.4 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            {/* Label */}
            <p className="animate-slide-left text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-6">
              Summer Collection — 2026
            </p>

            {/* Headline */}
            <h1 className="mb-6">
              <span className="animate-fade-up delay-100 block text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tight text-zinc-900">
                Step Into
              </span>
              <span className="animate-fade-up delay-200 block text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tight text-zinc-900">
                Your World.
              </span>
            </h1>

            {/* Divider line that animates in */}
            <div className="animate-fade-up delay-300 w-12 h-px bg-zinc-900 mb-6" />

            <p className="animate-fade-up delay-300 text-zinc-500 text-lg leading-relaxed max-w-sm mb-10">
              Premium footwear engineered for every stride. Where performance meets refined design.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-3 mb-14">
              <Link href="#new-arrivals"
                className="btn-dark group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold">
                Shop Now
                <svg className="w-4 h-4 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="#categories"
                className="btn-outline group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold">
                Browse Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-up delay-500 flex items-center gap-10 pt-8 border-t border-zinc-100">
              {[["50K+", "Happy Customers"], ["200+", "Unique Styles"], ["4.9", "Avg. Rating"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-zinc-900">{v}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: shoe */}
          <div className="relative flex items-center justify-center animate-fade-in delay-300">
            {/* Soft background circle */}
            <div className="absolute w-[420px] h-[420px] rounded-full bg-zinc-50 border border-zinc-100" />

            <div className="relative w-full max-w-[520px] animate-float">
              <ShoeIllustration />
            </div>

            {/* Floating card 1 */}
            <div className="animate-fade-up delay-500 absolute top-6 right-4 sm:right-0 bg-white rounded-2xl shadow-lg shadow-zinc-200/80 border border-zinc-100 px-4 py-3">
              <div className="text-[10px] text-zinc-400 font-medium mb-0.5">Best Seller</div>
              <div className="text-sm font-bold text-zinc-900">Air Vortex Pro</div>
              <div className="text-zinc-900 font-black text-base mt-0.5">$189.99</div>
            </div>

            {/* Floating card 2 */}
            <div className="animate-fade-up delay-600 absolute bottom-6 left-4 sm:left-0 bg-zinc-900 rounded-2xl shadow-lg px-4 py-3">
              <div className="text-[10px] text-zinc-400 font-medium mb-0.5">Offer</div>
              <div className="text-white text-sm font-bold">Free Shipping</div>
              <div className="text-zinc-400 text-[11px]">Orders over $150</div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-600">
        <div className="w-px h-10 bg-gradient-to-b from-zinc-300 to-transparent" />
        <span className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase">Scroll</span>
      </div>
    </section>
  );
}
