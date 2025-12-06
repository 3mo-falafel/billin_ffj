"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { Camera, Eye, X, ChevronLeft, ChevronRight, Download } from "lucide-react"
// Using API endpoints instead of Supabase client

interface PhotoAlbum {
  id: string
  title: string
  location: string
  images: string[]
  category: string
  created_at: string
}

interface GalleryItem {
  id: string
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  media_url: string
  media_type: "image" | "video"
  category: string
  created_at?: string
}

const CATEGORY_DEFS = [
  { value: "all", label: { en: "All Photos", ar: "جميع الصور" } },
  { value: "resistance", label: { en: "Peaceful Resistance", ar: "المقاومة السلمية" } },
  { value: "community", label: { en: "Community Life", ar: "الحياة المجتمعية" } },
  { value: "culture", label: { en: "Cultural Events", ar: "الفعاليات الثقافية" } },
  { value: "farming", label: { en: "Farming & Agriculture", ar: "الزراعة" } },
  { value: "international", label: { en: "International Solidarity", ar: "التضامن الدولي" } },
  { value: "general", label: { en: "General", ar: "عام" } },
]

export function PhotoGallery() {
  const { language, isArabic } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        console.log('🔍 GALLERY PUBLIC DEBUG - Loading gallery photos from API...')
        
        const response = await fetch('/api/gallery?media_type=image&active=true')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('🔍 GALLERY PUBLIC DEBUG - API response:', result)
        
        if (isMounted) {
          if (result.data) {
            const data = result.data
            console.log('🔍 GALLERY PUBLIC DEBUG - Raw gallery data:', data.length, 'items')
            
            // Group photos by title to create albums
            const albumMap = new Map<string, PhotoAlbum>()
            
            data.forEach((item: GalleryItem) => {
              const key = item.title_en || 'Untitled Album'
              if (!albumMap.has(key)) {
                albumMap.set(key, {
                  id: item.id,
                  title: item.title_en || 'Untitled Album',
                  location: 'Bil\'in, Palestine',
                  images: [],
                  category: item.category || 'general',
                  created_at: item.created_at || ''
                })
              }
              if (item.media_url) {
                console.log('🔍 GALLERY PUBLIC DEBUG - Adding image to album:', key, 'URL length:', item.media_url.length)
                albumMap.get(key)!.images.push(item.media_url)
              }
            })
            
            const albums = Array.from(albumMap.values())
            console.log('🔍 GALLERY PUBLIC DEBUG - Created albums:', albums.length, 'albums')
            setPhotoAlbums(albums)
          } else if (result.error) {
            console.error('🔍 GALLERY PUBLIC DEBUG - API error:', result.error)
            setError(result.error)
          } else {
            console.error('🔍 GALLERY PUBLIC DEBUG - Unexpected response format')
            setError('Unexpected response format')
          }
        }
      } catch (e: any) {
        console.error('🔍 GALLERY PUBLIC DEBUG - Error loading gallery:', e)
        if (isMounted) setError(e.message || "Failed to load gallery")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = selectedCategory === "all" ? photoAlbums : photoAlbums.filter(p => p.category === selectedCategory)
  
  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedAlbums = filtered.slice(startIndex, endIndex)
  
  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const nextImage = () => {
    if (selectedAlbum && selectedAlbum.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAlbum.images.length)
    }
  }

  const prevImage = () => {
    if (selectedAlbum && selectedAlbum.images.length > 0) {
      setCurrentImageIndex((prev) => prev === 0 ? selectedAlbum.images.length - 1 : prev - 1)
    }
  }

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      let blob: Blob
      
      if (imageUrl.startsWith('data:')) {
        // Handle base64 data URLs
        const response = await fetch(imageUrl)
        blob = await response.blob()
      } else {
        // Handle regular URLs
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        blob = await response.blob()
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'image.jpg'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      alert(language === 'en' ? 'Failed to download image' : 'فشل في تحميل الصورة')
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "en" ? "Photo Gallery" : "معرض الصور"}
            </h2>
          </div>
          {!loading && photoAlbums.length === 0 && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "No photo albums have been added yet. Add items from the admin dashboard."
                : "لم تتم إضافة ألبومات صور بعد. أضف العناصر من لوحة الإدارة."}
            </p>
          )}
          {loading && (
            <p className="text-muted-foreground">
              {language === "en" ? "Loading photos..." : "جاري تحميل الصور..."}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {language === "en" ? error : "تعذر تحميل المعرض"}
            </p>
          )}
        </div>

        {photoAlbums.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORY_DEFS.map(cat => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className={isArabic ? "arabic-text" : "english-text"}
              >
                {cat.label[language]}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedAlbums.map(album => (
            <Card key={album.id} className="border-border overflow-hidden group cursor-pointer" onClick={() => setSelectedAlbum(album)}>
              <div className="relative aspect-video overflow-hidden">
                {album.images.length > 0 ? (
                  <img
                    src={album.images[0]}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {album.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {album.images.length} photos
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className={`font-semibold text-foreground mb-2 ${isArabic ? "arabic-text" : "english-text"}`}>
                  {album.title}
                </h3>
                <p className={`text-sm text-muted-foreground ${isArabic ? "arabic-text" : "english-text"}`}>
                  📍 {album.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {language === "en" ? "Previous" : "السابق"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {language === "en" 
                ? `Page ${currentPage} of ${totalPages}` 
                : `صفحة ${currentPage} من ${totalPages}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {language === "en" ? "Next" : "التالي"}
            </Button>
          </div>
        )}

        {/* Album Modal */}
        {selectedAlbum && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
               onClick={() => setSelectedAlbum(null)}>
            <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto relative"
                 onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <Button
                  onClick={() => downloadImage(selectedAlbum.images[currentImageIndex], `${selectedAlbum.title}-${currentImageIndex + 1}.jpg`)}
                  variant="outline"
                  size="sm"
                  className="bg-white bg-opacity-90 hover:bg-opacity-100"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'Download' : 'تحميل'}
                </Button>
                <Button
                  onClick={() => setSelectedAlbum(null)}
                  variant="outline"
                  size="sm"
                  className="bg-white bg-opacity-90 hover:bg-opacity-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Image Gallery */}
              {selectedAlbum.images.length > 0 && (
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={selectedAlbum.images[currentImageIndex]}
                    alt={selectedAlbum.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  {selectedAlbum.images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        variant="outline"
                        size="sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        variant="outline"
                        size="sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedAlbum.images.length}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedAlbum.title}
                  </h2>
                  <p className="text-gray-600">
                    📍 {selectedAlbum.location}
                  </p>
                </div>

                {/* Thumbnail Grid */}
                {selectedAlbum.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {selectedAlbum.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${selectedAlbum.title} ${index + 1}`}
                          className={`w-full h-16 object-cover rounded cursor-pointer border-2 ${
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadImage(image, `${selectedAlbum.title}-${index + 1}.jpg`)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
