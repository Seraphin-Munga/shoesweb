import Link from "next/link";

const FEATURES = [
  { title: "Keyboard Navigation",       body: "All interactive elements are reachable and usable via keyboard alone. Focus indicators are visible throughout." },
  { title: "Screen Reader Support",     body: "We use semantic HTML, ARIA labels, and descriptive alt text on images to support assistive technologies." },
  { title: "Colour Contrast",           body: "Text and interactive elements meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)." },
  { title: "Resizable Text",            body: "Content reflows correctly when text is scaled up to 200% without loss of functionality." },
  { title: "Motion Sensitivity",        body: "We respect the prefers-reduced-motion system setting to minimise animations for users who need it." },
  { title: "Form Labels",               body: "All form inputs have associated visible labels. Error messages are descriptive and linked to the relevant field." },
];

export default function AccessibilityPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-black text-zinc-900 mb-2">Accessibility Statement</h1>
        <p className="text-sm text-zinc-400 mb-8">Last updated: 1 June 2026</p>

        <p className="text-zinc-500 leading-relaxed mb-8">
          STRYDE is committed to ensuring our website is accessible to everyone, regardless
          of ability or technology. We strive to meet the Web Content Accessibility Guidelines
          (WCAG) 2.1 Level AA standard.
        </p>

        <h2 className="text-sm font-black text-zinc-900 mb-5">Accessibility Features</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {FEATURES.map(({ title, body }) => (
            <div key={title} className="border border-zinc-100 rounded-2xl p-5">
              <h3 className="font-black text-zinc-900 text-sm mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-black text-zinc-900 mb-3">Known Limitations</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8">
          While we work hard to meet accessibility standards, some areas of our website may not
          yet be fully accessible. We are actively working to identify and resolve these issues.
          Current known limitations include:
        </p>
        <ul className="text-sm text-zinc-500 space-y-2 mb-10 ml-4">
          <li className="flex items-start gap-2"><span className="text-zinc-300 flex-shrink-0 mt-1">•</span> Some older product images may be missing detailed alt text, we are updating these progressively.</li>
          <li className="flex items-start gap-2"><span className="text-zinc-300 flex-shrink-0 mt-1">•</span> The size selector on product pages may not announce changes clearly in all screen readers.</li>
        </ul>

        <h2 className="text-sm font-black text-zinc-900 mb-3">Feedback & Contact</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-4">
          If you experience any accessibility barriers on our website or have suggestions for
          improvement, please let us know. We take all feedback seriously and aim to respond
          within 2 business days.
        </p>
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-zinc-700 mb-1">Accessibility Team</p>
          <a href="mailto:info@fenwalk.com" className="text-sm text-zinc-900 font-bold hover:underline">
            info@fenwalk.com
          </a>
          <p className="text-xs text-zinc-400 mt-1">Response within 2 business days</p>
        </div>

        <h2 className="text-sm font-black text-zinc-900 mb-3">Technical Specification</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-4">
          This website is built with Next.js and relies on technologies including HTML, CSS,
          WAI-ARIA, and JavaScript. We test with the following assistive technologies:
        </p>
        <ul className="text-sm text-zinc-500 space-y-1.5 mb-10 ml-4">
          <li className="flex items-center gap-2"><span className="text-zinc-300">•</span> NVDA + Chrome (Windows)</li>
          <li className="flex items-center gap-2"><span className="text-zinc-300">•</span> VoiceOver + Safari (macOS and iOS)</li>
          <li className="flex items-center gap-2"><span className="text-zinc-300">•</span> TalkBack + Chrome (Android)</li>
        </ul>

        <p className="text-sm text-zinc-400">
          For more information about our data practices, see our{" "}
          <Link href="/privacy" className="text-zinc-900 font-semibold hover:underline">Privacy Policy</Link>
          {" "}and{" "}
          <Link href="/terms" className="text-zinc-900 font-semibold hover:underline">Terms of Service</Link>.
        </p>
      </div>
    </main>
  );
}
