import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ScrollStageProvider from "@/components/providers/ScrollStageProvider";
import DepthRail from "@/components/layout/DepthRail";

// Variable cut, with the axes the headline treatment actually rides: see
// `.font-display` in globals.css for the settings.
const displayFont = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "NEMO Hotel Resort & SPA — Odesa, Lanzheron Beach";
const description =
  "The leading 5-star resort on Odesa's Black Sea coast — 11 heated pools, a private beach club and panoramic sea views from every terrace.";
// Set NEXT_PUBLIC_SITE_URL on the deployment; the fallback only keeps local builds
// from emitting relative social-card URLs, which no scraper will follow.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nemohotel.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "NEMO Hotel Resort & SPA",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/videos/stages-poster.jpg",
        width: 1168,
        height: 784,
        alt: "The NEMO resort pool deck on the Odesa seafront",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/videos/stages-poster.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#23303c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables belong on the root element: globals.css maps them into
    // --font-display / --font-body on :root, and a var defined on <body> is not in
    // scope there — which silently drops every family back to the browser default.
    <html lang="en" className={`${displayFont.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        <ScrollStageProvider>
          <DepthRail />
          {children}
        </ScrollStageProvider>
      </body>
    </html>
  );
}
