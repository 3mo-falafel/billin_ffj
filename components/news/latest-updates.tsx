"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

interface NewsUpdate {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  date: string
  featured: boolean
  created_at: string
}

export function LatestUpdates() {
  const { language, isArabic } = useLanguage()
  const [updates, setUpdates] = useState<NewsUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const supabase = createClient()
        const { data: newsUpdates } = await supabase
          .from("news")
          .select("*")
          .order("date", { ascending: false })
          .limit(6)

        if (newsUpdates) {
          setUpdates(newsUpdates)
        }
      } catch (error) {
        console.error('Error fetching updates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading updates...</p>
          </div>
        </div>
      </section>
    )
  }

  if (updates.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === "en" ? "Latest Updates" : "آخر التحديثات"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === "en" 
                ? "No news updates have been published yet." 
                : "لم يتم نشر أي تحديثات إخبارية بعد."}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Latest Updates" : "آخر التحديثات"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Recent developments and activities from our community association."
              : "التطورات والأنشطة الأخيرة من جمعيتنا المجتمعية."}
          </p>
        </div>

        <div className="space-y-8">
          {updates.map((update) => (
            <Card
              key={update.id}
              className={`border-border overflow-hidden ${update.featured ? "ring-2 ring-primary/20" : ""}`}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3">
                  <div className="aspect-video lg:aspect-square overflow-hidden">
                    <img
                      src={update.image_url || "/placeholder.svg?height=300&width=400"}
                      alt={language === "en" ? update.title_en : update.title_ar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="lg:w-2/3 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {update.featured && (
                      <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
                        {language === "en" ? "Featured" : "مميز"}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-2xl font-bold text-foreground mb-3 ${isArabic ? "arabic-text" : "english-text"}`}
                  >
                    {language === "en" ? update.title_en : update.title_ar}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={update.date}>
                        {new Date(update.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                      </time>
                    </div>
                  </div>
                  <p
                    className={`text-muted-foreground leading-relaxed mb-4 ${isArabic ? "arabic-text" : "english-text"}`}
                  >
                    {/* Extract first 200 characters as excerpt */}
                    {(language === "en" ? update.content_en : update.content_ar).substring(0, 200)}
                    {(language === "en" ? update.content_en : update.content_ar).length > 200 && "..."}
                  </p>
                  <Button variant="link" className="p-0 h-auto">
                    <span className={isArabic ? "arabic-text" : "english-text"}>
                      {language === "en" ? "Read Full Article" : "اقرأ المقال كاملاً"}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
