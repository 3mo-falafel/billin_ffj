"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// API calls will use fetch instead of Supabase
import { Plus, Edit, Trash2, Save, X, Upload, MoveUp, MoveDown, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GalleryItem {
  id: number
  title_en: string
  title_ar: string
  image_url: string
  alt_text: string
  display_order: number
  is_active: boolean
  created_at: string
}

export function AdminHomepageGallery() {
  const { language } = useLanguage()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null)

  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_active: true
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Using API fetch calls instead of Supabase

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/homepage-gallery')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch homepage gallery: ${await response.text()}`)
      }
      
      const result = await response.json()
      setGalleryItems(result.data || [])
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      showAlert('error', 'Failed to fetch gallery items')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ar: '',
      image_url: '',
      alt_text: '',
      display_order: galleryItems.length + 1,
      is_active: true
    })
    setImageFile(null)
    setImagePreview('')
    setEditingId(null)
    setShowAddForm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAdd = () => {
    resetForm()
    setFormData(prev => ({ ...prev, display_order: galleryItems.length + 1 }))
    setShowAddForm(true)
  }

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title_en: item.title_en,
      title_ar: item.title_ar,
      image_url: item.image_url,
      alt_text: item.alt_text || '',
      display_order: item.display_order,
      is_active: item.is_active
    })
    setImageFile(null)
    setImagePreview(item.image_url)
    setEditingId(item.id)
    setShowAddForm(false)
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    // For now, create a blob URL for preview
    // In production, implement proper file upload to your chosen storage solution
    const url = URL.createObjectURL(file)
    
    // NOTE: This creates a temporary URL for preview only
    // You'll need to implement actual file upload to a storage service
    // like AWS S3, Cloudinary, or your own server
    
    console.warn('File upload not implemented - using blob URL for preview only')
    return url
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showAlert('error', 'Please select an image file')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File size must be less than 5MB')
        return
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      if (!formData.title_en || !formData.title_ar) {
        showAlert('error', 'Please fill in all required fields')
        return
      }

      let finalImageUrl = formData.image_url

      // Handle file upload if a file is selected
      if (imageFile) {
        setUploading(true)
        try {
          finalImageUrl = await handleFileUpload(imageFile)
        } catch (error) {
          console.error('Upload failed:', error)
          showAlert('error', 'Failed to upload image')
          setUploading(false)
          return
        }
        setUploading(false)
      }

      if (!finalImageUrl) {
        showAlert('error', 'Please provide an image URL or upload a file')
        return
      }

      const finalFormData = {
        ...formData,
        image_url: finalImageUrl
      }

      if (editingId) {
        // Update existing item
        const response = await fetch(`/api/homepage-gallery/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title_en: finalFormData.title_en,
            title_ar: finalFormData.title_ar,
            image_url: finalFormData.image_url,
            alt_text: finalFormData.alt_text,
            display_order: finalFormData.display_order,
            is_active: finalFormData.is_active
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to update homepage gallery item: ${await response.text()}`)
        }
        showAlert('success', 'Gallery item updated successfully')
      } else {
        // Add new item
        const response = await fetch('/api/homepage-gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalFormData)
        })

        if (!response.ok) {
          throw new Error(`Failed to create homepage gallery item: ${await response.text()}`)
        }
        showAlert('success', 'Gallery item added successfully')
      }

      resetForm()
      fetchGalleryItems()
    } catch (error) {
      console.error('Error saving gallery item:', error)
      showAlert('error', 'Failed to save gallery item')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return
    }

    try {
      const response = await fetch(`/api/homepage-gallery/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to delete homepage gallery item: ${await response.text()}`)
      }

      showAlert('success', 'Gallery item deleted successfully')
      fetchGalleryItems()
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      showAlert('error', 'Failed to delete gallery item')
    }
  }

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const item = galleryItems.find(i => i.id === id)
    if (!item) return

    const newOrder = direction === 'up' ? item.display_order - 1 : item.display_order + 1
    if (newOrder < 1 || newOrder > galleryItems.length) return

    try {
      // Find the item to swap with
      const swapItem = galleryItems.find(i => i.display_order === newOrder)
      if (!swapItem) return

      // Swap the orders
      const response1 = await fetch(`/api/homepage-gallery/${swapItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...swapItem,
          display_order: item.display_order 
        })
      })

      if (!response1.ok) {
        throw new Error(`Failed to update display order: ${await response1.text()}`)
      }

      const response2 = await fetch(`/api/homepage-gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...item,
          display_order: newOrder 
        })
      })

      if (!response2.ok) {
        throw new Error(`Failed to update display order: ${await response2.text()}`)
      }

      fetchGalleryItems()
    } catch (error) {
      console.error('Error reordering items:', error)
      showAlert('error', 'Failed to reorder items')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {language === 'ar' ? 'إدارة معرض الصفحة الرئيسية' : 'Homepage Gallery Management'}
        </h2>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
        </Button>
      </div>

      {alert && (
        <Alert className={alert.type === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId 
                ? (language === 'ar' ? 'تعديل الصورة' : 'Edit Gallery Item')
                : (language === 'ar' ? 'إضافة صورة جديدة' : 'Add New Gallery Item')
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_en">English Title *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder="Enter English title"
                />
              </div>
              <div>
                <Label htmlFor="title_ar">Arabic Title *</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  placeholder="أدخل العنوان بالعربية"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Image *</Label>
              
              {/* File Upload Option */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">
                  {language === 'ar' ? 'رفع من الجهاز' : 'Upload from Device'}
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* URL Option */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">
                  {language === 'ar' ? 'أو رابط الصورة' : 'Or Image URL'}
                </Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="/path/to/image.jpg or https://example.com/image.jpg"
                  disabled={!!imageFile}
                />
              </div>

              {/* Image Preview */}
              {(imagePreview || formData.image_url) && (
                <div className="mt-4">
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">
                    {language === 'ar' ? 'معاينة الصورة' : 'Image Preview'}
                  </Label>
                  <div className="relative w-full max-w-xs">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    {imageFile && (
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {language === 'ar' ? 'جديد' : 'New'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Description for accessibility"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_active">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'حفظ' : 'Save'}
                  </>
                )}
              </Button>
              <Button onClick={resetForm} variant="outline" disabled={uploading}>
                <X className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Items List */}
      <div className="space-y-4">
        {galleryItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Preview Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={item.image_url} 
                    alt={item.alt_text || item.title_en}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {language === 'ar' ? item.title_ar : item.title_en}
                    </h3>
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active 
                        ? (language === 'ar' ? 'نشط' : 'Active')
                        : (language === 'ar' ? 'غير نشط' : 'Inactive')
                      }
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    Order: {item.display_order} | {item.image_url}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorder(item.id, 'up')}
                    disabled={item.display_order === 1}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorder(item.id, 'down')}
                    disabled={item.display_order === galleryItems.length}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'لا توجد عناصر في المعرض' : 'No gallery items found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
