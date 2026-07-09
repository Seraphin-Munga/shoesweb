import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedCategories from "./components/FeaturedCategories";
import ProductGrid from "./components/ProductGrid";
import Features from "./components/Features";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Buy Shoes Online South Africa | Nike, Adidas, New Balance & More",
  description:
    "Fenwalk is South Africa's favourite online shoe store. Shop Nike, Adidas, New Balance, Puma, Vans, Reebok & more. Free shipping over R3 000. Fast delivery to Cape Town, Johannesburg, Durban & nationwide.",
  keywords: [
    // ── High-intent buyer phrases ────────────────────────────
    "buy shoes online South Africa",
    "order shoes online South Africa",
    "shoes for sale South Africa",
    "sneakers for sale South Africa",
    "cheap shoes online South Africa",
    "affordable sneakers South Africa",
    "discount shoes South Africa",
    "shoes on sale South Africa",
    "best price sneakers South Africa",
    "free delivery shoes South Africa",
    "online shoe store South Africa",
    "best online shoe store South Africa",

    // ── Nike buyer-intent combos ─────────────────────────────
    "Nike shoes for men South Africa",
    "Nike shoes for women South Africa",
    "Nike for men sale",
    "Nike for women sale",
    "cheap Nike shoes South Africa",
    "buy Nike online South Africa",
    "Nike Air Max men South Africa",
    "Nike Air Force 1 women South Africa",
    "Nike running shoes South Africa",
    "Nike sale South Africa",
    "Nike sneakers men",
    "Nike sneakers women",

    // ── Adidas buyer-intent combos ───────────────────────────
    "Adidas shoes for men South Africa",
    "Adidas shoes for women South Africa",
    "Adidas sneakers for men sale",
    "Adidas sneakers for women sale",
    "cheap Adidas shoes South Africa",
    "Adidas sale South Africa",
    "buy Adidas online South Africa",
    "Adidas Ultraboost men South Africa",
    "Adidas running shoes South Africa",

    // ── Other brands ─────────────────────────────────────────
    "New Balance for men South Africa",
    "New Balance for women South Africa",
    "New Balance 550 sale South Africa",
    "Puma shoes men South Africa",
    "Puma shoes women South Africa",
    "Jordan shoes for men South Africa",
    "Jordan shoes for women South Africa",
    "Air Jordan South Africa",
    "Vans shoes South Africa",
    "Converse shoes South Africa",
    "Reebok shoes South Africa",

    // ── Category + gender ────────────────────────────────────
    "men's running shoes South Africa",
    "women's running shoes South Africa",
    "men's sneakers South Africa",
    "women's sneakers South Africa",
    "men's basketball shoes South Africa",
    "women's casual shoes South Africa",
    "men's training shoes South Africa",
    "kids shoes South Africa",
    "sneakers sale South Africa",
    "running shoes sale South Africa",
    "cheap sneakers South Africa",

    // ── Natural language / question queries ──────────────────
    "best sneakers to buy in South Africa",
    "where to buy Nike shoes South Africa",
    "where to buy Adidas shoes South Africa",
    "top shoe brands South Africa",
    "most popular sneakers South Africa",
    "best running shoes for men South Africa",
    "best sneakers for women South Africa",
    "most comfortable shoes South Africa",

    // ── Location ─────────────────────────────────────────────
    "shoes online Cape Town",
    "shoes online Johannesburg",
    "shoes online Durban",
    "shoes online Pretoria",

    "Fenwalk",
    "Fenwalk shoes",
  ],
  alternates: { canonical: "https://www.fenwalk.com" },
  openGraph: {
    url: "https://www.fenwalk.com",
    title: "Buy Shoes Online South Africa | Nike, Adidas, New Balance & More",
    description:
      "Shop the best shoe brands online. Free shipping on orders over R3 000. Fast delivery across South Africa.",
  },
};

// Never cache this route, all content (hero, products) comes from the live API
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedCategories />
        <ProductGrid />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
