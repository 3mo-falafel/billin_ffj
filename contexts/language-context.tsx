"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  isArabic: boolean
  isEnglish: boolean
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  // Lightweight translation helper; supports dotted keys by taking last segment.
  const t = (key: string, fallback?: string): string => {
    // Direct match
    if (key in translations) {
      // @ts-ignore index access
      return translations[key as keyof typeof translations][language] || fallback || key
    }
    // Support dot notation by last segment
    const last = key.split(".").pop() as string
    if (last && last in translations) {
      // @ts-ignore index access
      return translations[last as keyof typeof translations][language] || fallback || key
    }
    return fallback || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    isArabic: language === "ar",
    isEnglish: language === "en",
    t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // During SSR, provide default values
    if (typeof window === "undefined") {
      return {
        language: "en" as Language,
        setLanguage: () => {},
        toggleLanguage: () => {},
        isArabic: false,
        isEnglish: true,
        t: (key: string, fallback?: string) => {
          // Simple fallback for SSR
          if (key in translations) {
            return (translations as any)[key].en || fallback || key
          }
          return fallback || key
        },
      }
    }
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
