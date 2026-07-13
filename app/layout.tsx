import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Homiq Trends | Premium E-Commerce Experience",
    template: "%s | Homiq Trends",
  },
  description: "Discover curated premium lifestyles, luxury home decors, and high-fashion trends at Homiq Trends.",
  keywords: ["e-commerce", "luxury", "home decor", "fashion", "premium trends"],
  authors: [{ name: "Homiq Trends Team" }],
  creator: "Homiq Trends",
  metadataBase: new URL("https://homiqtrends.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://homiqtrends.com",
    title: "Homiq Trends | Premium E-Commerce Experience",
    description: "Discover curated premium lifestyles, luxury home decors, and high-fashion trends at Homiq Trends.",
    siteName: "Homiq Trends",
    images: [
      {
        url: "/images/hero/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Homiq Trends Premium Lifestyle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homiq Trends | Premium E-Commerce Experience",
    description: "Discover curated premium lifestyles, luxury home decors, and high-fashion trends.",
    images: ["/images/hero/og-image.jpg"],
    creator: "@homiqtrends",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
