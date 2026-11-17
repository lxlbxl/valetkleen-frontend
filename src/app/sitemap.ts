import type { MetadataRoute } from "next";

const BASE = "https://app.valetkleen.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/prices", "/plans", "/help", "/terms", "/privacy", "/sign-in", "/sign-up"].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: p ? 0.6 : 1 }));
}
