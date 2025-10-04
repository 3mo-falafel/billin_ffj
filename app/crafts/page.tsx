import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { Footer } from "@/components/footer"
import { CraftsClientContent } from "@/components/crafts/crafts-client-content"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: "Bilin Traditional Embroidery | Palestinian Cultural Heritage",
  description: "Discover authentic Palestinian embroidery (tatreez) from Bil'in village. Traditional techniques passed down through generations.",
}

export default async function CraftsPage() {
  const supabase = await createClient()

  // Fetch showcase items (traditional embroidery only) and for-sale items
  const [{ data: traditionalItems }, { data: saleItems }] = await Promise.all([
    supabase
      .from("traditional_embroidery")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("embroidery_for_sale")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false }),
  ])

  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsTicker />
      <CraftsClientContent 
        traditionalItems={traditionalItems || []}
        handmadeItems={[]}
        saleItems={saleItems || []}
      />
      <Footer />
    </main>
  )
}
