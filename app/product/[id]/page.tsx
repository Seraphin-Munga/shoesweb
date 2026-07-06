import { notFound } from "next/navigation";
import { fetchProduct, fetchRelated } from "../../lib/api";
import ProductDetail from "./ProductDetail";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await fetchProduct(Number(id));
    const title       = `${product.name} — Buy Online South Africa`;
    const description = product.description
      ?? `Buy ${product.name} by ${product.brand} online in South Africa. Authentic, quality-checked, fast delivery. Free shipping on orders over R3 000.`;
    const image       = product.imageUrls?.[0];
    const url         = `https://www.fenwalk.com/product/${id}`;
    return {
      title,
      description,
      keywords: [
        product.name,
        product.brand,
        `${product.brand} South Africa`,
        `buy ${product.brand} online`,
        `${product.name} South Africa`,
        "shoes South Africa",
        "buy shoes online South Africa",
      ],
      alternates: { canonical: url },
      openGraph: {
        url,
        title,
        description,
        type:   "website",
        images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
      },
      twitter: {
        card:        "summary_large_image",
        title,
        description,
        images:      image ? [image] : [],
      },
    };
  } catch {
    return { title: "Shoes | Fenwalk" };
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
