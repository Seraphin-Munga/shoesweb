const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly to us when you create an account, place an order, subscribe to our newsletter, or contact us. This includes:

• Name, email address, phone number, and delivery address
• Payment information (processed securely via Stripe — we never store full card details)
• Order history and preferences
• Communications you send us

We also collect certain information automatically when you use our website, including IP address, browser type, pages visited, and time spent on pages through cookies and similar technologies.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to:

• Process and fulfil your orders and send order confirmations
• Communicate with you about your orders, returns, and account
• Send marketing emails if you have opted in (you can unsubscribe at any time)
• Improve our products, website, and customer experience
• Detect and prevent fraud and security incidents
• Comply with legal obligations`,
  },
  {
    title: "3. Sharing Your Information",
    body: `We do not sell your personal information. We share your data only with:

• Service providers who help us operate our business (courier companies, payment processors, email platforms) — under strict confidentiality agreements
• Law enforcement or regulatory bodies when legally required
• Business successors in the event of a merger, acquisition, or sale of assets

All third-party providers are required to handle your data in accordance with this policy and applicable data protection law.`,
  },
  {
    title: "4. Data Retention",
    body: "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Typically, account data is retained for 7 years following your last transaction in line with South African tax law requirements. You may request deletion of your account and associated data at any time.",
  },
  {
    title: "5. Your Rights",
    body: `Under POPIA (Protection of Personal Information Act) and applicable law, you have the right to:

• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your information
• Object to or restrict certain processing
• Withdraw consent where processing is consent-based
• Lodge a complaint with the Information Regulator of South Africa

To exercise any of these rights, email privacy@stryde.com.`,
  },
  {
    title: "6. Cookies",
    body: "We use cookies and similar tracking technologies to enhance your experience. See our Cookie Policy for detailed information on the types of cookies we use and how to manage them.",
  },
  {
    title: "7. Security",
    body: "We implement industry-standard security measures including TLS encryption, secure data storage, and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security, but we take all reasonable steps to protect your information.",
  },
  {
    title: "8. Children's Privacy",
    body: "Our services are not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child, please contact us immediately.",
  },
  {
    title: "9. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our website. Your continued use of our services after changes take effect constitutes your acceptance of the revised policy.",
  },
  {
    title: "10. Contact Us",
    body: "For questions, requests, or complaints about your personal information or this policy, contact our Information Officer at: privacy@stryde.com | STRYDE (Pty) Ltd, Cape Town, South Africa.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-black text-zinc-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: 1 June 2026</p>

        <p className="text-zinc-500 leading-relaxed mb-10">
          STRYDE (Pty) Ltd (&ldquo;STRYDE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy.
          This policy explains how we collect, use, share, and protect your personal information
          when you use our website and services.
        </p>

        <div className="space-y-8">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-sm font-black text-zinc-900 mb-3">{title}</h2>
              <div className="text-sm text-zinc-500 leading-relaxed whitespace-pre-line">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
