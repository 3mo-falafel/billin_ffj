"use client"

import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { Footer } from "@/components/footer"
import { InvolvementForm } from "@/components/involvement-form"
import { useLanguage } from "@/hooks/use-language"

export default function GetInvolvedPage() {
  const { language, isArabic } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <NewsTicker />
      <section className="flex-1 py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {language === "en" ? "Get Involved" : "انضم إلينا"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "Support our work through volunteering, partnerships, or sharing skills. Fill out the form below to let us know how you'd like to contribute to our community."
                : "ادعم عملنا من خلال التطوع أو الشراكات أو مشاركة المهارات. املأ النموذج أدناه لتخبرنا كيف تريد المساهمة في مجتمعنا."}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <InvolvementForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
