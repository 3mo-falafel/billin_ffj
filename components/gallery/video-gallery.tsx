"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { Play, Video, Clock } from "lucide-react"
// Using API endpoints instead of Supabase client

interface GalleryVideo {
  id: string
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  media_url: string
  media_type: "image" | "video"
  category: string
  created_at?: string
  cover_image?: string
}

export function VideoGallery() {
  const { language, isArabic } = useLanguage()
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        console.log('🔍 VIDEO GALLERY PUBLIC DEBUG - Loading videos from API...')
        
        const response = await fetch('/api/gallery?media_type=video&active=true')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('🔍 VIDEO GALLERY PUBLIC DEBUG - API response:', result)
        
        if (active) {
          if (result.data) {
            const data = result.data
            console.log('🔍 VIDEO GALLERY PUBLIC DEBUG - Raw video data:', data.length, 'items')
            
            // Extract cover images from description field
            const videosWithCovers = data.map((video: GalleryVideo) => {
              const coverMatch = video.description_en?.match(/COVER_IMAGE:([^|]+)/);
              const coverImage = coverMatch ? coverMatch[1] : null;
              
              // Clean description by removing cover image info
              const cleanDescription = video.description_en?.replace(/\s*\|\s*COVER_IMAGE:[^|]+/, '') || '';
              const cleanDescriptionAr = video.description_ar?.replace(/\s*\|\s*COVER_IMAGE:[^|]+/, '') || '';
              
              return {
                ...video,
                cover_image: coverImage,
                description_en: cleanDescription,
                description_ar: cleanDescriptionAr
              };
            });
            
            console.log('🔍 VIDEO GALLERY PUBLIC DEBUG - Processed videos:', videosWithCovers.length, 'videos')
            setVideos(videosWithCovers);
          } else if (result.error) {
            console.error('🔍 VIDEO GALLERY PUBLIC DEBUG - API error:', result.error)
            setError(result.error)
          } else {
            console.error('🔍 VIDEO GALLERY PUBLIC DEBUG - Unexpected response format')
            setError('Unexpected response format')
          }
        }
      } catch (e: any) {
        console.error('🔍 VIDEO GALLERY PUBLIC DEBUG - Error loading videos:', e)
        if (active) setError(e.message || "Failed to load videos")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "en" ? "Video Gallery" : "معرض الفيديو"}
            </h2>
          </div>
          {loading && (
            <p className="text-muted-foreground">
              {language === "en" ? "Loading videos..." : "جاري تحميل الفيديوهات..."}
            </p>
          )}
          {!loading && videos.length === 0 && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "No videos have been added yet. Add items from the admin dashboard."
                : "لم تتم إضافة فيديوهات بعد. أضف العناصر من لوحة الإدارة."}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {language === "en" ? error : "تعذر تحميل الفيديوهات"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, idx) => (
            <Card
              key={video.id}
              className={`border-border overflow-hidden group ${idx === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="relative aspect-video overflow-hidden">
                {video.cover_image ? (
                  <img
                    src={video.cover_image}
                    alt={video.title_en || video.title_ar || "Video"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center hidden">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                    <p className="text-lg font-semibold">{video.title_en || video.title_ar || "Video"}</p>
                    <p className="text-sm opacity-80">Click to watch</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-black"
                    onClick={() => window.open(video.media_url, '_blank')}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {language === "en" ? "Watch Video" : "شاهد الفيديو"}
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {/* Duration unknown without metadata; keep placeholder dash */}
                  --:--
                </div>
              </div>
              <CardContent className="p-6">
                {(video.title_en || video.title_ar) && (
                  <h3 className={`text-xl font-bold text-foreground mb-3 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {(language === "en" ? video.title_en : video.title_ar) || video.title_en || video.title_ar}
                  </h3>
                )}
                {(video.description_en || video.description_ar) && (
                  <p className={`text-muted-foreground leading-relaxed ${isArabic ? "arabic-text" : "english-text"}`}>
                    {(language === "en" ? video.description_en : video.description_ar) || ""}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
