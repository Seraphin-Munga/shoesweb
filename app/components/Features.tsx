const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: "Free Shipping",
    desc: "On every order over $150. Worldwide delivery to your door.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Easy Returns",
    desc: "Not the right fit? Return free within 5 days, no questions.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Authentic Guarantee",
    desc: "Every pair verified and quality-checked before it ships to you.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "24/7 Support",
    desc: "Chat, email, or call, our team responds within minutes.",
  },
];


export default function Features() {
  return (
    <>
      {/* Brand strip */}
      <div className="border-y border-zinc-100 bg-white py-5 overflow-hidden">
        <div className="flex items-center gap-16 whitespace-nowrap">
          {["NIKE","ADIDAS","NEW BALANCE","PUMA","REEBOK","VANS","CONVERSE","ASICS","NIKE","ADIDAS","NEW BALANCE","PUMA"].map((b, i) => (
            <span key={i}
              className="text-[11px] font-black tracking-[0.25em] text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer flex-shrink-0">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">Why FENWALK</p>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">The FENWALK Promise</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group bg-zinc-50 border border-zinc-100 hover:border-zinc-200 rounded-2xl p-6 card-lift">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 mb-4 group-hover:border-zinc-400 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-zinc-900 mb-1.5">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
