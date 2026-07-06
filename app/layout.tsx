import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE = "https://www.fenwalk.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Fenwalk | Buy Shoes Online South Africa — Nike, Adidas, Puma & More",
    template: "%s | Fenwalk",
  },
  description:
    "Shop the best shoe brands online in South Africa. Nike, Adidas, New Balance, Puma, Reebok, Vans & more. Free shipping on orders over R3 000. Fast delivery to Cape Town, Johannesburg, Durban & nationwide.",
  keywords: [
    "shoes South Africa",
    "buy shoes online South Africa",
    "sneakers South Africa",
    "Nike shoes South Africa",
    "Adidas shoes South Africa",
    "New Balance South Africa",
    "Puma shoes South Africa",
    "Reebok South Africa",
    "Vans South Africa",
    "Converse South Africa",
    "ASICS South Africa",
    "online shoe store South Africa",
    "cheap shoes South Africa",
    "shoe store Cape Town",
    "shoe store Johannesburg",
    "shoe store Durban",
    "mens shoes South Africa",
    "womens shoes South Africa",
    "kids shoes South Africa",
    "running shoes South Africa",
    "basketball shoes South Africa",
    "casual shoes South Africa",
    "training shoes South Africa",
    "premium footwear South Africa",
    "Fenwalk",
    "Fenwalk shoes",
    "free shipping shoes",
    "sneakers online",
    "footwear South Africa",
  ],
  authors: [{ name: "Fenwalk", url: BASE }],
  creator: "Fenwalk",
  publisher: "Fenwalk",
  applicationName: "Fenwalk",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: BASE,
    siteName: "Fenwalk",
    title: "Fenwalk | Buy Shoes Online South Africa",
    description:
      "Shop Nike, Adidas, New Balance, Puma & more. Free shipping on orders over R3 000. Fast delivery across South Africa.",
    images: [{ url: "/shoe-banner.png", width: 1200, height: 630, alt: "Fenwalk — Premium Footwear South Africa" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fenwalkshoes",
    creator: "@fenwalkshoes",
    title: "Fenwalk | Buy Shoes Online South Africa",
    description:
      "Shop Nike, Adidas, New Balance, Puma & more. Free shipping on orders over R3 000. Fast delivery across South Africa.",
    images: ["/shoe-banner.png"],
  },
  alternates: { canonical: BASE },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
