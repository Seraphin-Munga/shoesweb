const MENTIONS = [
  { outlet: "Business Insider SA",  quote: "STRYDE is redefining what affordable premium footwear looks like in Africa.",    year: "2025" },
  { outlet: "Runner's World",       quote: "Exceptional cushioning and build quality at a price point that defies expectation.", year: "2025" },
  { outlet: "Forbes Africa",        quote: "One of the fastest-growing footwear brands on the continent.",                    year: "2024" },
  { outlet: "Mail & Guardian",      quote: "The Cape Town brand quietly building a global footwear empire.",                  year: "2024" },
];

const RELEASES = [
  { date: "12 June 2026",    title: "STRYDE launches Summer 2026 Collection with 100% recycled upper materials" },
  { date: "3 March 2026",    title: "STRYDE opens third flagship store in Durban's Gateway Theatre of Shopping" },
  { date: "18 Nov 2025",     title: "STRYDE announces partnership with South African Athletics Federation" },
  { date: "5 Aug 2025",      title: "STRYDE surpasses 500,000 active customers milestone" },
  { date: "22 Jan 2025",     title: "STRYDE wins Retailer of the Year at 2025 SA eCommerce Awards" },
];

export default function PressPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Press Room</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            STRYDE<br />
            <span className="text-zinc-400">in the news.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            Press enquiries, media assets, and the latest news from STRYDE.
          </p>
        </div>
      </section>

      {/* Mentions */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Coverage</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-10">What they're saying</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {MENTIONS.map(({ outlet, quote, year }) => (
              <div key={outlet} className="border border-zinc-100 rounded-2xl p-7">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-zinc-900">{outlet}</span>
                  <span className="text-xs text-zinc-400">{year}</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press releases */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Press Releases</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-10">Latest announcements</h2>
          <div className="divide-y divide-zinc-50">
            {RELEASES.map(({ date, title }) => (
              <div key={title} className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 group cursor-pointer">
                <span className="text-xs text-zinc-400 font-medium w-32 flex-shrink-0">{date}</span>
                <p className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors flex-1">{title}</p>
                <svg className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Media Kit */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          <div className="bg-white border border-zinc-100 rounded-2xl p-8">
            <h3 className="font-black text-zinc-900 mb-2">Press Contact</h3>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              For media enquiries, interview requests, or product samples, reach our communications team.
            </p>
            <a href="mailto:press@stryde.com"
              className="text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors">
              press@stryde.com →
            </a>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-8 text-white">
            <h3 className="font-black mb-2">Media Kit</h3>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              Download logos, brand guidelines, product images, and executive bios in one package.
            </p>
            <a href="#"
              className="inline-block bg-white text-zinc-900 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-zinc-100 transition-colors">
              Download Media Kit
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
