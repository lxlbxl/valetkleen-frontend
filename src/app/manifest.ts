import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ValetKleen",
    short_name: "ValetKleen",
    description: "Laundry and dry-cleaning pickup and delivery in Metro Atlanta.",
    start_url: "/orders",
    scope: "/",
    display: "standalone",
    background_color: "#0a2336",
    theme_color: "#0a2336",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book a pickup", url: "/book" },
      { name: "My orders", url: "/orders" },
      { name: "Ops console", url: "/ops" },
    ],
  };
}
