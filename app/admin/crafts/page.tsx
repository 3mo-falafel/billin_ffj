import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scissors, ShoppingBag, Plus, Edit, Trash2, Star, ImageIcon } from "lucide-react"
import Link from "next/link"
import { DeleteCraftButton, ToggleFeaturedButton } from "./components"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CraftsAdminPage() {
  const supabase = await createClient()

  // Fetch traditional embroidery items (showcase only)
  const { data: traditionalItems, error: traditionalError } = await supabase
    .from("traditional_embroidery")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch handmade items (also part of showcase)
  const { data: handmadeItems, error: handmadeError } = await supabase
    .from("handmade_items")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch embroidery for sale items
  const { data: saleItems, error: saleError } = await supabase
    .from("embroidery_for_sale")
    .select("*")
    .order("created_at", { ascending: false })

  if (traditionalError) {
    console.error("Error fetching traditional embroidery:", traditionalError)
  }

  if (saleError) {
    console.error("Error fetching embroidery for sale:", saleError)
  }

  if (handmadeError) {
    console.error("Error fetching handmade items:", handmadeError)
  }

  const totalItems = (traditionalItems?.length || 0) + (handmadeItems?.length || 0) + (saleItems?.length || 0)
  const featuredItems = [...(traditionalItems || []), ...(handmadeItems || []), ...(saleItems || [])].filter(item => item.is_featured).length
  const showcaseItems = [...(traditionalItems || []), ...(handmadeItems || [])]

  return (
    <div className="space-y-8 relative">
      {/* Palestinian Embroidery Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 cross-stitch-bg"></div>
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crafts & Tatreez Management</h1>
          <p className="text-gray-600 mt-2">
            Manage traditional embroidery showcase and items for sale
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button asChild className="bg-[#C8102E] hover:bg-[#A50D24] text-white shadow-lg">
            <Link href="/admin/crafts/traditional/new">
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Traditional Item
            </Link>
          </Button>
          <Button asChild className="bg-[#C8102E] hover:bg-[#A50D24] text-white shadow-lg">
            <Link href="/admin/crafts/handmade/new">
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Handmade Item
            </Link>
          </Button>
          <Button asChild className="bg-[#DAA520] hover:bg-[#B8941C] text-black shadow-lg">
            <Link href="/admin/crafts/sale/new">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add Sale Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[#C8102E] shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Scissors className="h-4 w-4 text-[#C8102E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#C8102E]">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {traditionalItems?.length || 0} traditional + {handmadeItems?.length || 0} handmade + {saleItems?.length || 0} for sale
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#DAA520] shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
            <Star className="h-4 w-4 text-[#DAA520]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#DAA520]">{featuredItems}</div>
            <p className="text-xs text-muted-foreground">
              Currently featured on website
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#006233] shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#006233]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006233]">2</div>
            <p className="text-xs text-muted-foreground">
              Traditional & For Sale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Showcase Section (Traditional + Handmade) */}
      <Card className="relative z-10 shadow-xl border-t-4 border-t-[#C8102E]">
        <CardHeader className="bg-gradient-to-r from-[#C8102E]/10 to-[#DAA520]/10 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-[#C8102E]" />
              <CardTitle className="text-xl text-[#C8102E]">Showcase: Traditional & Handmade</CardTitle>
            </div>
            <Button asChild variant="outline" size="sm" className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white">
              <Link href="/admin/crafts/traditional/new">
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-600">Showcase only: pictures and descriptions (no price)</p>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-br from-[#F8F5F0] to-white">
          {showcaseItems && showcaseItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseItems.map((item) => {
                const isTraditional = !!traditionalItems?.find(t => t.id === item.id)
                const type = isTraditional ? "traditional" : "handmade" as const
                const editUrl = isTraditional ? `/admin/crafts/traditional/${item.id}` : `/admin/crafts/handmade/${item.id}`
                return (
                  <CraftCard
                    key={item.id}
                    item={item}
                    type={type}
                    editUrl={editUrl}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-[#C8102E] opacity-30" />
              <h3 className="text-lg font-medium mb-2">No showcase items yet</h3>
              <p className="mb-4">Start showcasing traditional or handmade Palestinian crafts</p>
              <Button asChild className="bg-[#C8102E] hover:bg-[#A50D24] text-white">
                <Link href="/admin/crafts/traditional/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embroidery for Sale Section */}
      <Card className="relative z-10 shadow-xl border-t-4 border-t-[#DAA520]">
        <CardHeader className="bg-gradient-to-r from-[#DAA520]/10 to-[#006233]/10 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#DAA520]" />
              <CardTitle className="text-xl text-[#DAA520]">Embroidery to Buy</CardTitle>
            </div>
            <Button asChild variant="outline" size="sm" className="border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520] hover:text-black">
              <Link href="/admin/crafts/sale/new">
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-600">Items available for purchase - Include prices and contact information</p>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-br from-[#F8F5F0] to-white">
          {saleItems && saleItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleItems.map((item) => (
                <CraftCard 
                  key={item.id} 
                  item={item} 
                  type="sale"
                  editUrl={`/admin/crafts/sale/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#DAA520] opacity-30" />
              <h3 className="text-lg font-medium mb-2">No sale items yet</h3>
              <p className="mb-4">Start adding embroidery items for sale</p>
              <Button asChild className="bg-[#DAA520] hover:bg-[#B8941C] text-black">
                <Link href="/admin/crafts/sale/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CraftCard({ item, type, editUrl }: { item: any, type: "traditional" | "handmade" | "sale", editUrl: string }) {
  const isTraditional = type === "traditional"
  const cardColor = isTraditional ? "#C8102E" : "#DAA520"
  
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-current" style={{ borderColor: cardColor + "20" }}>
      <div className="aspect-square bg-gradient-to-br from-[#F8F5F0] to-gray-100 relative">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title_en} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isTraditional ? (
              <ImageIcon className="w-16 h-16 text-gray-300" />
            ) : (
              <ShoppingBag className="w-16 h-16 text-gray-300" />
            )}
          </div>
        )}
        
        {item.is_featured && (
          <div className="absolute top-3 right-3">
            <Badge className="shadow-lg" style={{ backgroundColor: cardColor, color: isTraditional ? 'white' : 'black' }}>
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
        
        {!item.is_active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Inactive</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: cardColor }}>
          {item.title_en || "Untitled"}
        </h3>
        
        {item.title_ar && (
          <h4 className="text-gray-600 text-right font-medium mb-2" dir="rtl">
            {item.title_ar}
          </h4>
        )}
        
        {item.description_en && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {item.description_en}
          </p>
        )}
        
  {type === "sale" && (
          <div className="space-y-2 mb-4">
            {item.price && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="font-bold text-[#DAA520]">${item.price}</span>
              </div>
            )}
            
            {item.contact_url && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact:</span>
                <a href={item.contact_url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#006233] hover:underline">
                  Link
                </a>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1" style={{ backgroundColor: cardColor, color: isTraditional ? 'white' : 'black' }}>
            <Link href={editUrl}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Link>
          </Button>
          
          <ToggleFeaturedButton 
            itemId={item.id} 
            isFeatured={item.is_featured}
            type={type}
          />
          
          <DeleteCraftButton 
            itemId={item.id} 
            itemTitle={item.title_en}
            type={type}
          />
        </div>
      </CardContent>
    </Card>
  )
}
