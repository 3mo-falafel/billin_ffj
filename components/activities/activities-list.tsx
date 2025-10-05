"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface Activity {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  category: string
  location_en?: string
  location_ar?: string
  date: string
  participants?: number
  image_url?: string
  is_featured: boolean
  created_at: string
}

export function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    try {
      setLoading(true)
      const response = await fetch('/api/activities')
      const result = await response.json()
      
      if (result.success) {
        setActivities(result.data || [])
      } else {
        setError(result.error || 'Failed to load activities')
      }
    } catch (error) {
      console.error('Error loading activities:', error)
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredActivities = activities.filter(activity => activity.is_featured)
  const regularActivities = activities.filter(activity => !activity.is_featured)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'أنشطتنا' : 'Our Activities'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تعرف على الأنشطة والفعاليات التي ننظمها لدعم المجتمع الفلسطيني'
              : 'Discover the activities and events we organize to support the Palestinian community'
            }
          </p>
        </div>

        {/* Featured Activities */}
        {featuredActivities.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">
              {language === 'ar' ? 'الأنشطة المميزة' : 'Featured Activities'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  {activity.image_url && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={activity.image_url} 
                        alt={language === 'ar' ? activity.title_ar : activity.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">
                        {language === 'ar' ? 'مميز' : 'Featured'}
                      </Badge>
                      <Badge variant="outline">
                        {activity.category}
                      </Badge>
                    </div>
                    <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? activity.title_ar : activity.title_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' ? activity.description_ar : activity.description_en}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      {activity.date && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(activity.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      )}
                      
                      {(activity.location_en || activity.location_ar) && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{language === 'ar' ? activity.location_ar : activity.location_en}</span>
                        </div>
                      )}
                      
                      {activity.participants && (
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4" />
                          <span>
                            {activity.participants} {language === 'ar' ? 'مشارك' : 'participants'}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Activities */}
        {regularActivities.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              {language === 'ar' ? 'الأنشطة الأخرى' : 'Other Activities'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  {activity.image_url && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={activity.image_url} 
                        alt={language === 'ar' ? activity.title_ar : activity.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {activity.category}
                      </Badge>
                    </div>
                    <CardTitle className={`text-lg ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' ? activity.title_ar : activity.title_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground text-sm mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' ? activity.description_ar : activity.description_en}
                    </p>
                    
                    <div className="space-y-1 text-xs">
                      {activity.date && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{new Date(activity.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      )}
                      
                      {(activity.location_en || activity.location_ar) && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{language === 'ar' ? activity.location_ar : activity.location_en}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد أنشطة متاحة حالياً' : 'No activities available at the moment'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}