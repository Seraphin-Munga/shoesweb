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
    "buy shoes online South Africa",
    "online shoe store South Africa",
    "Nike South Africa",
    "Adidas South Africa",
    "New Balance South Africa",
    "sneakers online South Africa",
    "Fenwalk",
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
