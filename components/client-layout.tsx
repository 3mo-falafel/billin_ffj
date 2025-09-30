"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { HtmlAttributeUpdater } from "@/components/html-attribute-updater"
import { NewsTicker } from "@/components/news-ticker"
import { Toaster } from "@/components/ui/toaster"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Always wrap with LanguageProvider to avoid context errors
  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {/* Update HTML attributes after hydration */}
        <HtmlAttributeUpdater />
        
        {/* Main content */}
        {children}
        
        {/* Toast notifications */}
        <Toaster />
      </ThemeProvider>
    </LanguageProvider>
  )
}
