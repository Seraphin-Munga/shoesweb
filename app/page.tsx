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
    // High-intent buyer keywords
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
    // Online store
    "online shoe store South Africa",
    "best online shoe store South Africa",
    "South Africa shoe shop online",
    // Top brands
    "Nike South Africa",
    "Adidas South Africa",
    "New Balance South Africa",
    "Puma South Africa",
    "Vans South Africa",
    "Reebok South Africa",
    "Converse South Africa",
    "ASICS South Africa",
    "Jordan South Africa",
    "Saucony South Africa",
    // Specific models
    "Nike Air Force 1 South Africa",
    "Nike Air Max South Africa",
    "Adidas Ultraboost South Africa",
    "New Balance 550 South Africa",
    "Air Jordan South Africa",
    // Categories
    "sneakers online South Africa",
    "running shoes online South Africa",
    "gym shoes South Africa",
    "casual sneakers South Africa",
    "lifestyle sneakers South Africa",
    "retro sneakers South Africa",
    // Demographics
    "mens sneakers South Africa",
    "womens sneakers South Africa",
    "kids shoes South Africa",
    // Locations
    "shoes online Cape Town",
    "shoes online Johannesburg",
    "shoes online Durban",
    "shoes online Pretoria",
    // Long-tail
    "best sneakers to buy in South Africa",
    "where to buy sneakers online South Africa",
    "top shoe brands South Africa",
    "most popular sneakers South Africa",
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
