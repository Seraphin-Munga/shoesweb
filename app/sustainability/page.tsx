const PILLARS = [
  {
    icon: "🌱",
    title: "Sustainable Materials",
    body: "By 2027, 75% of our materials will come from recycled or responsibly sourced inputs — including ocean plastics, reclaimed rubber, and organic cotton.",
    stat: "40%",
    statLabel: "Recycled content today",
  },
  {
    icon: "📦",
    title: "Responsible Packaging",
    body: "All STRYDE packaging is 100% recyclable. We eliminated single-use plastic from our supply chain in 2023 and use water-based inks throughout.",
    stat: "0",
    statLabel: "Single-use plastics",
  },
  {
    icon: "🌍",
    title: "Carbon Reduction",
    body: "We've reduced per-pair carbon emissions by 30% since 2021 through renewable energy in production, optimised logistics, and local manufacturing partnerships.",
    stat: "–30%",
    statLabel: "Emissions per pair since 2021",
  },
  {
    icon: "🤝",
    title: "Fair Labour",
    body: "Every factory in our supply chain is independently audited for fair wages, safe conditions, and workers' rights. No exceptions.",
    stat: "100%",
    statLabel: "Audited supply chain",
  },
];

const COMMITMENTS = [
  "Carbon neutral by 2030",
  "100% recycled materials by 2028",
  "Zero waste to landfill from production by 2027",
  "Living wage guaranteed across entire supply chain",
  "Shoe take-back & recycling programme in all stores by 2026",
];

export default function SustainabilityPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Sustainability</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Better shoes.<br />
            <span className="text-zinc-400">Better planet.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            Sustainability isn't a marketing add-on for us — it's built into every decision
            from material sourcing to the box your shoes arrive in.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Our Approach</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-12">Four pillars of responsible footwear</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PILLARS.map(({ icon, title, body, stat, statLabel }) => (
              <div key={title} className="border border-zinc-100 rounded-2xl p-7">
                <span className="text-3xl mb-4 block">{icon}</span>
                <h3 className="font-black text-zinc-900 mb-3">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{body}</p>
                <div className="border-t border-zinc-100 pt-4">
                  <p className="text-2xl font-black text-zinc-900">{stat}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{statLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Our Pledges</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-10">Public commitments</h2>
          <div className="space-y-3">
            {COMMITMENTS.map((c) => (
              <div key={c} className="flex items-start gap-4 border border-zinc-100 rounded-xl px-5 py-4">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-700">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-zinc-900 mb-3">Transparency matters</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xl mx-auto">
            We publish an annual sustainability report with independently verified data.
            No greenwashing — just honest progress.
          </p>
          <a href="#"
            className="inline-block border border-zinc-200 text-zinc-700 font-bold text-sm px-8 py-3.5 rounded-full hover:border-zinc-400 transition-colors">
            Download 2025 Sustainability Report
          </a>
        </div>
      </section>
    </main>
  );
}
