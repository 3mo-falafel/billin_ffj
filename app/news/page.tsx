import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { NewsHero } from "@/components/news/news-hero"
import { LatestUpdates } from "@/components/news/latest-updates"

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <NewsHero />
      <LatestUpdates />
    </main>
  )
}
