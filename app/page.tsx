import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedCategories from "./components/FeaturedCategories";
import ProductGrid from "./components/ProductGrid";
import CustomerReviews from "./components/CustomerReviews";
import Features from "./components/Features";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedCategories />
        <ProductGrid />
        <CustomerReviews />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
