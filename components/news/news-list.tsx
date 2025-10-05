"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TagIcon } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface NewsItem {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  summary_en?: string
  summary_ar?: string
  category: string
  image_url?: string
  is_featured: boolean
  published_at: string
  created_at: string
}

export function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    try {
      setLoading(true)
      const response = await fetch('/api/news')
      const result = await response.json()
      
      if (result.success) {
        setNews(result.data || [])
      } else {
        setError(result.error || 'Failed to load news')
      }
    } catch (error) {
      console.error('Error loading news:', error)
      setError('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading news...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredNews = news.filter(item => item.is_featured)
  const regularNews = news.filter(item => !item.is_featured)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'آخر الأخبار' : 'Latest News'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اطلع على آخر الأخبار والتطورات من فلسطين'
              : 'Stay updated with the latest news and developments from Palestine'
            }
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">
              {language === 'ar' ? 'الأخبار المميزة' : 'Featured News'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNews.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  {item.image_url && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={language === 'ar' ? item.title_ar : item.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default">
                        {language === 'ar' ? 'مميز' : 'Featured'}
                      </Badge>
                      <Badge variant="outline">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? item.title_ar : item.title_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' 
                        ? (item.summary_ar || item.content_ar?.substring(0, 150) + '...')
                        : (item.summary_en || item.content_en?.substring(0, 150) + '...')
                      }
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(item.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular News */}
        {regularNews.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              {language === 'ar' ? 'الأخبار الأخرى' : 'Other News'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  {item.image_url && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={language === 'ar' ? item.title_ar : item.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className={`text-lg ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' ? item.title_ar : item.title_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground text-sm mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' 
                        ? (item.summary_ar || item.content_ar?.substring(0, 120) + '...')
                        : (item.summary_en || item.content_en?.substring(0, 120) + '...')
                      }
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      <span>
                        {new Date(item.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد أخبار متاحة حالياً' : 'No news available at the moment'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}