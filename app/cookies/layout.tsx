import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Fenwalk cookie policy. Learn how we use cookies to improve your shopping experience on our online shoe store.",
  alternates: { canonical: "https://www.fenwalk.com/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
