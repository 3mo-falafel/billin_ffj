"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon, ImageIcon } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface Activity {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  image_url?: string
  video_url?: string
  date: string
  is_active: boolean
  created_at: string
}

interface ActivityDetailProps {
  activityId: string
}

export function ActivityDetail({ activityId }: ActivityDetailProps) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    loadActivity()
  }, [activityId])

  async function loadActivity() {
    try {
      setLoading(true)
      console.log('🔍 ACTIVITY DETAIL - Loading activity:', activityId)
      
      const response = await fetch(`/api/activities/${activityId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Activity not found')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🔍 ACTIVITY DETAIL - API response:', result)
      
      if (result.data) {
        setActivity(result.data)
      } else if (result.error) {
        setError(result.error)
      } else {
        setError('Unexpected response format')
      }
    } catch (error: any) {
      console.error('🔍 ACTIVITY DETAIL - Error loading activity:', error)
      setError(`Failed to load activity: ${error.message}`)
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

  if (error || !activity) {
    return (
      <section className="py-16 bg-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Activity not found'}</p>
          <Button onClick={() => router.push('/activities')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'العودة إلى الأنشطة' : 'Back to Activities'}
          </Button>
        </div>
      </section>
    )
  }

  const title = language === 'ar' ? activity.title_ar : activity.title_en
  const description = language === 'ar' ? activity.description_ar : activity.description_en

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/activities')}
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'العودة إلى الأنشطة' : 'Back to Activities'}
        </Button>

        <div className="max-w-5xl mx-auto">
          <Card>
            {/* Hero Image */}
            {activity.image_url && (
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                <Image 
                  src={activity.image_url} 
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </div>
            )}

            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </Badge>
              </div>
              <CardTitle className={`text-3xl md:text-4xl ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Date and Location Info */}
              <div className="flex flex-wrap gap-4 text-sm border-b pb-4">
                {activity.date && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {new Date(activity.date).toLocaleDateString(
                        language === 'ar' ? 'ar-EG' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {language === 'ar' ? 'قرية بلعين' : "Bil'in Village"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className={`prose max-w-none ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-2xl font-semibold mb-4">
                  {language === 'ar' ? 'حول هذا النشاط' : 'About This Activity'}
                </h3>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {/* Video Embed */}
              {activity.video_url && (
                <div className="space-y-3">
                  <h3 className={`text-2xl font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? 'الفيديو' : 'Video'}
                  </h3>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {activity.video_url.includes('youtube.com') || activity.video_url.includes('youtu.be') ? (
                      <iframe
                        src={activity.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full"
                        allowFullScreen
                        title={title}
                      />
                    ) : (
                      <video 
                        src={activity.video_url} 
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
                      {language === 'ar' ? 'تاريخ الإضافة:' : 'Added on:'}
                    </span>{' '}
                    {new Date(activity.created_at).toLocaleDateString(
                      language === 'ar' ? 'ar-EG' : 'en-US'
                    )}
                  </div>
                  <div>
                    <span className="font-medium">
                      {language === 'ar' ? 'الحالة:' : 'Status:'}
                    </span>{' '}
                    {activity.is_active 
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'غير نشط' : 'Inactive')
                    }
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className={`border-t pt-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'ar' ? 'شارك معنا' : 'Get Involved'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ar' 
                    ? 'هل تريد المشاركة في أنشطتنا القادمة؟ تواصل معنا لمعرفة المزيد.'
                    : 'Want to participate in our upcoming activities? Contact us to learn more.'
                  }
                </p>
                <Button onClick={() => router.push('/contact')}>
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
