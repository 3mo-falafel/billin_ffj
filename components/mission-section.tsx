"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Heart } from "lucide-react" // keep one icon placeholder if needed

export function MissionSection() {
  const { language, isArabic } = useLanguage()

  interface MissionItem { id: string; title_en: string; title_ar: string; description_en?: string; description_ar?: string }
  const [items, setItems] = useState<MissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("mission_items").select("*")
        if (error) throw error
        if (active && data) setItems(data as any)
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load mission items")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Our Mission" : "مهمتنا"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "We are dedicated to preserving our heritage while building a peaceful and just future for our community."
              : "نحن ملتزمون بالحفاظ على تراثنا بينما نبني مستقبلاً سلمياً وعادلاً لمجتمعنا."}
          </p>
        </div>

        {loading && <p className="text-center text-muted-foreground">{language === "en" ? "Loading..." : "جاري التحميل..."}</p>}
        {error && <p className="text-center text-red-600 text-sm">{language === "en" ? error : "خطأ في التحميل"}</p>}
        {!loading && items.length === 0 && !error && (
          <p className="text-center text-muted-foreground">{language === "en" ? "No mission items yet." : "لا توجد عناصر للمهمة بعد."}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <Card key={item.id} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className={`font-semibold text-lg mb-3 ${isArabic ? "arabic-text" : "english-text"}`}>
                  {language === "en" ? item.title_en : item.title_ar}
                </h3>
                {(item.description_en || item.description_ar) && (
                  <p className={`text-muted-foreground text-sm leading-relaxed ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? item.description_en : item.description_ar}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
