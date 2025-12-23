"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NewsArticle {
  id?: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  video_url?: string
  date: string
  featured: boolean
}

interface NewsFormProps {
  news?: NewsArticle
}

export function NewsForm({ news }: NewsFormProps) {
  const [formData, setFormData] = useState<NewsArticle>({
    title_en: news?.title_en || "",
    title_ar: news?.title_ar || "",
    content_en: news?.content_en || "",
    content_ar: news?.content_ar || "",
    image_url: news?.image_url || "",
    video_url: news?.video_url || "",
    date: news?.date || new Date().toISOString().split("T")[0],
    featured: news?.featured || false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: keyof NewsArticle, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File, type: "image" | "video"): Promise<string> => {
    // For images, use the compression API
    if (type === "image") {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('maxWidth', '1200')
      formData.append('quality', '80')
      formData.append('generateThumbnail', 'true')
      formData.append('maxFileSizeKB', '150') // Target max 150KB

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      return result.data?.url || result.url
    }
    
    // For videos, use Supabase storage
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

      // Handle file uploads
      if (imageFile) {
        const imageUrl = await handleFileUpload(imageFile, "image")
        finalFormData.image_url = imageUrl
      }

      if (videoFile) {
        const videoUrl = await handleFileUpload(videoFile, "video")
        finalFormData.video_url = videoUrl
      }

      if (news?.id) {
        // Update existing news
        const { error: updateError } = await supabase.from("news").update(finalFormData).eq("id", news.id)

        if (updateError) throw updateError
      } else {
        // Create new news
        const { error: insertError } = await supabase.from("news").insert([finalFormData])

        if (insertError) throw insertError
      }

      router.push("/admin/news")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-palestinian-green/20">
      <CardHeader>
        <CardTitle className="text-palestinian-green">News Article Information</CardTitle>
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
                placeholder="News article title in English"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ar">Title (Arabic)</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleInputChange("title_ar", e.target.value)}
                placeholder="عنوان المقال بالعربية"
                className="text-right font-arabic"
                dir="rtl"
                required
              />
            </div>
          </div>

          {/* Content Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content_en">Content (English)</Label>
              <Textarea
                id="content_en"
                value={formData.content_en}
                onChange={(e) => handleInputChange("content_en", e.target.value)}
                placeholder="Full article content in English"
                rows={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_ar">Content (Arabic)</Label>
              <Textarea
                id="content_ar"
                value={formData.content_ar}
                onChange={(e) => handleInputChange("content_ar", e.target.value)}
                placeholder="محتوى المقال الكامل بالعربية"
                className="text-right font-arabic"
                dir="rtl"
                rows={8}
                required
              />
            </div>
          </div>

          {/* Date and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Publication Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
              />
              <Label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Feature this article
              </Label>
            </div>
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
              {isLoading ? "Saving..." : news?.id ? "Update Article" : "Create Article"}
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
