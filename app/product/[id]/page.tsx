import { notFound } from "next/navigation";
import { fetchProduct, fetchRelated } from "../../lib/api";
import ProductDetail from "./ProductDetail";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await fetchProduct(Number(id));
    return {
      title: `${product.name} — STRYDE`,
      description: product.description ?? `${product.name} by ${product.brand}`,
    };
  } catch {
    return { title: "Product — STRYDE" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product;
  try {
    product = await fetchProduct(Number(id));
  } catch {
    notFound();
  }

  let related: typeof product[] = [];
  try {
    related = await fetchRelated(Number(id), 4);
  } catch {}

  return (
    <>
      <Navbar />
      <ProductDetail product={product as any} related={related as any[]} />
      <Footer />
    </>
  );
}
