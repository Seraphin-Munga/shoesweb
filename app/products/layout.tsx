import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Shoes — Nike, Adidas, Puma, New Balance & More",
  description:
    "Browse hundreds of shoes from the world's best brands. Shop Nike shoes for men and women on sale, Adidas sneakers, New Balance, Puma, Vans, Reebok & more. Free shipping over R3 000. Fast delivery across South Africa.",
  keywords: [
    // ── Shop intent ──────────────────────────────────────────
    "shop shoes South Africa",
    "shoes for sale South Africa",
    "sneakers for sale South Africa",
    "sale shoes South Africa",
    "discount shoes South Africa",
    "cheap shoes South Africa",
    "online shoe shop South Africa",

    // ── Nike + gender + intent ───────────────────────────────
    "Nike shoes for men South Africa",
    "Nike shoes for women South Africa",
    "Nike for men sale",
    "Nike for women sale",
    "buy Nike shoes online South Africa",
    "Nike sneakers men",
    "Nike sneakers women",
    "Nike running shoes South Africa",
    "Nike Air Max sale South Africa",
    "Nike Air Force 1 sale South Africa",

    // ── Adidas + gender + intent ─────────────────────────────
    "Adidas shoes for men South Africa",
    "Adidas shoes for women South Africa",
    "Adidas sneakers for men sale",
    "Adidas sneakers for women sale",
    "buy Adidas shoes online South Africa",
    "Adidas running shoes South Africa",
    "Adidas sale South Africa",

    // ── Other brands ─────────────────────────────────────────
    "New Balance for men South Africa",
    "New Balance for women South Africa",
    "buy New Balance online South Africa",
    "New Balance 550 sale",
    "Puma shoes men South Africa",
    "Puma shoes women South Africa",
    "Jordan shoes for men South Africa",
    "Jordan shoes for women South Africa",
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
    "kids shoes South Africa",
    "running shoes sale South Africa",
    "cheap sneakers South Africa",

    // ── Natural language queries ─────────────────────────────
    "best Nike shoes for men South Africa",
    "best Adidas sneakers for women South Africa",
    "most popular sneakers South Africa",
    "best running shoes South Africa",
    "where to buy Nike shoes South Africa",
    "top shoe brands South Africa",
  ],
  alternates: { canonical: "https://www.fenwalk.com/products" },
  openGraph: {
    url: "https://www.fenwalk.com/products",
    title: "Shop All Shoes — Nike, Adidas, Puma, New Balance & More | Fenwalk",
    description:
      "Shop Nike shoes for men and women on sale, Adidas sneakers, New Balance & more. Free shipping over R3 000. Fast delivery across South Africa.",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
