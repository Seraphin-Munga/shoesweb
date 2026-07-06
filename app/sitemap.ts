import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "https://starfish-app-hty75.ondigitalocean.app";
const API  = process.env.NEXT_PUBLIC_API_URL  ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api";

async function fetchAllProducts(): Promise<{ id: number; name: string; updatedAt?: string }[]> {
  try {
    const pageSize = 100;
    const first = await fetch(`${API}/products?pageSize=${pageSize}&page=1`, { cache: "no-store" });
    if (!first.ok) return [];
    const json = await first.json();
    const items: { id: number; name: string }[] = json.data?.items ?? [];
    const total: number = json.data?.total ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetch(`${API}/products?pageSize=${pageSize}&page=${i + 2}`, { cache: "no-store" })
          .then((r) => r.json())
          .then((j) => (j.data?.items ?? []) as { id: number; name: string }[])
          .catch(() => [] as { id: number; name: string }[])
      )
    );

    return [...items, ...rest.flat()];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ── Static pages ────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/products`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    // SEO keyword landing pages — common shoe search terms
    { url: `${BASE}/products?search=nike`,       lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/products?search=adidas`,     lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/products?search=puma`,       lastModified: now, changeFrequency: "weekly", priority: 0.8  },
    { url: `${BASE}/products?search=jordan`,     lastModified: now, changeFrequency: "weekly", priority: 0.8  },
    { url: `${BASE}/products?search=new+balance`,lastModified: now, changeFrequency: "weekly", priority: 0.8  },
    { url: `${BASE}/products?search=sneaker`,    lastModified: now, changeFrequency: "weekly", priority: 0.8  },
    { url: `${BASE}/products?search=running`,    lastModified: now, changeFrequency: "weekly", priority: 0.8  },
    { url: `${BASE}/products?search=casual`,     lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/products?search=trail`,      lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    // Category filters
    { url: `${BASE}/products?category=Running`,  lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?category=Casual`,   lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?category=Trail`,    lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // Sale / new arrivals
    { url: `${BASE}/products?sort=newest`,       lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${BASE}/products?sale=true`,         lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    // Info pages
    { url: `${BASE}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/help`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/size-guide`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/returns`,       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/sustainability`,lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/careers`,       lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/press`,         lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cookies`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/accessibility`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Dynamic product pages ────────────────────────────────────────────────────
  const products = await fetchAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url:             `${BASE}/product/${p.id}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.9,
  }));

  return [...staticPages, ...productPages];
}
