import { notFound } from "next/navigation";
import { fetchProduct, fetchRelated } from "../../lib/api";
import { toZar } from "../../lib/currency";
import ProductDetail from "./ProductDetail";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await fetchProduct(Number(id));
    const title       = `${product.name} — Buy Online South Africa | ${product.brand} Shoes`;
    const description = product.description
      ?? `Buy ${product.name} by ${product.brand} online in South Africa. Available for men and women. Authentic, quality-checked, fast delivery. Free shipping on orders over R3 000. Shop ${product.brand} shoes on sale at Fenwalk.`;
    const image       = product.imageUrls?.[0];
    const url         = `https://www.fenwalk.com/product/${id}`;
    return {
      title,
      description,
      keywords: [
        product.name,
        `${product.name} South Africa`,
        `buy ${product.name} online`,
        `${product.name} for men`,
        `${product.name} for women`,
        `${product.name} sale`,
        product.brand,
        `${product.brand} South Africa`,
        `${product.brand} shoes for men South Africa`,
        `${product.brand} shoes for women South Africa`,
        `${product.brand} for men sale`,
        `${product.brand} for women sale`,
        `buy ${product.brand} online South Africa`,
        `cheap ${product.brand} shoes South Africa`,
        `${product.brand} sneakers South Africa`,
        `${product.brand} sale South Africa`,
        `${(product as any).category ?? "shoes"} for men South Africa`,
        `${(product as any).category ?? "shoes"} for women South Africa`,
        "buy shoes online South Africa",
        "shoes for sale South Africa",
        "sneakers South Africa",
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

  const priceZar      = toZar((product as any).price);
  const discountedZar = (product as any).discountedPrice ? toZar((product as any).discountedPrice) : null;
  const displayPriceZar = discountedZar ?? priceZar;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: (product as any).name,
    description: (product as any).description ?? `Buy ${(product as any).name} by ${(product as any).brand} online in South Africa.`,
    brand: { "@type": "Brand", name: (product as any).brand },
    image: (product as any).imageUrls ?? [],
    url: `https://www.fenwalk.com/product/${id}`,
    sku: String((product as any).id),
    offers: {
      "@type": "Offer",
      priceCurrency: "ZAR",
      price: displayPriceZar.toFixed(2),
      availability: (product as any).isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://www.fenwalk.com/product/${id}`,
      seller: { "@type": "Organization", name: "Fenwalk" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ProductDetail product={product as any} related={related as any[]} />
      <Footer />
    </>
  );
}
