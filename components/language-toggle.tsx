"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="language-transition font-medium bg-transparent whitespace-nowrap w-[80px] flex justify-center"
    >
      {language === "en" ? getTranslation("switchToArabic", "ar") : getTranslation("switchToEnglish", "en")}
    </Button>
  )
}
