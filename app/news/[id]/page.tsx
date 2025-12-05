import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { NewsDetail } from "@/components/news/news-detail"

interface NewsPageProps {
  params: {
    id: string
  }
}

export default function NewsArticlePage({ params }: NewsPageProps) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <NewsDetail newsId={params.id} />
    </main>
  )
}
