import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shoe Size Guide — SA, EU, UK & US Sizes",
  description:
    "Find your perfect shoe size with the Fenwalk size guide. Convert between South African, EU, UK and US sizes for men, women and kids. Shop the right fit every time.",
  keywords: [
    "shoe size guide South Africa",
    "shoe size conversion",
    "SA shoe sizes",
    "EU UK US shoe sizes",
    "what size shoe South Africa",
    "kids shoe size chart",
    "womens shoe size chart",
    "mens shoe size chart",
  ],
  alternates: { canonical: "https://www.fenwalk.com/size-guide" },
  openGraph: {
    url: "https://www.fenwalk.com/size-guide",
    title: "Shoe Size Guide — SA, EU, UK & US Sizes | Fenwalk",
    description: "Convert shoe sizes: SA, EU, UK, US for men, women and kids. Get the right fit every time.",
  },
};

const MEN_SIZES = [
  { za: "6",  eu: "39", uk: "5.5", us: "6.5",  cm: "24.5" },
  { za: "7",  eu: "40", uk: "6.5", us: "7.5",  cm: "25.4" },
  { za: "8",  eu: "41", uk: "7",   us: "8",    cm: "26.0" },
  { za: "9",  eu: "42", uk: "8",   us: "9",    cm: "26.7" },
  { za: "10", eu: "43", uk: "9",   us: "10",   cm: "27.3" },
  { za: "11", eu: "44", uk: "10",  us: "11",   cm: "28.0" },
  { za: "12", eu: "45", uk: "11",  us: "12",   cm: "28.9" },
  { za: "13", eu: "46", uk: "12",  us: "13",   cm: "29.5" },
];

const WOMEN_SIZES = [
  { za: "3",  eu: "35", uk: "2.5", us: "5",    cm: "22.0" },
  { za: "4",  eu: "36", uk: "3.5", us: "6",    cm: "22.9" },
  { za: "5",  eu: "37", uk: "4",   us: "7",    cm: "23.5" },
  { za: "6",  eu: "38", uk: "5",   us: "8",    cm: "24.1" },
  { za: "7",  eu: "39", uk: "5.5", us: "8.5",  cm: "24.8" },
  { za: "8",  eu: "40", uk: "6.5", us: "9.5",  cm: "25.4" },
  { za: "9",  eu: "41", uk: "7.5", us: "10.5", cm: "26.0" },
];

const KIDS_SIZES = [
  { za: "1",  eu: "32", uk: "13",  us: "1",    cm: "19.7" },
  { za: "2",  eu: "33", uk: "1",   us: "2",    cm: "20.6" },
  { za: "3",  eu: "34", uk: "2",   us: "3",    cm: "21.3" },
  { za: "4",  eu: "35", uk: "3",   us: "4",    cm: "22.0" },
  { za: "5",  eu: "36", uk: "4",   us: "5",    cm: "22.9" },
];

function SizeTable({ rows }: { rows: typeof MEN_SIZES }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100">
            {["SA", "EU", "UK", "US", "CM"].map((h) => (
              <th key={h} className="text-left py-3 pr-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {rows.map((r) => (
            <tr key={r.za} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3 pr-6 font-bold text-zinc-900">{r.za}</td>
              <td className="py-3 pr-6 text-zinc-600">{r.eu}</td>
              <td className="py-3 pr-6 text-zinc-600">{r.uk}</td>
              <td className="py-3 pr-6 text-zinc-600">{r.us}</td>
              <td className="py-3 pr-6 text-zinc-600">{r.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <main className="pt-16 bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">Size Guide</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-5">
            Find your<br />
            <span className="text-zinc-400">perfect fit.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            Use our size charts to find the right size in SA, EU, UK, and US sizing, plus foot length in centimetres.
          </p>
        </div>
      </section>

      {/* How to measure */}
      <section className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-zinc-900 mb-6">How to measure your foot</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { step: "1", text: "Stand on a piece of paper and trace around your foot with a pen held vertically." },
              { step: "2", text: "Measure the longest distance from heel to the tip of your longest toe in centimetres." },
              { step: "3", text: "Match the measurement to the CM column in the relevant chart below." },
            ].map(({ step, text }) => (
              <div key={step} className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-black flex items-center justify-center mb-3">{step}</div>
                <p className="text-sm text-zinc-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Tip: Measure both feet and use the larger measurement. Feet are often slightly different sizes.
          </p>
        </div>
      </section>

      {/* Tables */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-14">

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-1">Men&apos;s Sizes</h2>
            <p className="text-sm text-zinc-400 mb-5">All men&apos;s running, casual, and trail styles.</p>
            <div className="border border-zinc-100 rounded-2xl p-6">
              <SizeTable rows={MEN_SIZES} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-1">Women&apos;s Sizes</h2>
            <p className="text-sm text-zinc-400 mb-5">All women&apos;s styles including sandals.</p>
            <div className="border border-zinc-100 rounded-2xl p-6">
              <SizeTable rows={WOMEN_SIZES} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-1">Kids&apos; Sizes</h2>
            <p className="text-sm text-zinc-400 mb-5">Youth sizes, suitable for ages 5–12 approximately.</p>
            <div className="border border-zinc-100 rounded-2xl p-6">
              <SizeTable rows={KIDS_SIZES} />
            </div>
          </div>
        </div>
      </section>

      {/* Width note */}
      <section className="py-12 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-black text-zinc-900 mb-2">Width Fitting</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            STRYDE shoes are designed to a standard (D) width for men and (B) width for women.
            If you have wide feet we recommend sizing up half a size, or contact our team for advice on specific models.
            Wide-fit options are indicated on product pages where available.
          </p>
        </div>
      </section>
    </main>
  );
}
