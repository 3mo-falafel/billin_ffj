import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Edit, ArrowLeft, ImageIcon, Video } from "lucide-react"

interface ActivityDetailPageProps { params: Promise<{ id: string }> }

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: activity, error } = await supabase.from("activities").select("*").eq("id", id).single()
  if (error || !activity) notFound()

  const formattedDate = new Date(activity.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  function renderVideo(url?: string | null) {
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
          <h1 className="text-3xl font-bold text-palestinian-green">Activity Details</h1>
          <p className="text-gray-600 mt-2">Review the full activity information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/activities"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
          </Button>
          <Button asChild className="bg-palestinian-green hover:bg-palestinian-green/90">
            <Link href={`/admin/activities/${activity.id}/edit`}><Edit className="w-4 h-4 mr-2" /> Edit</Link>
          </Button>
        </div>
      </div>
      <Card className="border-palestinian-green/20">
        <CardHeader>
          <CardTitle className="text-palestinian-green flex items-center gap-3 flex-wrap">
            <span>{activity.title_en}</span>
            <span className="text-sm text-gray-600 font-arabic">{activity.title_ar}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center text-sm text-gray-600"><Calendar className="w-4 h-4 mr-2" /> {formattedDate}</div>
          {(activity.image_url || activity.video_url) && (
            <div className="grid md:grid-cols-2 gap-6">
              {activity.image_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-palestinian-green"><ImageIcon className="w-4 h-4" /> Image</div>
                  <img 
                    src={activity.image_url} 
                    alt={activity.title_en} 
                    className="w-full rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
              )}
              {activity.video_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-palestinian-green"><Video className="w-4 h-4" /> Video</div>
                  {renderVideo(activity.video_url)}
                </div>
              )}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-palestinian-green">Description (EN)</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">{activity.description_en}</p>
            </div>
            <div className="space-y-2 text-right font-arabic" dir="rtl">
              <h3 className="font-semibold text-palestinian-green">الوصف بالعربية</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">{activity.description_ar}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
