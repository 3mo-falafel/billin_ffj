"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Loader2 } from "lucide-react"
import { SaleForm } from "../components"
import { createClient } from "@/lib/supabase/client"

export default function EditSaleItemPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [saleItem, setSaleItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSaleItem = async () => {
      try {
        const { data, error } = await supabase
          .from("embroidery_for_sale")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) {
          console.error("Error fetching sale item:", error)
          setError("Failed to load sale item")
        } else {
          setSaleItem(data)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("An error occurred while loading the sale item")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSaleItem()
    }
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F5F0] to-[#F0EDE8] embroidery-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-[#DAA520] mx-auto" />
              <div className="text-lg text-gray-600">Loading sale item...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !saleItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F5F0] to-[#F0EDE8] embroidery-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="text-6xl text-gray-300">📦</div>
              <div className="text-xl text-gray-600">
                {error || "Sale item not found"}
              </div>
              <Link href="/admin/crafts">
                <Button className="bg-[#DAA520] hover:bg-[#B8941C] text-black">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Crafts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F5F0] to-[#F0EDE8] embroidery-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/crafts">
              <Button variant="outline" className="border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520] hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Crafts
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#DAA520] to-[#B8941C] rounded-lg">
              <Package className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">
                Edit Sale Item
              </h1>
              <p className="text-gray-600">
                Update embroidery item details, pricing, and contact information
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#DAA520]/20 p-8">
            <SaleForm initialData={saleItem} isEditing={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
