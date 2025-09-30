"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface EmbroideryFormProps {
  initialData?: any
  isEditing?: boolean
}

export function EmbroideryForm({ initialData, isEditing = false }: EmbroideryFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || "")
  
  const [formData, setFormData] = useState({
    title_en: initialData?.title_en || "",
    title_ar: initialData?.title_ar || "",
    description_en: initialData?.description_en || "",
    description_ar: initialData?.description_ar || "",
    price: initialData?.price || "",
    contact_number: initialData?.contact_number || "",
    category: initialData?.category || "embroidery",
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `embroidery-${Date.now()}.${fileExt}`
      const filePath = `crafts/embroidery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = initialData?.image_url || ""

      // Upload new image if provided
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          alert("Failed to upload image. Please try again.")
          setIsSubmitting(false)
          return
        }
      }

      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        image_url: imageUrl || null,
      }

      let result
      if (isEditing && initialData?.id) {
        result = await supabase
          .from("embroidery")
          .update(submitData)
          .eq("id", initialData.id)
      } else {
        result = await supabase
          .from("embroidery")
          .insert([submitData])
      }

      if (result.error) {
        console.error("Error saving embroidery:", result.error)
        alert("Failed to save embroidery. Please try again.")
      } else {
        router.push("/admin/crafts")
        router.refresh()
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("An error occurred while saving. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-sm text-gray-600">
                    Click to upload an image or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 10MB
                  </div>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title_en">Title (English) *</Label>
          <Input
            id="title_en"
            value={formData.title_en}
            onChange={(e) => handleInputChange("title_en", e.target.value)}
            placeholder="Enter title in English"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title_ar">Title (Arabic)</Label>
          <Input
            id="title_ar"
            value={formData.title_ar}
            onChange={(e) => handleInputChange("title_ar", e.target.value)}
            placeholder="أدخل العنوان بالعربية"
            dir="rtl"
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
            placeholder="Describe the embroidery piece..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_ar">Description (Arabic)</Label>
          <Textarea
            id="description_ar"
            value={formData.description_ar}
            onChange={(e) => handleInputChange("description_ar", e.target.value)}
            placeholder="وصف قطعة التطريز..."
            dir="rtl"
            rows={4}
          />
        </div>
      </div>

      {/* Price and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input
            id="contact_number"
            value={formData.contact_number}
            onChange={(e) => handleInputChange("contact_number", e.target.value)}
            placeholder="+970 XXX XXX XXX"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="embroidery">Traditional Embroidery</SelectItem>
            <SelectItem value="clothing">Embroidered Clothing</SelectItem>
            <SelectItem value="accessories">Embroidered Accessories</SelectItem>
            <SelectItem value="home-decor">Home Decoration</SelectItem>
            <SelectItem value="bags">Embroidered Bags</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Featured Item</Label>
                <div className="text-sm text-gray-500">
                  Display this item prominently on the website
                </div>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active</Label>
                <div className="text-sm text-gray-500">
                  Show this item on the website
                </div>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title_en.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Embroidery" : "Create Embroidery"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
