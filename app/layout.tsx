import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ScrollStageProvider from "@/components/providers/ScrollStageProvider";
import DepthRail from "@/components/layout/DepthRail";

const displayFont = Bodoni_Moda({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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

export const metadata: Metadata = {
  title: "NEMO Hotel Resort & SPA — Odesa, Lanzheron Beach",
  description:
    "The leading 5-star resort on Odesa's Black Sea coast — 11 heated pools, a private beach club and panoramic sea views from every terrace.",
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
    <html lang="en">
      <body className={`${displayFont.variable} ${inter.variable} ${plexMono.variable} antialiased`}>
        <ScrollStageProvider>
          <DepthRail />
          {children}
        </ScrollStageProvider>
      </body>
    </html>
  );
}
