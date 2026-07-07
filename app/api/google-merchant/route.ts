import { NextResponse } from "next/server";
import type { ApiProduct } from "../../lib/types";

// Re-generate this feed at most every 6 hours (Next.js ISR)
export const revalidate = 21600;

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fenwalk.com").replace(/\/$/, "");
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api").replace(/\/$/, "");

// Google product category 187 = Apparel & Accessories > Shoes
const CATEGORY = "187";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tag(name: string, value: string | undefined): string {
  if (!value) return "";
  return `      <${name}>${value}</${name}>`;
}

async function fetchAllProducts(): Promise<ApiProduct[]> {
  const all: ApiProduct[] = [];
  let page = 1;

  while (true) {
    try {
      const res = await fetch(`${API_URL}/products?page=${page}&pageSize=200`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) break;
      const json = await res.json();
      const items: ApiProduct[] = json?.data?.items ?? [];
      all.push(...items);
      if (items.length < 200) break;
      page++;
    } catch {
      break;
    }
  }

  return all;
}

function buildItem(p: ApiProduct, colorName?: string): string {
  const id = colorName
    ? `${p.id}-${colorName.replace(/\s+/g, "-")}`
    : String(p.id);

  const title = colorName ? `${p.name} - ${colorName}` : p.name;
  const productUrl = `${SITE}/product/${p.id}`;
  const hasVariants = p.colors.length > 0;
  const hasDiscount = !!p.discountedPrice && p.discountedPrice < p.price;
  const priceStr = `${p.price.toFixed(2)} ZAR`;
  const salePriceStr = hasDiscount ? `${p.discountedPrice!.toFixed(2)} ZAR` : undefined;

  const lines = [
    `    <item>`,
    tag("g:id", esc(id)),
    hasVariants ? tag("g:item_group_id", String(p.id)) : "",
    tag("g:title", esc(title)),
    tag("g:description", esc(p.description ?? p.name)),
    tag("g:link", esc(productUrl)),
    p.imageUrls[0] ? tag("g:image_link", esc(p.imageUrls[0])) : "",
    ...p.imageUrls.slice(1, 10).map((url) => tag("g:additional_image_link", esc(url))),
    tag("g:availability", p.isInStock ? "in stock" : "out of stock"),
    tag("g:condition", "new"),
    tag("g:brand", esc(p.brand)),
    tag("g:price", priceStr),
    hasDiscount ? tag("g:sale_price", salePriceStr) : "",
    tag("g:google_product_category", CATEGORY),
    tag("g:product_type", "Shoes"),
    colorName ? tag("g:color", esc(colorName)) : "",
    tag("g:gender", p.gender === "Women" ? "female" : "male"),
    tag("g:age_group", "adult"),
    ...p.sizes.map((s) => tag("g:size", String(s))),
    `    </item>`,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function GET() {
  const products = await fetchAllProducts();

  const items: string[] = [];

  for (const p of products) {
    if (p.colors.length > 0) {
      for (const color of p.colors) {
        items.push(buildItem(p, color.name));
      }
    } else {
      items.push(buildItem(p));
    }
  }

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
    `  <channel>`,
    `    <title>Fenwalk</title>`,
    `    <link>${SITE}</link>`,
    `    <description>Fenwalk - Premium Footwear</description>`,
    ...items,
    `  </channel>`,
    `</rss>`,
  ].join("\n");

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=21600, stale-while-revalidate=3600",
    },
  });
}
