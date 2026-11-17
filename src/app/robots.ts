import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/ops", "/orders", "/account", "/book"] }], sitemap: "https://app.valetkleen.com/sitemap.xml" };
}
