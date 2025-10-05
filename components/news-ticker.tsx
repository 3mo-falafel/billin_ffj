"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { createClient } from "@/lib/supabase/client"
import { X } from "lucide-react"

interface NewsItem {
  id: string
  message_en: string
  message_ar: string
  is_active: boolean
  created_at: string
  display_order?: number
}

export function NewsTicker() {
  const { language, isArabic } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Default news items when no database content
  const defaultNews = {
    en: [
      "Weekly peaceful demonstrations continue every Friday at 12 PM",
      "New educational programs launched for local children",
      "International solidarity visitors welcomed to Bil'in",
      "Community olive harvest season begins this month"
    ],
    ar: [
      "المظاهرات السلمية الأسبوعية تستمر كل جمعة في الساعة 12 ظهراً",
      "إطلاق برامج تعليمية جديدة للأطفال المحليين", 
      "ترحيب بزوار التضامن الدوليين في بلعين",
      "بدء موسم قطف الزيتون المجتمعي هذا الشهر"
    ]
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    async function loadNews() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("news_ticker")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
        
        if (error) {
          // Only log actual errors, not missing table errors
          if (!error.message.includes("does not exist") && !error.message.includes("relation") && !error.message.includes("schema")) {
            console.warn("News ticker database error:", error.message)
          }
          throw error
        }
        
        // Use database news if available, otherwise use defaults
        if (data && data.length > 0) {
          setNews(data)
        } else {
          // Convert default news to expected format
          const defaultItems = defaultNews.en.map((text, index) => ({
            id: `default-${index}`,
            message_en: text,
            message_ar: defaultNews.ar[index] || text,
            is_active: true,
            created_at: new Date().toISOString(),
            display_order: index
          }))
          setNews(defaultItems)
        }
      } catch (error: any) {
        // Silently fall back to default news - don't spam console
        const defaultItems = defaultNews.en.map((text, index) => ({
          id: `default-${index}`,
          message_en: text,
          message_ar: defaultNews.ar[index] || text,
          is_active: true,
          created_at: new Date().toISOString(),
          display_order: index
        }))
        setNews(defaultItems)
      }
    }

    loadNews()
  }, [isClient])

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient || !isVisible || news.length === 0) return null

  const newsTexts = news.map(item => language === 'en' ? item.message_en : item.message_ar)
  const combinedNews = newsTexts.join(' • ')

  return (
    <div className="news-ticker sticky top-24 w-full h-10 shadow-lg z-40">
      {/* Palestinian flag background for entire bar */}
      <div className="absolute inset-0 flex">
        {/* Red triangle on the left */}
        <div className="relative w-10 h-full bg-red-600 flex items-center justify-center">
          <div 
            className="absolute right-0 top-0 w-0 h-0"
            style={{
              borderTop: '20px solid transparent',
              borderBottom: '20px solid transparent',
              borderLeft: '16px solid #dc2626'
            }}
          ></div>
        </div>
        
        {/* Three horizontal stripes */}
        <div className="flex-1 flex flex-col">
          {/* Black stripe (top) */}
          <div className="flex-1 bg-black"></div>
          {/* White stripe (middle) */}
          <div className="flex-1 bg-white"></div>
          {/* Green stripe (bottom) */}
          <div className="flex-1 bg-green-600"></div>
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="relative flex items-center h-full overflow-hidden">
        {/* News label */}
        <div className="flex-shrink-0 bg-black/80 text-white px-4 py-2 font-bold text-sm flex items-center gap-2 h-full backdrop-blur-sm">
          <span className={isArabic ? "arabic-text" : "english-text"}>
            {language === 'en' ? 'BREAKING NEWS' : 'أخبار عاجلة'}
          </span>
        </div>

        {/* Scrolling news content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
          <div 
            className={`relative whitespace-nowrap animate-scroll text-gray-900 font-medium text-sm py-2 px-4 ${
              isArabic ? 'arabic-text' : 'english-text'
            }`}
          >
            {combinedNews}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 h-full px-3 bg-black/80 hover:bg-black/90 text-white transition-colors flex items-center justify-center group backdrop-blur-sm"
          title={language === 'en' ? 'Close news ticker' : 'إغلاق شريط الأخبار'}
        >
          <X className="w-4 h-4 group-hover:text-red-400" />
        </button>
      </div>
    </div>
  )
}
