import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, ArrowLeft, ImageIcon, Video } from "lucide-react"

interface GalleryDetailPageProps {
  params: Promise<{ id: string }>
}

const categories: Record<string, string> = {
  resistance: "Peaceful Resistance",
  community: "Community Life",
  culture: "Cultural Events",
  farming: "Farming & Agriculture",
  international: "International Solidarity",
  general: "General",
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item, error } = await supabase.from("gallery").select("*").eq("id", id).single()

  if (error || !item) {
    notFound()
  }

  const renderVideo = (url: string) => {
    if (!url) return null
    const youTubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
    if (youTubeMatch) {
      const videoId = youTubeMatch[1]
      return (
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }
    return <video controls className="w-full rounded" src={url} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-palestinian-green">Gallery Item Details</h1>
          <p className="text-gray-600 mt-2">Review the full media information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/gallery"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
          </Button>
          <Button asChild className="bg-palestinian-green hover:bg-palestinian-green/90">
            <Link href={`/admin/gallery/${item.id}/edit`}><Edit className="w-4 h-4 mr-2" /> Edit</Link>
          </Button>
        </div>
      </div>

      <Card className="border-palestinian-green/20">
        <CardHeader>
          <CardTitle className="text-palestinian-green flex items-center gap-3 flex-wrap">
            {item.media_type === "image" ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            <span>{item.title_en || "(Untitled)"}</span>
            {item.title_ar && <span className="text-sm text-gray-600 font-arabic">{item.title_ar}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600">Category: {categories[item.category] || item.category}</div>

          <div className="w-full max-w-3xl">
            {item.media_type === "image" ? (
              <img src={item.media_url} alt={item.title_en || "Gallery image"} className="w-full rounded" />
            ) : (
              renderVideo(item.media_url)
            )}
          </div>

          {(item.description_en || item.description_ar) && (
            <div className="grid md:grid-cols-2 gap-6">
              {item.description_en && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-palestinian-green">Description (EN)</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{item.description_en}</p>
                </div>
              )}
              {item.description_ar && (
                <div className="space-y-2 text-right font-arabic" dir="rtl">
                  <h3 className="font-semibold text-palestinian-green">الوصف بالعربية</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{item.description_ar}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
