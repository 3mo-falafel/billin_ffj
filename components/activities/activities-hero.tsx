"use client"

import { useLanguage } from "@/hooks/use-language"

export function ActivitiesHero() {
  const { language, isArabic } = useLanguage()

  return (
    <section className="relative py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`space-y-6 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            {language === "en" ? "Our Activities & Projects" : "أنشطتنا ومشاريعنا"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {language === "en"
              ? "From peaceful demonstrations to cultural preservation, our diverse activities strengthen community bonds and promote positive change."
              : "من المظاهرات السلمية إلى الحفاظ على الثقافة، تقوي أنشطتنا المتنوعة الروابط المجتمعية وتعزز التغيير الإيجابي."}
          </p>
        </div>
      </div>
    </section>
  )
}
