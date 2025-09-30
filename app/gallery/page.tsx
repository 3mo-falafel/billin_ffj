import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { GalleryHero } from "@/components/gallery/gallery-hero"
import { PhotoGallery } from "@/components/gallery/photo-gallery"
import { VideoGallery } from "@/components/gallery/video-gallery"

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <GalleryHero />
      <PhotoGallery />
      <VideoGallery />
    </main>
  )
}
