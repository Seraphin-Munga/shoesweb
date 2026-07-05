import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedCategories from "./components/FeaturedCategories";
import ProductGrid from "./components/ProductGrid";
import Features from "./components/Features";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

// Never cache this route — all content (hero, products) comes from the live API
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
