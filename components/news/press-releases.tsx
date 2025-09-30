"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function PressReleases() {
  const { language, isArabic } = useLanguage()

  interface Release {
    id: string
    title_en: string
    title_ar: string
    summary_en?: string
    summary_ar?: string
    type_en?: string
    type_ar?: string
    date: string
  }

  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("press_releases")
          .select("*")
          .order("date", { ascending: false })
        if (error) throw error
        if (mounted && data) setReleases(data as any)
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load press releases")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Press Releases & Statements" : "البيانات الصحفية والتصريحات"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Official statements and press releases from our association."
              : "البيانات الرسمية والبيانات الصحفية من جمعيتنا."}
          </p>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground">
            {language === "en" ? "Loading press releases..." : "جاري تحميل البيانات الصحفية..."}
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 text-sm">{language === "en" ? error : "خطأ في التحميل"}</p>
        )}
        {!loading && releases.length === 0 && !error && (
          <p className="text-center text-muted-foreground">
            {language === "en" ? "No press releases yet." : "لا توجد بيانات صحفية بعد."}
          </p>
        )}
        {releases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release) => (
              <Card key={release.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {release.type_en || release.type_ar ? (
                      <span className="text-sm text-primary font-medium">
                        {language === "en" ? release.type_en : release.type_ar}
                      </span>
                    ) : null}
                  </div>
                  <CardTitle className={`text-lg leading-tight ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? release.title_en : release.title_ar}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(release.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </CardHeader>
                <CardContent>
                  {(release.summary_en || release.summary_ar) && (
                    <p className={`text-muted-foreground text-sm leading-relaxed mb-2 ${isArabic ? "arabic-text" : "english-text"}`}>
                      {language === "en" ? release.summary_en : release.summary_ar}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
