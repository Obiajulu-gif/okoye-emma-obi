import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "./globals.css";

import { RouteTransitionShell } from "@/components/site/route-transition-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Okoye Emmanuel Obiajulu | Full-Stack & Blockchain Engineer",
  description:
    "Portfolio of Okoye Emmanuel Obiajulu featuring full-stack engineering work, Stellar/Soroban OSS contributions, and client-ready delivery experience.",
  keywords: [
    "Okoye Emmanuel Obiajulu",
    "Full-Stack Developer",
    "Stellar",
    "Soroban",
    "Next.js",
    "Portfolio",
  ],
  metadataBase: new URL("https://okoye-emma-obi.vercel.app"),
  openGraph: {
    title: "Okoye Emmanuel Obiajulu | Full-Stack & Blockchain Engineer",
    description:
      "Production-grade web and blockchain engineering with strong UX and maintainable architecture.",
    url: "https://okoye-emma-obi.vercel.app",
    siteName: "Okoye Emmanuel Obiajulu Portfolio",
    images: [{ url: "/images/emmanuel.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okoye Emmanuel Obiajulu | Full-Stack & Blockchain Engineer",
    description:
      "Production-grade web and blockchain engineering with strong UX and maintainable architecture.",
    images: ["/images/emmanuel.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${fraunces.variable} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RouteTransitionShell>{children}</RouteTransitionShell>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
