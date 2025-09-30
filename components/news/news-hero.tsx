"use client"

import { useLanguage } from "@/hooks/use-language"

export function NewsHero() {
  const { language, isArabic } = useLanguage()

  return (
    <section className="relative py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`space-y-6 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            {language === "en" ? "News & Events" : "الأخبار والفعاليات"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {language === "en"
              ? "Stay informed about our latest activities, community events, and ongoing initiatives for peace and justice."
              : "ابق على اطلاع بأحدث أنشطتنا وفعاليات المجتمع ومبادراتنا المستمرة من أجل السلام والعدالة."}
          </p>
        </div>
      </div>
    </section>
  )
}
