function ShoeOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M30 118 C26 108 26 88 40 80 L90 70 C110 65 122 56 126 42 C130 30 140 22 158 22 L184 22 C200 22 206 34 203 48 L200 60 L228 60 C252 60 268 74 272 96 L274 110 C276 122 270 130 254 132 L44 134 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 118 L254 132 L258 140 Q262 150 244 152 L50 152 Q34 152 30 142 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M126 42 C130 30 140 22 158 22 L176 22 L178 26 L172 60 L152 62 Z"
        fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="130" y1="50" x2="164" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="132" y1="58" x2="166" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="134" y1="66" x2="168" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

const categories = [
  { id: "men",   label: "Men's",   count: "86 styles",  bg: "bg-zinc-50",   border: "border-zinc-200" },
  { id: "women", label: "Women's", count: "102 styles", bg: "bg-stone-50",  border: "border-stone-200" },
  { id: "kids",  label: "Kids'",   count: "54 styles",  bg: "bg-slate-50",  border: "border-slate-200" },
];

export default function FeaturedCategories() {
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">Shop by Category</p>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Find Your Fit</h2>
          </div>
          <a href="#" className="group hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            View all
            <svg className="w-4 h-4 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`}
              className={`group card-lift relative rounded-3xl overflow-hidden ${cat.bg} border ${cat.border} p-8 flex flex-col cursor-pointer min-h-64`}>

              {/* Shoe illustration */}
              <div className="flex-1 flex items-center justify-center py-6">
                <ShoeOutline className="w-52 text-zinc-300 group-hover:text-zinc-400 transition-colors duration-300 img-zoom" />
              </div>

              {/* Text */}
              <div className="mt-auto">
                <div className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase mb-1">{cat.count}</div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-zinc-900">{cat.label}</h3>
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <svg className="w-4 h-4 text-white arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
