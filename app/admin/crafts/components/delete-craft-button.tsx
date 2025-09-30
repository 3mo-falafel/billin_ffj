"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteCraftButtonProps {
  itemId: string
  itemTitle: string
  type: "traditional" | "handmade" | "sale"
}

export function DeleteCraftButton({ itemId, itemTitle, type }: DeleteCraftButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
  const tableName = type === "traditional" ? "traditional_embroidery" : type === "handmade" ? "handmade_items" : "embroidery_for_sale"
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", itemId)

      if (error) {
        console.error("Error deleting item:", error)
        alert("Failed to delete item. Please try again.")
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error("Delete error:", err)
      alert("An error occurred while deleting the item.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          disabled={isDeleting}
          className="px-2"
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type === "traditional" ? "Traditional Item" : "Sale Item"}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{itemTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
