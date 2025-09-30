"use client"

import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export function GalleryHero() {
  const { language, isArabic } = useLanguage()

  return (
    <section className="relative py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`space-y-6 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            {getTranslation("gallery", language)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {language === "en"
              ? "Explore the visual story of Bil'in through photographs and videos showcasing our culture, struggles, and community spirit."
              : "استكشف القصة المرئية لبلعين من خلال الصور ومقاطع الفيديو التي تعرض ثقافتنا ونضالاتنا وروح المجتمع."}
          </p>
        </div>
      </div>
    </section>
  )
}
