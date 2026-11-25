import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import cfg from "@/config/wedding.json";
import "./globals.css";

// Fonts are bundled with the project (OFL, from @fontsource) so builds never depend on Google Fonts.
const script = localFont({
  src: "./fonts/great-vibes-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});
const pinyon = localFont({
  src: "./fonts/pinyon-script-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-pinyon",
  display: "block",
});
const serif = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "block",
});

// Link previews need absolute image URLs: set NEXT_PUBLIC_SITE_URL to the final domain
// (on Vercel the production domain is picked up automatically).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const [n1, n2] = (cfg as { nameOrder?: string }).nameOrder === "bride-first" ? [cfg.bride, cfg.groom] : [cfg.groom, cfg.bride];
const title = `Ftesë për fejesën tonë — ${n1} & ${n2}`;
const description = "27 Dhjetor 2026 · Ora 13:00 · Hapni zarfin për ftesën";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { type: "website", locale: "sq_AL", url: "/", siteName: "Ftesë fejese", title, description },
  twitter: { card: "summary_large_image", title, description },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F8F0E2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${script.variable} ${serif.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
