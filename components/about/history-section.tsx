"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Calendar, Clock, Star, Award, MapPin, Camera } from "lucide-react"

export function HistorySection() {
  const { language, isArabic } = useLanguage()

  interface HistoryItem { id: string; year: string; title_en: string; title_ar: string; description_en?: string; description_ar?: string; order_index?: number }
  const [events, setEvents] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Static foundational history that's always shown
  const foundationalHistory = {
    year: "2005-2008",
    title_en: "Resistance Begins and Organization Established",
    title_ar: "بداية المقاومة وتأسيس المنظمة",
    description_en: "The peaceful resistance movement in Bil'in began in 2005 with weekly demonstrations against land confiscation and the separation wall. Building on three years of grassroots activism, Friends of Freedom and Justice (FFJ) was formally established in 2008 as a Palestinian Authority-recognized non-profit organization based in Bil'in and Ramallah. From its inception, FFJ expanded its impact through land restoration efforts, funding university education, and supporting programs for children suffering from trauma linked to night raids. Along the way, documenting our journey became essential though not without its risks. Five cameras were broken in the process of capturing our struggle.",
    description_ar: "بدأت حركة المقاومة السلمية في بلعين عام 2005 بمظاهرات أسبوعية ضد مصادرة الأراضي وجدار الفصل. بناءً على ثلاث سنوات من النشاط الشعبي، تأسست أصدقاء الحرية والعدالة رسمياً عام 2008 كمنظمة غير ربحية معترف بها من السلطة الفلسطينية ومقرها بلعين ورام الله. منذ التأسيس، وسعت المنظمة تأثيرها من خلال جهود استصلاح الأراضي وتمويل التعليم الجامعي ودعم برامج للأطفال الذين يعانون من صدمات مرتبطة بالمداهمات الليلية. وفي هذا الطريق، أصبح توثيق رحلتنا أمراً ضرورياً—وإن لم يخل من المخاطر. تم كسر خمس كاميرات في عملية توثيق نضالنا."
  }

  const milestones = {
    en: [
      { icon: MapPin, title: "Community Roots", desc: "Based in Bil'in & Ramallah" },
      { icon: Calendar, title: "Weekly Demos", desc: "Every Friday since 2005" },
      { icon: Camera, title: "Documentary", desc: "5 Broken Cameras fame" },
      { icon: Award, title: "Global Recognition", desc: "International awards" }
    ],
    ar: [
      { icon: MapPin, title: "جذور مجتمعية", desc: "مقرها في بلعين ورام الله" },
      { icon: Calendar, title: "مظاهرات أسبوعية", desc: "كل جمعة منذ 2005" },
      { icon: Camera, title: "فيلم وثائقي", desc: "شهرة 5 كاميرات مكسورة" },
      { icon: Award, title: "اعتراف عالمي", desc: "جوائز دولية" }
    ]
  }

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("history")
          .select("*")
          .order("order_index", { ascending: true })
        
        // If table doesn't exist, just ignore the error and show only foundational history
        if (error && error.message.includes("does not exist")) {
          if (active) {
            setEvents([])
            setLoading(false)
          }
          return
        }
        
        if (error) throw error
        if (active && data) setEvents(data as any)
      } catch (e: any) {
        // Silently handle missing table - only show error for other issues
        if (active && !e.message?.includes("does not exist") && !e.message?.includes("schema cache")) {
          setError(e.message || "Failed to load history")
        } else {
          setEvents([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <section className="relative py-20 bg-gradient-to-br from-muted/30 via-background to-secondary/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-16 ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
            {language === "en" ? "Our History" : "تاريخنا"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === "en"
              ? "A journey of resilience, community building, and peaceful resistance spanning nearly two decades."
              : "رحلة من المرونة وبناء المجتمع والمقاومة السلمية تمتد لما يقارب عقدين من الزمن."}
          </p>
        </div>

        {/* Milestones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {milestones[language].map((milestone, index) => (
            <div key={index} className="group">
              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <milestone.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className={`font-semibold text-foreground mb-1 ${isArabic ? "arabic-text" : "english-text"}`}>
                  {milestone.title}
                </h4>
                <p className={`text-sm text-muted-foreground ${isArabic ? "arabic-text" : "english-text"}`}>
                  {milestone.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>{language === "en" ? "Loading additional history..." : "جاري تحميل تاريخ إضافي..."}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">
              {language === "en" ? error : "خطأ في التحميل"}
            </p>
          </div>
        )}
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
          
          <div className="space-y-12">
            {/* Foundational History */}
            <div className="relative flex flex-col md:flex-row gap-6 items-start">
              {/* Timeline dot */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg border-4 border-background relative z-10">
                  <span className="text-primary-foreground font-bold text-xs md:text-lg">{foundationalHistory.year}</span>
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              </div>
              
              {/* Content card */}
              <div className="flex-1 ml-4 md:ml-0">
                <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold text-foreground mb-2 ${isArabic ? "arabic-text" : "english-text"}`}>
                          {language === "en" ? foundationalHistory.title_en : foundationalHistory.title_ar}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium">
                          <Calendar className="w-4 h-4" />
                          {language === "en" ? "Foundation Year" : "سنة التأسيس"}
                        </div>
                      </div>
                    </div>
                    <p className={`text-muted-foreground leading-relaxed text-lg ${isArabic ? "arabic-text text-right" : "english-text"}`}>
                      {language === "en" ? foundationalHistory.description_en : foundationalHistory.description_ar}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional History Events */}
            {events.map((event, index) => (
              <div key={event.id} className="relative flex flex-col md:flex-row gap-6 items-start">
                {/* Timeline dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 md:w-20 md:h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-lg border-4 border-background relative z-10">
                    <span className="text-secondary-foreground font-bold text-xs md:text-lg">{event.year}</span>
                  </div>
                  <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl" />
                </div>
                
                {/* Content card */}
                <div className="flex-1 ml-4 md:ml-0">
                  <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold text-foreground mb-2 ${isArabic ? "arabic-text" : "english-text"}`}>
                            {language === "en" ? event.title_en : event.title_ar}
                          </h3>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-sm text-secondary font-medium">
                            <Calendar className="w-4 h-4" />
                            {event.year}
                          </div>
                        </div>
                      </div>
                      {(event.description_en || event.description_ar) && (
                        <p className={`text-muted-foreground leading-relaxed text-lg ${isArabic ? "arabic-text text-right" : "english-text"}`}>
                          {language === "en" ? event.description_en : event.description_ar}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legacy statement */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl border border-primary/20">
            <h3 className={`text-2xl font-bold text-foreground mb-4 ${isArabic ? "arabic-text" : "english-text"}`}>
              {language === "en" ? "Our Continuing Legacy" : "إرثنا المستمر"}
            </h3>
            <p className={`text-lg text-muted-foreground leading-relaxed ${isArabic ? "arabic-text" : "english-text"}`}>
              {language === "en" 
                ? "From a small village to the world stage, our story continues to inspire movements for justice, peace, and human dignity across the globe."
                : "من قرية صغيرة إلى المسرح العالمي، تستمر قصتنا في إلهام حركات العدالة والسلام والكرامة الإنسانية في جميع أنحاء العالم."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
