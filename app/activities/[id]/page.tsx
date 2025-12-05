import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { ActivityDetail } from "@/components/activities/activity-detail"

interface ActivityPageProps {
  params: {
    id: string
  }
}

export default function ActivityPage({ params }: ActivityPageProps) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <ActivityDetail activityId={params.id} />
    </main>
  )
}
