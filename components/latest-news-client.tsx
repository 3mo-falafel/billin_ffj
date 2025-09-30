"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"
import { Calendar, ArrowRight, Clock, User } from "lucide-react"
import { useEffect, useState } from "react"

interface NewsItem {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  video_url?: string
  date: string
  featured: boolean
  created_at: string
}

interface LatestNewsClientProps {
  newsItems: NewsItem[]
}

export function LatestNewsClient({ newsItems }: LatestNewsClientProps) {
  const { language, isArabic } = useLanguage()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('latest-news-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="latest-news-section" className="relative py-24 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-8 w-24 h-24 border border-primary/30 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-8 w-32 h-32 border border-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className={`inline-block px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold text-primary tracking-wider mb-6 transition-all duration-700 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {language === "en" ? "Latest Updates" : "آخر الأخبار"}
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold text-foreground mb-6 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {getTranslation("news", language)}
          </h2>
          
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {language === "en"
              ? "Chronicling our journey of peaceful resistance, community building, and the pursuit of justice. Stay informed about our ongoing efforts and community milestones."
              : "توثيق رحلتنا في المقاومة السلمية وبناء المجتمع والسعي لتحقيق العدالة. ابق على اطلاع بجهودنا المستمرة ومعالم مجتمعنا."}
          </p>

          <div className={`flex justify-center mt-8 transition-all duration-700 delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href="/news" className="flex items-center gap-2">
                {getTranslation("viewAll", language)}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
            >
              <Card className="group border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={language === "en" ? item.title_en : item.title_ar}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full">
                        {language === "en" ? "Featured" : "مميز"}
                      </div>
                    </div>
                  )}

                  {/* Historical Accent */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="w-8 h-8 border-2 border-white/60 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  {/* Date and Meta Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <time dateTime={item.date} className="font-medium">
                        {new Date(item.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <User className="h-3 w-3" />
                      <span>{language === "en" ? "FFJ Team" : "فريق أصدقاء"}</span>
                    </div>
                  </div>

                  <CardTitle className={`text-xl leading-tight group-hover:text-primary transition-colors duration-300 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? item.title_en : item.title_ar}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p
                    className={`text-muted-foreground leading-relaxed mb-4 ${isArabic ? "arabic-text" : "english-text"}`}
                  >
                    {/* Extract first 120 characters as excerpt */}
                    {(language === "en" ? item.content_en : item.content_ar).substring(0, 120)}
                    {(language === "en" ? item.content_en : item.content_ar).length > 120 && "..."}
                  </p>

                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary/80 font-semibold group-hover:gap-2 transition-all duration-300"
                    asChild
                  >
                    <Link href={`/news/${item.id}`} className="flex items-center gap-1">
                      {getTranslation("readMore", language)}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>

                {/* Historical bottom accent */}
                <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </div>
          ))}
        </div>

        {/* Historical Timeline Accent */}
        <div className={`flex items-center justify-center mt-16 transition-all duration-700 delay-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2008</div>
              <div className="text-sm text-muted-foreground">{language === "en" ? "First Story" : "أول قصة"}</div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary via-secondary to-primary max-w-xs" />
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{new Date().getFullYear()}</div>
              <div className="text-sm text-muted-foreground">{language === "en" ? "Today" : "اليوم"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
