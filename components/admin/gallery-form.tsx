"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Video } from "lucide-react"

interface GalleryItem {
  id?: string
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  media_url: string
  media_type: "image" | "video"
  category: string
}

interface GalleryFormProps {
  galleryItem?: GalleryItem
}

const categories = [
  { value: "resistance", label: "Peaceful Resistance" },
  { value: "community", label: "Community Life" },
  { value: "culture", label: "Cultural Events" },
  { value: "farming", label: "Farming & Agriculture" },
  { value: "international", label: "International Solidarity" },
  { value: "general", label: "General" },
]

export function GalleryForm({ galleryItem }: GalleryFormProps) {
  const [formData, setFormData] = useState<GalleryItem>({
    title_en: galleryItem?.title_en || "",
    title_ar: galleryItem?.title_ar || "",
    description_en: galleryItem?.description_en || "",
    description_ar: galleryItem?.description_ar || "",
    media_url: galleryItem?.media_url || "",
    media_type: galleryItem?.media_type || "image",
    category: galleryItem?.category || "general",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(galleryItem?.media_url || null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: keyof GalleryItem, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (file: File | null) => {
    setMediaFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      // Auto-detect media type
      const mediaType = file.type.startsWith("video/") ? "video" : "image"
      setFormData((prev) => ({ ...prev, media_type: mediaType }))
    }
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `gallery/${fileName}`

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

      // Handle file upload
      if (mediaFile) {
        const mediaUrl = await handleFileUpload(mediaFile)
        finalFormData.media_url = mediaUrl
      }

      // Validate required fields
      if (!finalFormData.media_url) {
        throw new Error("Media URL or file is required")
      }

      if (galleryItem?.id) {
        // Update existing gallery item
        const { error: updateError } = await supabase.from("gallery").update(finalFormData).eq("id", galleryItem.id)

        if (updateError) throw updateError
      } else {
        // Create new gallery item
        const { error: insertError } = await supabase.from("gallery").insert([finalFormData])

        if (insertError) throw insertError
      }

      router.push("/admin/gallery")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card className="border-palestinian-green/20">
        <CardHeader>
          <CardTitle className="text-palestinian-green">Media Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media Upload */}
            <div className="space-y-4">
              <Label>Media</Label>
              <Tabs value={formData.media_type} onValueChange={(value) => handleInputChange("media_type", value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="video">
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="media_url">Image URL</Label>
                    <Input
                      id="media_url"
                      value={formData.media_url}
                      onChange={(e) => {
                        handleInputChange("media_url", e.target.value)
                        setPreviewUrl(e.target.value)
                      }}
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
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      value={formData.media_url}
                      onChange={(e) => {
                        handleInputChange("media_url", e.target.value)
                        setPreviewUrl(e.target.value)
                      }}
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
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
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
            </div>

            {/* Title Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (English) - Optional</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => handleInputChange("title_en", e.target.value)}
                  placeholder="Media title in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_ar">Title (Arabic) - Optional</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => handleInputChange("title_ar", e.target.value)}
                  placeholder="عنوان الوسائط بالعربية"
                  className="text-right font-arabic"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (English) - Optional</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => handleInputChange("description_en", e.target.value)}
                  placeholder="Description in English"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (Arabic) - Optional</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => handleInputChange("description_ar", e.target.value)}
                  placeholder="وصف بالعربية"
                  className="text-right font-arabic"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={isLoading} className="bg-palestinian-green hover:bg-palestinian-green/90">
                {isLoading ? "Saving..." : galleryItem?.id ? "Update Media" : "Add Media"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-palestinian-green/20">
        <CardHeader>
          <CardTitle className="text-palestinian-green">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {previewUrl ? (
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {formData.media_type === "image" ? (
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={previewUrl} controls className="w-full h-full object-cover">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {(formData.title_en || formData.title_ar) && (
                <div className="space-y-1">
                  {formData.title_en && <h3 className="font-medium text-palestinian-green">{formData.title_en}</h3>}
                  {formData.title_ar && <p className="text-gray-600 font-arabic text-right">{formData.title_ar}</p>}
                </div>
              )}
              {(formData.description_en || formData.description_ar) && (
                <div className="space-y-1">
                  {formData.description_en && <p className="text-sm text-gray-700">{formData.description_en}</p>}
                  {formData.description_ar && (
                    <p className="text-sm text-gray-700 font-arabic text-right">{formData.description_ar}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>No media selected</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
