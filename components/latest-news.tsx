import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LatestNewsClient } from "./latest-news-client"

export async function LatestNews() {
  const supabase = await createClient()
  
  // Fetch news from database
  const { data: newsItems } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false })
    .limit(3)

  // If no news in database, show empty state
  if (!newsItems || newsItems.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest News</h2>
            <p className="text-lg text-muted-foreground mb-8">
              No news articles have been published yet.
            </p>
            <p className="text-sm text-muted-foreground">
              News articles can be added through the{" "}
              <Link href="/admin" className="text-palestinian-green hover:underline">
                admin dashboard
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Pass the fetched data to the client component for language handling
  return <LatestNewsClient newsItems={newsItems} />
}
