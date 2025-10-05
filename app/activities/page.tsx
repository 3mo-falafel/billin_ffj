import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { ActivitiesHero } from "@/components/activities/activities-hero"
import { ActivitiesList } from "@/components/activities/activities-list"
import { PeacefulResistance } from "@/components/activities/peaceful-resistance"
import { EducationalPrograms } from "@/components/activities/educational-programs"

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <ActivitiesHero />
      <ActivitiesList />
      <PeacefulResistance />
      <EducationalPrograms />
    </main>
  )
}
