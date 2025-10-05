"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/api/client"

interface GalleryItem {
  id: number
  title_en: string
  title_ar: string
  image_url: string
  alt_text: string
  display_order: number
}

export function HomepageGallery() {
  const { language } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch gallery items from database
  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        const api = createClient()
        const { data, error } = await api.homepageGallery.getAll({ active: true })

        if (error) {
          console.error('Error fetching gallery items:', error)
          // Fallback to default items if database fails
          setGalleryItems([
            {
              id: 1,
              title_en: "Olive Harvest",
              title_ar: "قطف الزيتون",
              image_url: "/olive-harvest.png",
              alt_text: "Olive Harvest in Bil'in",
              display_order: 1
            },
            {
              id: 2,
              title_en: "Peaceful Resistance",
              title_ar: "المقاومة السلمية",
              image_url: "/peaceful-demonstration.png",
              alt_text: "Peaceful Demonstration",
              display_order: 2
            }
          ])
        } else {
          setGalleryItems(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
        // Fallback to default items
        setGalleryItems([
          {
            id: 1,
            title_en: "Olive Harvest",
            title_ar: "قطف الزيتون",
            image_url: "/olive-harvest.png",
            alt_text: "Olive Harvest in Bil'in",
            display_order: 1
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  // Auto-change images every 4 seconds
  useEffect(() => {
    if (galleryItems.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % galleryItems.length
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [galleryItems.length])

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % galleryItems.length
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryItems.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto mb-8"></div>
              <div className="aspect-[16/10] bg-gray-300 dark:bg-gray-600 rounded-xl max-w-4xl mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (galleryItems.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'لا توجد صور متاحة حالياً' : 'No gallery items available'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const currentImage = galleryItems[currentImageIndex]

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'لحظات من نضالنا السلمي وأنشطتنا المجتمعية في قرية بلعين'
              : 'Moments from our peaceful struggle and community activities in Bil\'in village'
            }
          </p>
        </div>

        {/* Gallery Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Image Display */}
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || currentImage.title_en}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out"
            />
            
            {/* Image Overlay with Title */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl md:text-2xl font-semibold">
                {language === 'ar' ? currentImage.title_ar : currentImage.title_en}
              </h3>
            </div>

            {/* Navigation Arrows - Only show if more than 1 image */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
                  aria-label="Next image"
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Image Indicators - Only show if more than 1 image */}
          {galleryItems.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-red-600 scale-110'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-red-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-12">
          <Link href="/gallery">
            <Button 
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              {language === 'ar' ? 'استكشف جميع الصور' : 'Explore All Gallery'}
              <ArrowRight className={`w-5 h-5 ml-2 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
          </Link>
        </div>

        {/* Palestinian Flag Accent */}
        <div className="mt-8 mx-auto max-w-md h-1 bg-gradient-to-r from-red-600 via-white to-green-600 rounded-full" />
      </div>
    </section>
  )
}
