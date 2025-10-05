"use client"

import { useState } from "react"
import { createClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Calendar, Plus } from "lucide-react"
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

interface Activity {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  image_url?: string
  video_url?: string
  date: string
  created_at: string
}

interface ActivitiesTableProps {
  activities: Activity[]
}

export function ActivitiesTable({ activities }: ActivitiesTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const { error } = await supabase.from("activities").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting activity:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
          <p className="text-gray-500 text-center mb-4">Get started by creating your first activity.</p>
          <Button asChild className="bg-palestinian-green hover:bg-palestinian-green/90">
            <Link href="/admin/activities/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {activities.map((activity) => (
        <Card key={activity.id} className="border-palestinian-green/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-palestinian-green">{activity.title_en}</CardTitle>
                <p className="text-sm text-gray-600 font-arabic text-right">{activity.title_ar}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(activity.date)}
                  </span>
                  {activity.image_url && <Badge variant="secondary">Image</Badge>}
                  {activity.video_url && <Badge variant="secondary">Video</Badge>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/activities/${activity.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/activities/${activity.id}/edit`}>
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
                      <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{activity.title_en}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(activity.id)}
                        disabled={isDeleting === activity.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting === activity.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 line-clamp-2">{activity.description_en}</p>
              <p className="text-sm text-gray-700 font-arabic text-right line-clamp-2">{activity.description_ar}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
