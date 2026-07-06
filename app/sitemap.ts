import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fenwalk.com").replace(/\/$/, "");
const API  = (process.env.NEXT_PUBLIC_API_URL  ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api").replace(/\/$/, "");

async function getProductIds(): Promise<number[]> {
  try {
    const res = await fetch(`${API}/products?pageSize=200&page=1`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items: { id: number }[] = json?.data?.items ?? [];
    return items.map((p) => p.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now        = new Date().toISOString();
  const productIds = await getProductIds();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/products`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/about`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/help`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/size-guide`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/returns`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cookies`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/accessibility`,lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = productIds.map((id) => ({
    url:             `${BASE}/product/${id}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  return [...staticPages, ...productPages];
}
