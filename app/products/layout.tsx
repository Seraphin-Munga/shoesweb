import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Shoes — Nike, Adidas, Puma, New Balance & More",
  description:
    "Browse hundreds of shoes from the world's best brands. Filter by brand, category, size and price. Nike, Adidas, New Balance, Puma, Vans, Reebok, Converse & more. Free shipping over R3 000.",
  keywords: [
    "shop shoes South Africa",
    "buy Nike shoes online",
    "buy Adidas shoes online",
    "buy New Balance online",
    "buy Puma shoes online",
    "sneakers for sale South Africa",
    "mens running shoes South Africa",
    "womens sneakers South Africa",
    "kids trainers South Africa",
    "sale shoes South Africa",
    "discount shoes South Africa",
    "online shoe shop South Africa",
  ],
  alternates: { canonical: "https://www.fenwalk.com/products" },
  openGraph: {
    url: "https://www.fenwalk.com/products",
    title: "Shop All Shoes — Nike, Adidas, Puma, New Balance & More | Fenwalk",
    description:
      "Browse hundreds of shoes online. Filter by brand, size and price. Free shipping over R3 000. Fast delivery across South Africa.",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
