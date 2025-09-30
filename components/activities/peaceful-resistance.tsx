"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Activity {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  image_url?: string
  video_url?: string
  date: string
}

export function PeacefulResistance() {
  const { language, isArabic } = useLanguage()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const supabase = createClient()
      
      // Fetch all activities and filter for peaceful resistance ones by title keywords
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.log('Error fetching activities:', error)
        setActivities([])
        return
      }
      
      // Show ALL activities for now - you can categorize them later if needed
      // Filter activities that are likely peaceful resistance based on keywords
      const allActivities = data || []
      const peacefulActivities = allActivities.filter(activity => {
        const titleEn = activity.title_en?.toLowerCase() || ''
        const titleAr = activity.title_ar || ''
        const descEn = activity.description_en?.toLowerCase() || ''
        
        return titleEn.includes('demonstration') || 
               titleEn.includes('protest') || 
               titleEn.includes('resistance') || 
               titleEn.includes('peaceful') ||
               titleAr.includes('مظاهر') ||
               titleAr.includes('مقاوم') ||
               titleAr.includes('سلمي') ||
               descEn.includes('demonstration') ||
               descEn.includes('protest')
      })
      
      // If no peaceful resistance activities found, show all activities
      const activitiesToShow = peacefulActivities.length > 0 ? peacefulActivities : allActivities
      setActivities(activitiesToShow)
    } catch (error) {
      console.error('Error fetching peaceful resistance activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading peaceful resistance activities...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Peaceful Resistance" : "المقاومة السلمية"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Our commitment to non-violent resistance through organized community action and advocacy."
              : "التزامنا بالمقاومة اللاعنفية من خلال العمل المجتمعي المنظم والمناصرة."}
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground">
            {language === "en" 
              ? "No peaceful resistance activities have been published yet." 
              : "لم يتم نشر أنشطة المقاومة السلمية بعد."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="border-border cursor-pointer hover:shadow-lg transition-shadow">
                {activity.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={activity.image_url}
                      alt={activity.title_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className={`text-xl ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? activity.title_en : activity.title_ar}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className={`text-muted-foreground leading-relaxed mb-4 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? activity.description_en : activity.description_ar}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {language === "en" ? "Learn More" : "اعرف المزيد"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className={`text-2xl ${isArabic ? "arabic-text" : "english-text"}`}>
                          {language === "en" ? activity.title_en : activity.title_ar}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {activity.image_url && (
                        <div className="aspect-video overflow-hidden rounded-lg mb-6">
                          <img
                            src={activity.image_url}
                            alt={activity.title_en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {activity.video_url && (
                        <div className="aspect-video overflow-hidden rounded-lg mb-6">
                          <video
                            src={activity.video_url}
                            controls
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      
                      <div className={`space-y-4 ${isArabic ? "arabic-text" : "english-text"}`}>
                        <p className="text-sm text-muted-foreground mb-4">
                          {new Date(activity.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {language === "en" ? activity.description_en : activity.description_ar}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
