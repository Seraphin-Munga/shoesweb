import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — FAQs, Delivery & Support",
  description:
    "Get help with your Fenwalk order. FAQs on delivery times, returns, sizing, payment and account management. Contact our support team 24/7.",
  keywords: [
    "Fenwalk help",
    "shoe store FAQ",
    "delivery South Africa",
    "how long does delivery take South Africa",
    "shoe return help",
    "Fenwalk contact",
    "online shoe store support",
  ],
  alternates: { canonical: "https://www.fenwalk.com/help" },
  openGraph: {
    url: "https://www.fenwalk.com/help",
    title: "Help Center — FAQs, Delivery & Support | Fenwalk",
    description: "Answers to your most common questions about orders, delivery, returns and payments.",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
