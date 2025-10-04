import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { HeroSection } from "@/components/hero-section"
import { AboutHero } from "@/components/about/about-hero"
import { OrganizationOverview } from "@/components/about/organization-overview"
import { HistorySection } from "@/components/about/history-section"
import { DocumentaryBanner } from "@/components/documentary-banner"
import { MissionVisionValues } from "@/components/about/mission-vision-values"
import { HomepageGallery } from "@/components/homepage-gallery"
import { Footer } from "@/components/footer"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <HeroSection />
      
      {/* About Section - Full About content integrated into homepage */}
      <section id="about">
        <AboutHero />
        <OrganizationOverview />
        <HistorySection />
        
        {/* Documentary Banner - between History and Mission */}
        <DocumentaryBanner />
        
        <MissionVisionValues />
      </section>
      
      <HomepageGallery />
      <Footer />
    </main>
  )
}
