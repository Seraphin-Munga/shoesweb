const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using the STRYDE website and purchasing our products, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 18 years old to create an account and make purchases. By using our services, you confirm that you are 18 or older and have the legal capacity to enter into a binding contract.",
  },
  {
    title: "3. Account Registration",
    body: "You may browse our website without registering, but you'll need an account to complete purchases. You are responsible for keeping your login credentials confidential and for all activity under your account. Notify us immediately of any unauthorised use at info@fenwalk.com.",
  },
  {
    title: "4. Products & Pricing",
    body: `All prices are displayed in South African Rand (ZAR) and include VAT unless otherwise stated. We reserve the right to change prices at any time. In the event of a pricing error, we will notify you and give you the option to proceed at the correct price or cancel your order.

Product images are for illustrative purposes. Colours may vary slightly due to screen settings. We do our best to ensure accurate product descriptions but do not guarantee they are error-free.`,
  },
  {
    title: "5. Orders & Payment",
    body: `An order confirmation email does not constitute acceptance of your order. We reserve the right to cancel any order for reasons including stock unavailability, payment failure, or suspected fraud. A contract is formed when we dispatch your order.

Payment is processed via Stripe. By placing an order you authorise us to charge the payment method you provide. All transactions are encrypted and PCI-compliant.`,
  },
  {
    title: "6. Delivery",
    body: "We aim to deliver within the timeframes shown at checkout. Delivery times are estimates and not guaranteed. We are not liable for delays caused by couriers, customs, or circumstances beyond our control. Risk of loss and title pass to you upon delivery.",
  },
  {
    title: "7. Returns & Refunds",
    body: "Refer to our Returns Policy for full details on eligibility, the return process, and refund timelines. Statutory consumer rights under the Consumer Protection Act 68 of 2008 apply and are not affected by these Terms.",
  },
  {
    title: "8. Intellectual Property",
    body: "All content on this website — including text, images, logos, design, and software — is owned by or licensed to STRYDE and protected by copyright, trademark, and other laws. You may not reproduce, distribute, or create derivative works without our written permission.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, STRYDE's total liability for any claim arising from these Terms or your use of our services is limited to the amount you paid for the relevant order. We are not liable for indirect, incidental, or consequential damages.",
  },
  {
    title: "10. Governing Law",
    body: "These Terms are governed by the laws of the Republic of South Africa. Any disputes will be subject to the exclusive jurisdiction of the courts of Cape Town, South Africa.",
  },
  {
    title: "11. Changes to Terms",
    body: "We may update these Terms from time to time. We will notify you of material changes by email or website notice. Continued use of our services after the effective date constitutes acceptance of the revised Terms.",
  },
  {
    title: "12. Contact",
    body: "Questions about these Terms? Contact us at info@fenwalk.com or write to STRYDE (Pty) Ltd, Cape Town, South Africa.",
  },
];

export default function TermsPage() {
  return (
    <main className="pt-16 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-black text-zinc-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: 1 June 2026</p>

        <p className="text-zinc-500 leading-relaxed mb-10">
          Please read these Terms of Service carefully before using the STRYDE website
          or purchasing any products. These Terms constitute a legally binding agreement
          between you and STRYDE (Pty) Ltd.
        </p>

        <div className="space-y-8">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-sm font-black text-zinc-900 mb-3">{title}</h2>
              <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
