"use client"

import { useLanguage } from "@/hooks/use-language"

// Removed hardcoded sample leadership entries per request.
// If a leaders table is added later, this component can be updated to fetch dynamically.
export function KeyPeople() {
  const { language, isArabic } = useLanguage()

  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-4 ${isArabic ? "arabic-text" : "english-text"}`}>
          {language === "en" ? "Key People" : "الأشخاص الرئيسيون"}
        </h2>
        <p className={`text-muted-foreground ${isArabic ? "arabic-text" : "english-text"}`}>
          {language === "en"
            ? "No leadership profiles have been added yet."
            : "لم تتم إضافة ملفات القيادات بعد."}
        </p>
      </div>
    </section>
  )
}
