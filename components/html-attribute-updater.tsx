"use client"

import { useLanguage } from "@/hooks/use-language"
import { useEffect } from "react"

export function HtmlAttributeUpdater() {
  const { language } = useLanguage()

  useEffect(() => {
    // Only update after hydration to avoid SSR mismatch
    if (typeof window !== "undefined") {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = language
    }
  }, [language])

  return null // This component doesn't render anything
}
