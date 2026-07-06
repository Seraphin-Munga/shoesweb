import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fenwalk.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/orders", "/cart", "/checkout", "/favorites", "/api"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
