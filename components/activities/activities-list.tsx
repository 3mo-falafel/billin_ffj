"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UsersIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

// Fallback image component for handling broken images
function ActivityImage({ src, alt, ...props }: { src: string; alt: string; fill?: boolean; className?: string; sizes?: string; loading?: "lazy" | "eager" }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  
  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])
  
  return (
    <Image 
      {...props}
      src={hasError ? '/placeholder.jpg' : imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgSrc('/placeholder.jpg')
        }
      }}
    />
  )
}

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
  gallery_images?: string[]
  is_featured: boolean
  created_at: string
}

// Image Carousel Component for Activity Cards
function ActivityImageCarousel({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }
  
  if (images.length === 0) {
    return null
  }
  
  return (
    <div className="relative w-full h-full group">
      <ActivityImage
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
      />
      
      {/* Navigation arrows - only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

export function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    try {
      setLoading(true)
      console.log('🔍 ACTIVITIES LIST DEBUG - Loading activities from API...')
      
      const response = await fetch('/api/activities?active=true')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🔍 ACTIVITIES LIST DEBUG - API response:', result)
      
      // Our API returns { data: [...] } format, not { success: true, data: [...] }
      if (result.data) {
        // Transform the database data to match expected interface
        const transformedActivities = result.data.map((activity: any) => {
          // Parse gallery_images - could be JSON string or array
          let images: string[] = []
          if (activity.gallery_images) {
            try {
              images = typeof activity.gallery_images === 'string' 
                ? JSON.parse(activity.gallery_images) 
                : activity.gallery_images
            } catch {
              images = activity.image_url ? [activity.image_url] : []
            }
          } else if (activity.image_url) {
            images = [activity.image_url]
          }
          
          return {
            id: activity.id,
            title_en: activity.title_en,
            title_ar: activity.title_ar,
            description_en: activity.description_en,
            description_ar: activity.description_ar,
            category: 'community', // Default category since DB doesn't have this field
            location_en: 'Bil\'in Village', // Default location
            location_ar: 'قرية بلعين', // Default location in Arabic
            date: activity.date,
            participants: 50, // Default participants
            image_url: activity.image_url,
            gallery_images: images,
            is_featured: false, // Default to false since DB doesn't have this field
            created_at: activity.created_at
          }
        })
        
        console.log('🔍 ACTIVITIES LIST DEBUG - Transformed activities:', transformedActivities)
        setActivities(transformedActivities)
      } else if (result.error) {
        setError(result.error)
      } else {
        setError('Unexpected response format')
      }
    } catch (error: any) {
      console.error('🔍 ACTIVITIES LIST DEBUG - Error loading activities:', error)
      setError(`Failed to load activities: ${error.message}`)
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
                <Card 
                  key={activity.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/activities/${activity.id}`)}
                >
                  {(activity.gallery_images?.length || activity.image_url) && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <ActivityImageCarousel
                        images={activity.gallery_images?.length ? activity.gallery_images : (activity.image_url ? [activity.image_url] : [])}
                        title={language === 'ar' ? activity.title_ar : activity.title_en}
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
                <Card 
                  key={activity.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/activities/${activity.id}`)}
                >
                  {(activity.gallery_images?.length || activity.image_url) && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <ActivityImageCarousel
                        images={activity.gallery_images?.length ? activity.gallery_images : (activity.image_url ? [activity.image_url] : [])}
                        title={language === 'ar' ? activity.title_ar : activity.title_en}
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