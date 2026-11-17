import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Manrope } from "next/font/google";
import { Motion } from "@/components/motion";
import "./globals.css";
import "@/styles/app.css";
import "@/styles/home.css";
import "@/styles/extras.css";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://app.valetkleen.com"),
  title: { default: "ValetKleen · Laundry pickup and delivery in Metro Atlanta", template: "%s · ValetKleen" },
  description: "A personal laundry and dry-cleaning pickup and delivery service across Metro Atlanta. Charged after weigh-in, returned in 24–48 hours.",
  applicationName: "ValetKleen",
  appleWebApp: { capable: true, title: "ValetKleen", statusBarStyle: "black-translucent" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  openGraph: { type: "website", siteName: "ValetKleen", images: ["/img/studio-front.webp"] },
};

export const viewport: Viewport = {
  themeColor: "#0a2336",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Motion />
      </body>
    </html>
  );
}
