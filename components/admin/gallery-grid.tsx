"use client"

import { useState } from "react"
// API calls will use fetch instead of Supabase
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, ImageIcon, Video, Plus } from "lucide-react"
import Link from "next/link"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GalleryItem {
  id: string
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  media_url: string
  media_type: "image" | "video"
  category: string
  created_at: string
}

interface GalleryGridProps {
  gallery: GalleryItem[]
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "resistance", label: "Peaceful Resistance" },
  { value: "community", label: "Community Life" },
  { value: "culture", label: "Cultural Events" },
  { value: "farming", label: "Farming & Agriculture" },
  { value: "international", label: "International Solidarity" },
  { value: "general", label: "General" },
]

export function GalleryGrid({ gallery }: GalleryGridProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete gallery item: ${await response.text()}`)
      }
      
      router.refresh()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredGallery =
    selectedCategory === "all" ? gallery : gallery.filter((item) => item.category === selectedCategory)

  if (gallery.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media yet</h3>
          <p className="text-gray-500 text-center mb-4">Get started by uploading your first photo or video.</p>
          <Button asChild className="bg-palestinian-green hover:bg-palestinian-green/90">
            <Link href="/admin/gallery/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
          Filter by category:
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {filteredGallery.length} {filteredGallery.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGallery.map((item) => (
          <Card key={item.id} className="border-palestinian-green/20 overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              {item.media_type === "image" ? (
                <img
                  src={item.media_url || "/placeholder.svg"}
                  alt={item.title_en || "Gallery image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Video className="w-12 h-12 text-gray-400" />
                  <video
                    src={item.media_url}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge variant={item.media_type === "image" ? "default" : "secondary"}>
                  {item.media_type === "image" ? (
                    <ImageIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <Video className="w-3 h-3 mr-1" />
                  )}
                  {item.media_type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-white/90">
                  {categories.find((cat) => cat.value === item.category)?.label || item.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                {item.title_en && (
                  <h3 className="font-medium text-sm text-palestinian-green line-clamp-1">{item.title_en}</h3>
                )}
                {item.title_ar && (
                  <p className="text-sm text-gray-600 font-arabic text-right line-clamp-1">{item.title_ar}</p>
                )}
                {item.description_en && <p className="text-xs text-gray-500 line-clamp-2">{item.description_en}</p>}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/gallery/${item.id}`}>
                      <Eye className="w-3 h-3" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/gallery/${item.id}/edit`}>
                      <Edit className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Media</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this {item.media_type}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting === item.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
