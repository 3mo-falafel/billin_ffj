"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TagIcon, ArrowLeftIcon, ShareIcon } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface NewsArticle {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  video_url?: string
  date: string
  featured?: boolean
  is_active: boolean
  created_at: string
}

interface NewsDetailProps {
  newsId: string
}

export function NewsDetail({ newsId }: NewsDetailProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    loadArticle()
  }, [newsId])

  async function loadArticle() {
    try {
      setLoading(true)
      console.log('🔍 NEWS DETAIL - Loading article:', newsId)
      
      const response = await fetch(`/api/news/${newsId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🔍 NEWS DETAIL - API response:', result)
      
      if (result.data) {
        setArticle(result.data)
      } else if (result.error) {
        setError(result.error)
      } else {
        setError('Unexpected response format')
      }
    } catch (error: any) {
      console.error('🔍 NEWS DETAIL - Error loading article:', error)
      setError(`Failed to load article: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </section>
    )
  }

  if (error || !article) {
    return (
      <section className="py-16 bg-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
          <Button onClick={() => router.push('/news')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'العودة إلى الأخبار' : 'Back to News'}
          </Button>
        </div>
      </section>
    )
  }

  const title = language === 'ar' ? article.title_ar : article.title_en
  const content = language === 'ar' ? article.content_ar : article.content_en

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/news')}
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'العودة إلى الأخبار' : 'Back to News'}
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            {/* Hero Image */}
            {article.image_url && (
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                <Image 
                  src={article.image_url} 
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </div>
            )}

            <CardHeader>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {article.featured && (
                  <Badge variant="default">
                    {language === 'ar' ? 'مميز' : 'Featured'}
                  </Badge>
                )}
                <Badge variant="outline">
                  <TagIcon className="w-3 h-3 mr-1" />
                  {language === 'ar' ? 'أخبار' : 'News'}
                </Badge>
              </div>
              <CardTitle className={`text-3xl md:text-4xl ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Date and Share Info */}
              <div className="flex flex-wrap gap-4 items-center justify-between text-sm border-b pb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {new Date(article.date).toLocaleDateString(
                      language === 'ar' ? 'ar-EG' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: title,
                        url: window.location.href
                      })
                    }
                  }}
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'مشاركة' : 'Share'}
                </Button>
              </div>

              {/* Content */}
              <div className={`prose max-w-none ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>

              {/* Video Embed */}
              {article.video_url && (
                <div className="space-y-3">
                  <h3 className={`text-2xl font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? 'الفيديو' : 'Video'}
                  </h3>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {article.video_url.includes('youtube.com') || article.video_url.includes('youtu.be') ? (
                      <iframe
                        src={article.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full"
                        allowFullScreen
                        title={title}
                      />
                    ) : (
                      <video 
                        src={article.video_url} 
                        controls 
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-gray-100 rounded-lg p-6 space-y-3">
                <h3 className={`text-xl font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">
                      {language === 'ar' ? 'تاريخ النشر:' : 'Published on:'}
                    </span>{' '}
                    {new Date(article.date).toLocaleDateString(
                      language === 'ar' ? 'ar-EG' : 'en-US'
                    )}
                  </div>
                  <div>
                    <span className="font-medium">
                      {language === 'ar' ? 'الحالة:' : 'Status:'}
                    </span>{' '}
                    {article.is_active 
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'غير نشط' : 'Inactive')
                    }
                  </div>
                </div>
              </div>

              {/* Related Articles CTA */}
              <div className={`border-t pt-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ar' 
                    ? 'اطلع على المزيد من الأخبار والتحديثات من فلسطين.'
                    : 'Check out more news and updates from Palestine.'
                  }
                </p>
                <Button onClick={() => router.push('/news')}>
                  {language === 'ar' ? 'جميع الأخبار' : 'All News'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
