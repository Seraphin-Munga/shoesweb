import Link from "next/link";

const VALUES = [
  { title: "Performance First",    body: "Every shoe is engineered for real-world conditions — whether that's a 5K road or a mountain trail." },
  { title: "Sustainable Design",   body: "We're committed to reducing our footprint through recycled materials and responsible manufacturing." },
  { title: "Inclusive Fit",        body: "Great footwear belongs to everyone. Our size range and width options reflect that belief." },
  { title: "Community Driven",     body: "Our community of runners, walkers, and explorers shapes every product decision we make." },
];

const MILESTONES = [
  { year: "2018", event: "Fenwalk founded in Cape Town with a single running shoe." },
  { year: "2020", event: "Expanded to trail and casual lines. Reached 10,000 customers." },
  { year: "2022", event: "Launched sustainable materials program. 40% recycled content." },
  { year: "2024", event: "Opened flagship stores in Johannesburg, Durban, and Cape Town." },
  { year: "2026", event: "Now serving 500,000+ customers across Southern Africa and beyond." },
];

export default function AboutPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-zinc-600 line-through decoration-zinc-500 decoration-2">we don&apos;t design shoes</span><br />
            We design shoes<br />
            <span className="text-zinc-400">people actually live in.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            From the first prototype sketched in a Cape Town apartment to a brand worn across Southern Africa,
            we&apos;ve never lost sight of what matters: comfort, quality, and honest pricing.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Mission</p>
            <h2 className="text-3xl font-black text-zinc-900 mb-5 leading-tight">
              Shoes people actually live in.
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-4">
              From the first prototype sketched in a Cape Town apartment to a brand worn across Southern Africa,
              we&apos;ve never lost sight of what matters: comfort, quality, and honest pricing.
            </p>
            <p className="text-zinc-500 leading-relaxed">
              Our team of designers, athletes, and material scientists work together to push the boundaries
              of what footwear can be — without the inflated mark-up.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "500K+",  label: "Happy customers" },
              { stat: "12+",    label: "Shoe collections" },
              { stat: "40%",    label: "Recycled materials" },
              { stat: "4.8★",   label: "Average rating" },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-zinc-50 rounded-2xl p-6">
                <p className="text-3xl font-black text-zinc-900 mb-1">{stat}</p>
                <p className="text-xs text-zinc-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3 text-center">What We Stand For</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-12 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ title, body }) => (
              <div key={title} className="border border-zinc-100 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 mb-4" />
                <h3 className="font-black text-zinc-900 mb-2 text-sm">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Timeline</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-12">How We Got Here</h2>
          <div className="space-y-0">
            {MILESTONES.map(({ year, event }, i) => (
              <div key={year} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {year.slice(2)}
                  </div>
                  {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-zinc-100 my-1" />}
                </div>
                <div className="pb-8">
                  <p className="text-xs font-bold text-zinc-400 mb-1">{year}</p>
                  <p className="text-zinc-700 font-medium text-sm">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Ready to find your stride?</h2>
          <p className="text-zinc-400 mb-8">Explore our latest collections and step into something extraordinary.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products"
              className="bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
