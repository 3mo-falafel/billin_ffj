"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Palette } from "lucide-react"

export function CulturalShowcase() {
  const { language, isArabic } = useLanguage()

  interface CulturalItem { id: string; category: string; name_en: string; name_ar: string; image_url?: string }
  interface CulturalGroup { category: string; items: CulturalItem[] }
  const [groups, setGroups] = useState<CulturalGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("cultural_items").select("*")
        if (error) throw error
        if (active && data) {
          const groupsMap: Record<string, CulturalItem[]> = {}
            ;(data as any as CulturalItem[]).forEach(item => {
              groupsMap[item.category] = groupsMap[item.category] || []
              groupsMap[item.category].push(item)
            })
          const grouped = Object.entries(groupsMap).map(([category, items]) => ({ category, items }))
          setGroups(grouped)
        }
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load cultural items")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Cultural Showcase" : "العرض الثقافي"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Discover the rich cultural heritage that defines our community identity."
              : "اكتشف التراث الثقافي الغني الذي يحدد هوية مجتمعنا."}
          </p>
        </div>

        {loading && <p className="text-center text-muted-foreground">{language === "en" ? "Loading items..." : "جاري تحميل العناصر..."}</p>}
        {error && <p className="text-center text-red-600 text-sm">{language === "en" ? error : "خطأ في التحميل"}</p>}
        {!loading && groups.length === 0 && !error && (
          <p className="text-center text-muted-foreground">{language === "en" ? "No cultural items yet." : "لا توجد عناصر ثقافية بعد."}</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groups.map(group => (
            <Card key={group.category} className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className={`text-xl ${isArabic ? "arabic-text" : "english-text"}`}>{group.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {group.items.map(item => (
                    <div key={item.id} className="text-center">
                      <div className="aspect-square overflow-hidden rounded-lg mb-3">
                        <img
                          src={item.image_url || "/placeholder.svg?height=150&width=150"}
                          alt={(language === "en" ? item.name_en : item.name_ar) || "Item"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className={`text-sm font-medium text-foreground ${isArabic ? "arabic-text" : "english-text"}`}>
                        {language === "en" ? item.name_en : item.name_ar}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
