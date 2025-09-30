"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function DocumentarySection() {
  const { language, isArabic } = useLanguage()

  interface DocumentaryVideo { id: string; title_en: string; title_ar: string; description_en?: string; description_ar?: string; thumbnail_url?: string; video_url: string; featured?: boolean }
  const [videos, setVideos] = useState<DocumentaryVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("documentary_videos")
          .select("*")
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })
        if (error) throw error
        if (active && data) setVideos(data as any)
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load videos")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <section className={`py-16 bg-muted/30 ${isArabic ? "arabic-text" : "english-text"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Documentary & Videos" : "الأفلام الوثائقية والفيديوهات"}
          </h2>
          {loading && <p className="text-muted-foreground">{language === "en" ? "Loading videos..." : "جاري تحميل الفيديوهات..."}</p>}
          {error && <p className="text-red-600 text-sm">{language === "en" ? error : "خطأ في التحميل"}</p>}
          {!loading && videos.length === 0 && !error && (
            <p className="text-muted-foreground">{language === "en" ? "No videos added yet." : "لا توجد فيديوهات بعد."}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {video.thumbnail_url && (
                  <img src={video.thumbnail_url} alt={(language === "en" ? video.title_en : video.title_ar) || "Video"} className="w-full h-full object-cover" />
                )}
                {!video.thumbnail_url && <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">{language === "en" ? "No thumbnail" : "بدون صورة"}</div>}
              </div>
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-base">
                    {language === "en" ? video.title_en : video.title_ar}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {(language === "en" ? video.description_en : video.description_ar) || ""}
                  </CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
