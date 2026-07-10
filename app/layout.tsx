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
    // ── Core store & intent ──────────────────────────────────
    "buy shoes online South Africa",
    "shoes for sale South Africa",
    "sneakers for sale South Africa",
    "shoes on sale South Africa",
    "cheap shoes South Africa",
    "affordable shoes South Africa",
    "discount shoes South Africa",
    "best price shoes South Africa",
    "free delivery shoes South Africa",
    "online shoe store South Africa",
    "best online shoe store South Africa",
    "order shoes online South Africa",
    "shoes free shipping South Africa",
    "sneakers online South Africa",
    "footwear South Africa",
    "Fenwalk",
    "Fenwalk shoes",

    // ── Nike + gender + intent ───────────────────────────────
    "Nike shoes for men South Africa",
    "Nike shoes for women South Africa",
    "Nike sneakers for men South Africa",
    "Nike sneakers for women South Africa",
    "Nike for men sale South Africa",
    "Nike for women sale South Africa",
    "cheap Nike shoes for men South Africa",
    "cheap Nike shoes for women South Africa",
    "Nike shoes men sale",
    "Nike shoes women sale",
    "buy Nike shoes online South Africa",
    "Nike Air Max for men South Africa",
    "Nike Air Max for women South Africa",
    "Nike Air Force 1 for men South Africa",
    "Nike Air Force 1 for women South Africa",
    "Nike running shoes for men South Africa",
    "Nike running shoes for women South Africa",
    "latest Nike shoes South Africa",
    "new Nike shoes South Africa",
    "Nike South Africa",
    "Nike shoes South Africa",

    // ── Adidas + gender + intent ─────────────────────────────
    "Adidas shoes for men South Africa",
    "Adidas shoes for women South Africa",
    "Adidas sneakers for men sale South Africa",
    "Adidas sneakers for women sale South Africa",
    "cheap Adidas shoes South Africa",
    "Adidas for men sale",
    "Adidas for women sale",
    "buy Adidas shoes online South Africa",
    "Adidas Ultraboost for men South Africa",
    "Adidas Ultraboost for women South Africa",
    "Adidas Stan Smith South Africa",
    "Adidas running shoes men South Africa",
    "Adidas shoes sale South Africa",
    "Adidas South Africa",
    "Adidas shoes South Africa",

    // ── New Balance + gender ─────────────────────────────────
    "New Balance shoes for men South Africa",
    "New Balance shoes for women South Africa",
    "New Balance 550 for men South Africa",
    "New Balance 574 for women South Africa",
    "New Balance sneakers sale South Africa",
    "cheap New Balance South Africa",
    "New Balance South Africa",

    // ── Puma + gender ────────────────────────────────────────
    "Puma shoes for men South Africa",
    "Puma shoes for women South Africa",
    "Puma sneakers sale South Africa",
    "Puma RS-X South Africa",
    "Puma South Africa",
    "Puma shoes South Africa",

    // ── Vans, Converse, Reebok ───────────────────────────────
    "Vans shoes for men South Africa",
    "Vans shoes for women South Africa",
    "Vans Old Skool South Africa",
    "Vans South Africa",
    "Converse for men South Africa",
    "Converse for women South Africa",
    "Converse Chuck Taylor South Africa",
    "Converse South Africa",
    "Reebok shoes for men South Africa",
    "Reebok shoes for women South Africa",
    "Reebok South Africa",
    "ASICS South Africa",
    "Saucony South Africa",

    // ── Jordan ───────────────────────────────────────────────
    "Jordan shoes for men South Africa",
    "Jordan shoes for women South Africa",
    "Air Jordan South Africa",
    "Jordan shoes sale South Africa",
    "Jordan shoes South Africa",

    // ── Category + gender ────────────────────────────────────
    "men's running shoes South Africa",
    "women's running shoes South Africa",
    "men's sneakers South Africa",
    "women's sneakers South Africa",
    "men's casual shoes South Africa",
    "women's casual shoes South Africa",
    "men's training shoes South Africa",
    "women's training shoes South Africa",
    "men's basketball shoes South Africa",
    "women's gym shoes South Africa",
    "kids shoes South Africa",
    "kids sneakers South Africa",
    "school shoes South Africa",
    "running shoes South Africa",
    "basketball shoes South Africa",
    "gym shoes South Africa",
    "trail running shoes South Africa",
    "lifestyle sneakers South Africa",
    "retro sneakers South Africa",
    "high top sneakers South Africa",
    "slip on shoes South Africa",
    "walking shoes South Africa",
    "sports shoes South Africa",

    // ── Sale + category ──────────────────────────────────────
    "running shoes sale South Africa",
    "sneakers sale South Africa",
    "cheap running shoes South Africa",
    "cheap sneakers South Africa",
    "budget sneakers South Africa",
    "men's sneakers on sale South Africa",
    "women's sneakers on sale South Africa",
    "affordable Nike sneakers South Africa",
    "affordable Adidas sneakers South Africa",

    // ── Location keywords ────────────────────────────────────
    "shoe store Cape Town",
    "shoe store Johannesburg",
    "shoe store Durban",
    "shoe store Pretoria",
    "shoes online Cape Town",
    "shoes online Johannesburg",
    "shoes online Durban",
    "shoes online Pretoria",
    "nationwide shoe delivery South Africa",

    // ── Question / natural language queries ──────────────────
    "where to buy Nike shoes in South Africa",
    "where to buy Adidas shoes in South Africa",
    "best Nike shoes to buy South Africa",
    "best Adidas shoes South Africa",
    "best running shoes South Africa",
    "best sneakers for men South Africa",
    "best sneakers for women South Africa",
    "most comfortable sneakers South Africa",
    "best shoe brands South Africa",
    "top sneaker brands South Africa",
    "premium footwear South Africa",
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
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1SWV1BS270" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1SWV1BS270');
            `,
          }}
        />
        {/* TikTok Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('D98C4RJC77U7PB56NE60');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
