import Link from "next/link";

const OPENINGS = [
  { role: "Senior Product Designer",    dept: "Design",       location: "Cape Town",     type: "Full-time" },
  { role: "Supply Chain Manager",        dept: "Operations",   location: "Johannesburg",  type: "Full-time" },
  { role: "Frontend Engineer (Next.js)", dept: "Engineering",  location: "Remote (SA)",   type: "Full-time" },
  { role: "Brand Marketing Specialist",  dept: "Marketing",    location: "Cape Town",     type: "Full-time" },
  { role: "Retail Store Manager",        dept: "Retail",       location: "Durban",        type: "Full-time" },
  { role: "Customer Experience Lead",    dept: "Support",      location: "Remote (SA)",   type: "Full-time" },
];

const PERKS = [
  { icon: "🎽", title: "Free Shoes",            body: "Two pairs of STRYDE footwear every year, yours to keep." },
  { icon: "🏥", title: "Medical Aid",            body: "Full medical aid contribution for you and your dependants." },
  { icon: "📈", title: "Growth Budget",          body: "R10,000 annual learning & development allowance." },
  { icon: "🏠", title: "Flexible Work",          body: "Hybrid and remote-first roles across all departments." },
  { icon: "🌍", title: "Impact Work",            body: "Work on products that millions of people wear every day." },
  { icon: "⚡", title: "Ownership",              body: "Everyone gets phantom equity from day one." },
];

export default function CareersPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Careers at STRYDE</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Do the best<br />
            <span className="text-zinc-400">work of your life.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            We're building the future of footwear from Southern Africa. Join a team that
            moves fast, thinks big, and cares deeply about craft.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Why STRYDE</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-12">Benefits & Perks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map(({ icon, title, body }) => (
              <div key={title} className="border border-zinc-100 rounded-2xl p-6">
                <span className="text-2xl mb-3 block">{icon}</span>
                <h3 className="font-black text-zinc-900 mb-2 text-sm">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Open Positions</p>
          <h2 className="text-3xl font-black text-zinc-900 mb-10">Join the team</h2>
          <div className="space-y-3">
            {OPENINGS.map(({ role, dept, location, type }) => (
              <div key={role}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-zinc-100 rounded-2xl px-6 py-5 hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer">
                <div>
                  <h3 className="font-black text-zinc-900 text-sm group-hover:text-zinc-600 transition-colors">{role}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{dept} · {location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-500 border border-zinc-200 rounded-full px-3 py-1">{type}</span>
                  <svg className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speculative */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-zinc-900 mb-3">Don't see your role?</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            We're always on the lookout for exceptional people. Send us your CV and tell us
            how you'd contribute to STRYDE.
          </p>
          <a href="mailto:careers@stryde.com"
            className="inline-block bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
            Send Speculative Application
          </a>
        </div>
      </section>
    </main>
  );
}
