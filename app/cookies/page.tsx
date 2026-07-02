"use client";

import Link from "next/link";

const COOKIE_TYPES = [
  {
    name: "Strictly Necessary",
    required: true,
    desc: "These cookies are essential for the website to function. They enable core features like your shopping cart, account login, and checkout. You cannot opt out of these.",
    examples: ["Session authentication", "Shopping cart contents", "Security tokens"],
  },
  {
    name: "Functional",
    required: false,
    desc: "These cookies remember your preferences to provide a more personalised experience — such as your currency, language, and recently viewed products.",
    examples: ["Currency preference", "Recently viewed", "Wish list state"],
  },
  {
    name: "Analytics",
    required: false,
    desc: "These cookies help us understand how visitors interact with our website so we can improve performance, content, and user experience. Data is aggregated and anonymous.",
    examples: ["Pages visited", "Time on site", "Error tracking"],
  },
  {
    name: "Marketing",
    required: false,
    desc: "These cookies are used to deliver relevant advertisements and track the effectiveness of our campaigns across partner platforms.",
    examples: ["Ad targeting", "Campaign attribution", "Retargeting pixels"],
  },
];

export default function CookiesPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-black text-zinc-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-zinc-400 mb-8">Last updated: 1 June 2026</p>

        <p className="text-zinc-500 leading-relaxed mb-10">
          STRYDE uses cookies and similar tracking technologies to improve your experience
          on our website. This policy explains what cookies are, which ones we use,
          and how you can control them.
        </p>

        <h2 className="text-sm font-black text-zinc-900 mb-3">What are cookies?</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-10">
          Cookies are small text files placed on your device when you visit a website.
          They help the site remember information about your visit — like items in your cart —
          and can make your next visit easier and the site more useful to you.
        </p>

        <h2 className="text-sm font-black text-zinc-900 mb-5">Cookies we use</h2>
        <div className="space-y-4 mb-10">
          {COOKIE_TYPES.map(({ name, required, desc, examples }) => (
            <div key={name} className="border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-zinc-900 text-sm">{name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  required
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}>
                  {required ? "Always On" : "Optional"}
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-3">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <span key={ex} className="text-[11px] text-zinc-400 border border-zinc-100 rounded-lg px-2.5 py-1">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-black text-zinc-900 mb-3">How to manage cookies</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-4">
          You can manage your cookie preferences at any time through our cookie consent
          banner (accessible via the &ldquo;Cookies&rdquo; link in the footer) or by adjusting
          your browser settings. Note that disabling certain cookies may affect website functionality.
        </p>
        <p className="text-sm text-zinc-500 leading-relaxed mb-10">
          Most browsers allow you to view, delete, and block cookies. Refer to your
          browser&apos;s help documentation for instructions.
        </p>

        <h2 className="text-sm font-black text-zinc-900 mb-3">Third-party cookies</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-10">
          Some cookies are placed by third-party services we use, including Stripe (payments),
          Google Analytics (analytics), and Meta Pixel (marketing). These are subject to the
          respective third-party privacy policies.
        </p>

        <h2 className="text-sm font-black text-zinc-900 mb-3">Contact</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Questions about our use of cookies? Contact us at{" "}
          <a href="mailto:privacy@stryde.com" className="text-zinc-900 font-semibold hover:underline">
            privacy@stryde.com
          </a>{" "}
          or visit our{" "}
          <Link href="/privacy" className="text-zinc-900 font-semibold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
