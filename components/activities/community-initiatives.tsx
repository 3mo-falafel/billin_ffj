"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Heart } from "lucide-react"

export function CommunityInitiatives() {
  const { language, isArabic } = useLanguage()

  interface Initiative { id: string; title_en: string; title_ar: string; description_en?: string; description_ar?: string }
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("community_initiatives").select("*")
        if (error) throw error
        if (active && data) setInitiatives(data as any)
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load initiatives")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Community Initiatives" : "المبادرات المجتمعية"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Building a stronger, more sustainable community through collaborative projects and mutual support."
              : "بناء مجتمع أقوى وأكثر استدامة من خلال المشاريع التعاونية والدعم المتبادل."}
          </p>
        </div>

        {loading && <p className="text-center text-muted-foreground">{language === "en" ? "Loading..." : "جاري التحميل..."}</p>}
        {error && <p className="text-center text-red-600 text-sm">{language === "en" ? error : "خطأ في التحميل"}</p>}
        {!loading && initiatives.length === 0 && !error && (
          <p className="text-center text-muted-foreground">{language === "en" ? "No initiatives yet." : "لا توجد مبادرات بعد."}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map(item => (
            <Card key={item.id} className="border-border">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className={`text-xl ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? item.title_en : item.title_ar}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {(item.description_en || item.description_ar) && (
                  <p className={`text-muted-foreground leading-relaxed ${isArabic ? "arabic-text" : "english-text"}`}>
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
