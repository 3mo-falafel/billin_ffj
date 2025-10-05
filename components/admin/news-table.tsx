"use client"

import { useState } from "react"
// API calls will use fetch instead of Supabase
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Calendar, Plus, Star } from "lucide-react"
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

interface NewsArticle {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  video_url?: string
  date: string
  featured: boolean
  created_at: string
}

interface NewsTableProps {
  news: NewsArticle[]
}

export function NewsTable({ news }: NewsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete news: ${await response.text()}`)
      }
      
      router.refresh()
    } catch (error) {
      console.error("Error deleting news:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    setIsTogglingFeatured(id)
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentFeatured })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to toggle featured: ${await response.text()}`)
      }
      
      router.refresh()
    } catch (error) {
      console.error("Error toggling featured:", error)
    } finally {
      setIsTogglingFeatured(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles yet</h3>
          <p className="text-gray-500 text-center mb-4">Get started by creating your first news article.</p>
          <Button asChild className="bg-palestinian-green hover:bg-palestinian-green/90">
            <Link href="/admin/news/new">
              <Plus className="w-4 h-4 mr-2" />
              Add News Article
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {news.map((article) => (
        <Card
          key={article.id}
          className={`border-palestinian-green/20 ${article.featured ? "ring-2 ring-palestinian-gold/50" : ""}`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-palestinian-green">{article.title_en}</CardTitle>
                  {article.featured && (
                    <Badge className="bg-palestinian-gold text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-arabic text-right">{article.title_ar}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(article.date)}
                  </span>
                  {article.image_url && <Badge variant="secondary">Image</Badge>}
                  {article.video_url && <Badge variant="secondary">Video</Badge>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(article.id, article.featured)}
                  disabled={isTogglingFeatured === article.id}
                  className={article.featured ? "text-palestinian-gold border-palestinian-gold" : ""}
                >
                  <Star className={`w-4 h-4 ${article.featured ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/news/${article.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/news/${article.id}/edit`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{article.title_en}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(article.id)}
                        disabled={isDeleting === article.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting === article.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 line-clamp-3">{article.content_en}</p>
              <p className="text-sm text-gray-700 font-arabic text-right line-clamp-3">{article.content_ar}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
