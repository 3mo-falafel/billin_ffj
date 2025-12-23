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
import { Upload, X, Loader2, Save, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SaleFormProps {
  initialData?: any
  isEditing?: boolean
}

export function SaleForm({ initialData, isEditing = false }: SaleFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || "")
  const [uploadProgress, setUploadProgress] = useState<string>("")
  
  const [formData, setFormData] = useState({
    title_en: initialData?.title_en || "",
    title_ar: initialData?.title_ar || "",
    description_en: initialData?.description_en || "",
    description_ar: initialData?.description_ar || "",
    price: initialData?.price || "",
    contact_url: initialData?.contact_url || "",
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

  // Upload image with automatic compression to ~150KB
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress(`Compressing and uploading ${file.name}...`)
      
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
      const imageUrl = result.data?.url || result.url
      
      setUploadProgress(`Compressed from ${(file.size / 1024).toFixed(0)}KB to ${(result.data?.size / 1024).toFixed(0)}KB`)
      
      return imageUrl
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress('')
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
          .from("embroidery_for_sale")
          .update(submitData)
          .eq("id", initialData.id)
      } else {
        result = await supabase
          .from("embroidery_for_sale")
          .insert([submitData])
      }

      if (result.error) {
        console.error("Error saving sale item:", result.error)
        alert("Failed to save sale item. Please try again.")
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
        <Label className="text-[#DAA520] font-medium">Product Image</Label>
        <div className="border-2 border-dashed border-[#DAA520]/30 rounded-lg p-6 bg-gradient-to-br from-[#F8F5F0] to-white">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg border-2 border-[#C8102E]/30"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 bg-[#C8102E] hover:bg-[#A50D24]"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
              {imageFile && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Original: {(imageFile.size / 1024 / 1024).toFixed(2)}MB → Will compress to ~150KB
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 text-[#DAA520]/50 mx-auto mb-4" />
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-sm text-[#DAA520] font-medium">
                    Click to upload product image
                  </div>
                  <div className="text-xs text-gray-500">
                    Any image format - auto-compressed to ~150KB
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    ✓ Large files (10MB+) automatically compressed
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
          {uploadProgress && (
            <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadProgress}
            </div>
          )}
        </div>
      </div>

      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title_en" className="text-[#DAA520] font-medium">Title (English) *</Label>
          <Input
            id="title_en"
            value={formData.title_en}
            onChange={(e) => handleInputChange("title_en", e.target.value)}
            placeholder="Enter product title in English"
            className="border-[#DAA520]/30 focus:border-[#DAA520]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title_ar" className="text-[#C8102E] font-medium">Title (Arabic)</Label>
          <Input
            id="title_ar"
            value={formData.title_ar}
            onChange={(e) => handleInputChange("title_ar", e.target.value)}
            placeholder="أدخل عنوان المنتج بالعربية"
            className="border-[#C8102E]/30 focus:border-[#C8102E]"
            dir="rtl"
          />
        </div>
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description_en" className="text-[#DAA520] font-medium">Description (English)</Label>
          <Textarea
            id="description_en"
            value={formData.description_en}
            onChange={(e) => handleInputChange("description_en", e.target.value)}
            placeholder="Describe the embroidery item, materials, size, and unique features..."
            className="border-[#DAA520]/30 focus:border-[#DAA520]"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_ar" className="text-[#C8102E] font-medium">Description (Arabic)</Label>
          <Textarea
            id="description_ar"
            value={formData.description_ar}
            onChange={(e) => handleInputChange("description_ar", e.target.value)}
            placeholder="وصف المنتج والمواد والحجم والميزات الفريدة..."
            className="border-[#C8102E]/30 focus:border-[#C8102E]"
            dir="rtl"
            rows={4}
          />
        </div>
      </div>

      {/* Price and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-[#006233] font-medium">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
            className="border-[#006233]/30 focus:border-[#006233]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_url" className="text-[#006233] font-medium">Contact URL</Label>
          <Input
            id="contact_url"
            value={formData.contact_url}
            onChange={(e) => handleInputChange("contact_url", e.target.value)}
            placeholder="WhatsApp link, social media, or website"
            className="border-[#006233]/30 focus:border-[#006233]"
          />
          <div className="text-xs text-gray-500 flex items-center">
            <ExternalLink className="w-3 h-3 mr-1" />
            Example: https://wa.me/970XXXXXXXXX or https://instagram.com/username
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-[#663399] font-medium">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
          <SelectTrigger className="border-[#663399]/30 focus:border-[#663399]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="embroidery">Traditional Embroidery</SelectItem>
            <SelectItem value="thob">Embroidered Thob</SelectItem>
            <SelectItem value="jacket">Embroidered Jacket</SelectItem>
            <SelectItem value="dress">Embroidered Dress</SelectItem>
            <SelectItem value="pillow">Embroidered Pillow</SelectItem>
            <SelectItem value="bag">Embroidered Bag</SelectItem>
            <SelectItem value="accessories">Embroidered Accessories</SelectItem>
            <SelectItem value="home-decor">Home Decoration</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Settings */}
      <Card className="border-[#006233]/30">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-[#006233] font-medium">Featured Item</Label>
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
                <Label className="text-[#006233] font-medium">Active</Label>
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
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title_en.trim()}
          className="bg-[#DAA520] hover:bg-[#B8941C] text-black shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Sale Item" : "Create Sale Item"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
