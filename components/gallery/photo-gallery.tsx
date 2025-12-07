"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
  thumbnail?: string  // First image as thumbnail
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
  const [loadingAlbum, setLoadingAlbum] = useState(false)
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
        // Use with_thumbnails=true to get albums with first image as thumbnail
        const response = await fetch('/api/gallery?media_type=image&active=true&with_thumbnails=true')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (isMounted) {
          if (result.data && result.mode === 'albums_with_thumbnails') {
            // Data is already grouped into albums with thumbnails
            const albums: PhotoAlbum[] = result.data.map((item: any) => ({
              id: item.id,
              title: item.title_en || 'Untitled Album',
              location: 'Bil\'in, Palestine',
              images: Array(item.imageCount).fill('placeholder'), // Placeholder array for count
              thumbnail: item.thumbnail, // First image as thumbnail
              category: item.category || 'general',
              created_at: item.created_at || ''
            }))
            setPhotoAlbums(albums)
          } else if (result.error) {
            setError(result.error)
          } else {
            setError('Unexpected response format')
          }
        }
      } catch (e: any) {
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

  // Keyboard navigation for gallery viewer
  useEffect(() => {
    if (!selectedAlbum) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevImage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextImage()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedAlbum(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedAlbum, currentImageIndex])

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

  // Load album images on demand when an album is clicked
  const openAlbum = async (album: PhotoAlbum) => {
    setLoadingAlbum(true)
    setCurrentImageIndex(0)
    
    try {
      // Fetch the actual images for this album
      const response = await fetch(`/api/gallery/album?title=${encodeURIComponent(album.title)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.data && result.data.length > 0) {
        // Update album with real image URLs
        const albumWithImages: PhotoAlbum = {
          ...album,
          images: result.data.map((img: { media_url: string }) => img.media_url)
        }
        setSelectedAlbum(albumWithImages)
      } else {
        // Fallback: show album without images
        setSelectedAlbum(album)
      }
    } catch (error) {
      console.error('Error loading album images:', error)
      setSelectedAlbum(album)
    } finally {
      setLoadingAlbum(false)
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
            <Card key={album.id} className="border-border overflow-hidden group cursor-pointer" onClick={() => openAlbum(album)}>
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {/* Show thumbnail if available, otherwise placeholder */}
                {album.thumbnail ? (
                  <img
                    src={album.thumbnail}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.querySelector('.placeholder-icon')?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="placeholder-icon hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center absolute inset-0">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {album.images.length > 0 && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
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

        {/* Loading overlay when opening album */}
        {loadingAlbum && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700">{language === 'en' ? 'Loading album...' : 'جاري تحميل الألبوم...'}</p>
            </div>
          </div>
        )}        {/* Pagination */}
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

        {/* Album Modal - Enhanced Lightbox Viewer */}
        {selectedAlbum && (
          <div 
            className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8"
            onClick={() => setSelectedAlbum(null)}
          >
            <div 
              className="w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Controls */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex-1">
                  <h2 className={`text-lg md:text-xl font-bold text-gray-900 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {selectedAlbum.title}
                  </h2>
                  <p className={`text-sm text-gray-600 ${isArabic ? "arabic-text" : "english-text"}`}>
                    📍 {selectedAlbum.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => downloadImage(selectedAlbum.images[currentImageIndex], `${selectedAlbum.title}-${currentImageIndex + 1}.jpg`)}
                    variant="outline"
                    size="sm"
                    className="bg-white shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">{language === 'en' ? 'Download' : 'تحميل'}</span>
                  </Button>
                  <Button
                    onClick={() => setSelectedAlbum(null)}
                    variant="outline"
                    size="sm"
                    className="bg-white shadow-md hover:shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Main Image Viewer - Takes up 80% of viewport */}
              {selectedAlbum.images.length > 0 && (
                <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-2xl mb-4">
                  <img
                    key={currentImageIndex}
                    src={selectedAlbum.images[currentImageIndex]}
                    alt={`${selectedAlbum.title} - Image ${currentImageIndex + 1} of ${selectedAlbum.images.length}`}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: 'auto' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Unavailable%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  
                  {/* Navigation Buttons */}
                  {selectedAlbum.images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                        variant="outline"
                        size="sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                        variant="outline"
                        size="sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        {currentImageIndex + 1} / {selectedAlbum.images.length}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Thumbnail Strip - Fixed height, scrollable */}
              {selectedAlbum.images.length > 1 && (
                <div className="bg-white rounded-lg shadow-lg p-3 overflow-x-auto overflow-y-hidden">
                  <div className="flex gap-3 min-w-max">
                    {selectedAlbum.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`relative flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none ${
                          index === currentImageIndex 
                            ? 'ring-4 ring-blue-500 scale-105 shadow-xl' 
                            : 'ring-2 ring-gray-300 hover:ring-blue-400 hover:scale-105 shadow-md'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`View image ${index + 1} of ${selectedAlbum.images.length}`}
                      >
                        {/* Thumbnail Image */}
                        <img
                          src={image}
                          alt={`${selectedAlbum.title} - Image ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="eager"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="14" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + (index + 1) + '%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        
                        {/* Active indicator overlay */}
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-blue-500/20 pointer-events-none"></div>
                        )}
                        
                        {/* Hover overlay with download button */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-200 flex items-center justify-center group">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadImage(image, `${selectedAlbum.title}-${index + 1}.jpg`)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-7 w-7 p-0 bg-white/95 hover:bg-white shadow-lg"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
