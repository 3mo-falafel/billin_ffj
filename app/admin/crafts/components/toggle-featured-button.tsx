"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, StarOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ToggleFeaturedButtonProps {
  itemId: string
  isFeatured: boolean
  type: "traditional" | "handmade" | "sale"
}

export function ToggleFeaturedButton({ itemId, isFeatured, type }: ToggleFeaturedButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async () => {
    setIsUpdating(true)
    try {
  const tableName = type === "traditional" ? "traditional_embroidery" : type === "handmade" ? "handmade_items" : "embroidery_for_sale"
      const { error } = await supabase
        .from(tableName)
        .update({ is_featured: !isFeatured })
        .eq("id", itemId)

      if (error) {
        console.error("Error updating featured status:", error)
        alert("Failed to update featured status. Please try again.")
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error("Update error:", err)
      alert("An error occurred while updating the item.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Button
      variant={isFeatured ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isUpdating}
      className="px-2"
    >
      {isUpdating ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isFeatured ? (
        <Star className="w-3 h-3 fill-current" />
      ) : (
        <StarOff className="w-3 h-3" />
      )}
    </Button>
  )
}
