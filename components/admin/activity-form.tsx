"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Activity {
  id?: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  image_url?: string
  video_url?: string
  date: string
}

interface ActivityFormProps {
  activity?: Activity
}

export function ActivityForm({ activity }: ActivityFormProps) {
  const [formData, setFormData] = useState<Activity>({
    title_en: activity?.title_en || "",
    title_ar: activity?.title_ar || "",
    description_en: activity?.description_en || "",
    description_ar: activity?.description_ar || "",
    image_url: activity?.image_url || "",
    video_url: activity?.video_url || "",
    date: activity?.date || new Date().toISOString().split("T")[0],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: keyof Activity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File, type: "image" | "video"): Promise<string> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${type}s/${fileName}`

    const { error: uploadError } = await supabase.storage.from("media").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const finalFormData = { ...formData }
      
      console.log('🔍 ACTIVITY FORM DEBUG - About to save:', finalFormData)

      // Handle file uploads
      if (imageFile) {
        const imageUrl = await handleFileUpload(imageFile, "image")
        finalFormData.image_url = imageUrl
      }

      if (videoFile) {
        const videoUrl = await handleFileUpload(videoFile, "video")
        finalFormData.video_url = videoUrl
      }

      console.log('🔍 ACTIVITY FORM DEBUG - Final form data:', finalFormData)

      if (activity?.id) {
        // Update existing activity
        console.log('🔍 ACTIVITY FORM DEBUG - Updating activity:', activity.id)
        const { error: updateError } = await supabase.from("activities").update(finalFormData).eq("id", activity.id)

        if (updateError) {
          console.error('🔍 ACTIVITY FORM DEBUG - Update error:', updateError)
          throw updateError
        }
        console.log('🔍 ACTIVITY FORM DEBUG - Update successful')
      } else {
        // Create new activity
        console.log('🔍 ACTIVITY FORM DEBUG - Creating new activity')
        const { error: insertError, data: insertData } = await supabase.from("activities").insert([finalFormData]).select()

        if (insertError) {
          console.error('🔍 ACTIVITY FORM DEBUG - Insert error:', insertError)
          throw insertError
        }
        console.log('🔍 ACTIVITY FORM DEBUG - Insert successful:', insertData)
      }

      console.log('🔍 ACTIVITY FORM DEBUG - Redirecting to admin activities')
      router.push("/admin/activities")
      router.refresh()
    } catch (error: any) {
      console.error('🔍 ACTIVITY FORM DEBUG - Error occurred:', error)
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-palestinian-green/20">
      <CardHeader>
        <CardTitle className="text-palestinian-green">Activity Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_en">Title (English)</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => handleInputChange("title_en", e.target.value)}
                placeholder="Activity title in English"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ar">Title (Arabic)</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleInputChange("title_ar", e.target.value)}
                placeholder="عنوان النشاط بالعربية"
                className="text-right font-arabic"
                dir="rtl"
                required
              />
            </div>
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_en">Description (English)</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => handleInputChange("description_en", e.target.value)}
                placeholder="Detailed description in English"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ar">Description (Arabic)</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleInputChange("description_ar", e.target.value)}
                placeholder="وصف مفصل بالعربية"
                className="text-right font-arabic"
                dir="rtl"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date">Activity Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <Label>Media</Label>
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange("image_url", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="text-center text-gray-500">or</div>
                <div className="space-y-2">
                  <Label htmlFor="image_file">Upload Image File</Label>
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => handleInputChange("video_url", e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                  />
                </div>
                <div className="text-center text-gray-500">or</div>
                <div className="space-y-2">
                  <Label htmlFor="video_file">Upload Video File</Label>
                  <Input
                    id="video_file"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center space-x-4">
            <Button type="submit" disabled={isLoading} className="bg-palestinian-green hover:bg-palestinian-green/90">
              {isLoading ? "Saving..." : activity?.id ? "Update Activity" : "Create Activity"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
