import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Okoye Emmanuel Obiajulu - Software Developer",
	description:
		"Portfolio of Okoye Emmanuel Obiajulu, a Software Developer specializing in full-stack web applications.",
	generator: "v0.dev",
	author: "Okoye Emmanuel Obiajulu",
	keywords: "Software Developer, Full-Stack, Web Applications, Portfolio",
	charset: "UTF-8",
	robots: "index, follow",
	"og:title": "Okoye Emmanuel Obiajulu - Software Developer",
	"og:description":
		"Portfolio of Okoye Emmanuel Obiajulu, a Software Developer specializing in full-stack web applications.",
	"og:image": "/images/emmanuel.png",
	"og:url": "https://okoye-emma-obi.vercel.app/",
	"twitter:card": "summary_large_image",
	"twitter:title": "Okoye Emmanuel Obiajulu - Software Developer",
	"twitter:description":
		"Portfolio of Okoye Emmanuel Obiajulu, a Software Developer specializing in full-stack web applications.",
	"twitter:image": "/images/emmanuel.png",
	"twitter:url": "https://x.com",
	"theme-color": "#ffffff",
	"application-name": "Okoye Emmanuel Obiajulu Portfolio",
	"msapplication-TileColor": "#da532c",
	"msapplication-config": "/browserconfig.xml",
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="fixed top-4 right-4 z-50">
            <ModeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'