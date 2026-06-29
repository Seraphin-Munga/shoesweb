import { notFound } from "next/navigation";
import { getProduct, getRelated } from "../../data/products";
import ProductDetail from "./ProductDetail";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.name} — STRYDE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) notFound();

  const related = getRelated(product.id);

  return (
    <>
      <Navbar />
      <ProductDetail product={product} related={related} />
      <Footer />
    </>
  );
}
