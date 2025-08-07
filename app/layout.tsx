import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Asvia - Your Unified AI Workspace",
  description: "Zero-cost, open-source AI multiplex workplace powered by multiple AI models",
  keywords: ["AI", "workspace", "coding", "chat", "productivity", "open-source"],
  authors: [{ name: "Asvia Team" }],
  creator: "Asvia",
  publisher: "Asvia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://asvia.dev",
    title: "Asvia - Your Unified AI Workspace",
    description: "Zero-cost, open-source AI multiplex workplace powered by multiple AI models",
    siteName: "Asvia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asvia - Your Unified AI Workspace",
    description: "Zero-cost, open-source AI multiplex workplace powered by multiple AI models",
    creator: "@asvia_dev",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
