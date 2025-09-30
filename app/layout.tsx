import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Noto_Sans_Arabic, Playfair_Display } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"
import "./globals.css"

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-arabic",
})

// Classic serif for historical/elegant entrance headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Friends of Freedom and Justice – Bil'in | أصدقاء الحرية والعدالة - بلعين",
  description:
    "Community association dedicated to preserving heritage, promoting peace, and building community in Bil'in | جمعية مجتمعية مكرسة للحفاظ على التراث وتعزيز السلام وبناء المجتمع في بلعين",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
  <body className={`font-sans site-background tatreez-site-bg ${GeistSans.variable} ${GeistMono.variable} ${notoSansArabic.variable} ${playfair.variable}`}>
        {/* Global background + subtle overlay handled via globals.css */}
        <div className="min-h-screen w-full bg-overlay-pattern">
          <ClientLayout>
            {children}
          </ClientLayout>
        </div>
      </body>
    </html>
  )
}
