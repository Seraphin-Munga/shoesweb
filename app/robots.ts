import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "https://starfish-app-hty75.ondigitalocean.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/account",
          "/orders",
          "/cart",
          "/checkout",
          "/favorites",
          "/api",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
