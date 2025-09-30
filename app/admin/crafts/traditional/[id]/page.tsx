"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Palette, Loader2 } from "lucide-react"
import { TraditionalForm } from "../components/traditional-form"
import { createClient } from "@/lib/supabase/client"

export default function EditTraditionalItemPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [traditionalItem, setTraditionalItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTraditionalItem = async () => {
      try {
        const { data, error } = await supabase
          .from("traditional_embroidery")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) {
          console.error("Error fetching traditional item:", error)
          setError("Failed to load traditional embroidery item")
        } else {
          setTraditionalItem(data)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("An error occurred while loading the traditional embroidery item")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTraditionalItem()
    }
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F5F0] to-[#F0EDE8] embroidery-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-[#C8102E] mx-auto" />
              <div className="text-lg text-gray-600">Loading traditional embroidery...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !traditionalItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F5F0] to-[#F0EDE8] embroidery-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="text-6xl text-gray-300">🎨</div>
              <div className="text-xl text-gray-600">
                {error || "Traditional embroidery item not found"}
              </div>
              <Link href="/admin/crafts">
                <Button className="bg-[#C8102E] hover:bg-[#A50D24] text-white">
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
              <Button variant="outline" className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Crafts
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#C8102E] to-[#A50D24] rounded-lg">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">
                Edit Traditional Embroidery
              </h1>
              <p className="text-gray-600">
                Update traditional embroidery showcase information
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#C8102E]/20 p-8">
            <TraditionalForm initialData={traditionalItem} isEditing={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
