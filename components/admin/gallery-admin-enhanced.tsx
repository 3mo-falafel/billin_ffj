'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Eye,
  Languages,
  Save,
  X,
  Image as ImageIcon,
  Download,
  Share2,
  Calendar
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Switch } from '../ui/switch'
import ImageUpload from './image-upload'

interface GalleryItem {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  category: string
  date_taken: string
  photographer: string
  location: string
  images: string[]
  is_featured: boolean
  is_public: boolean
  tags: string[]
  views: number
  created_at: string
}

const galleryCategories = [
  { value: 'resistance', label: 'Resistance Activities', color: 'bg-red-500', icon: '✊' },
  { value: 'culture', label: 'Cultural Events', color: 'bg-purple-500', icon: '🎭' },
  { value: 'education', label: 'Educational Programs', color: 'bg-blue-500', icon: '📚' },
  { value: 'community', label: 'Community Life', color: 'bg-green-500', icon: '🏘️' },
  { value: 'heritage', label: 'Heritage & Traditions', color: 'bg-orange-500', icon: '🏛️' },
  { value: 'nature', label: 'Nature & Landscape', color: 'bg-emerald-500', icon: '🌿' },
  { value: 'festivals', label: 'Festivals & Celebrations', color: 'bg-yellow-500', icon: '🎉' },
  { value: 'visitors', label: 'International Visitors', color: 'bg-pink-500', icon: '🌍' }
]

export default function GalleryAdminEnhanced() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    category: '',
    date_taken: '',
    photographer: '',
    location: '',
    images: [] as string[],
    is_featured: false,
    is_public: true,
    tags: [] as string[]
  })

  useEffect(() => {
    loadGalleryItems()
  }, [])

  const loadGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error(`Failed to load gallery items: ${await response.text()}`)
      }
      
      const result = await response.json()
      const data = result.data || []
      
      // Transform the data to match our interface
      const transformedItems: GalleryItem[] = data.map((item: any) => ({
        id: item.id,
        title_en: item.title_en || 'Untitled',
        title_ar: item.title_ar || 'بدون عنوان',
        description_en: item.description_en || '',
        description_ar: item.description_ar || '',
        category: item.category || 'general',
        date_taken: new Date(item.created_at).toISOString().split('T')[0],
        photographer: 'Bil\'in Media Center',
        location: 'Bil\'in, Palestine',
        images: item.media_url ? [item.media_url] : [],
        is_featured: false,
        is_public: true,
        tags: item.category ? [item.category] : [],
        views: 0,
        created_at: item.created_at
      }))
      
      setGalleryItems(transformedItems)
    } catch (error) {
      console.error('Failed to load gallery items:', error)
      setGalleryItems([])
    }
  }

  const getCategoryInfo = (categoryValue: string) => {
    return galleryCategories.find(cat => cat.value === categoryValue) || galleryCategories[0]
  }

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title_ar.includes(searchTerm) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare data for database
      const itemData = {
        title_en: formData.title_en,
        title_ar: formData.title_ar,
        description_en: formData.description_en,
        description_ar: formData.description_ar,
        media_url: formData.images[0] || '',
        media_type: 'image',
        category: formData.category
      }

      if (editingItem) {
        const response = await fetch(`/api/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to update gallery item: ${await response.text()}`)
        }
      } else {
        const response = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to create gallery item: ${await response.text()}`)
        }
      }

      // Reload gallery items from database
      await loadGalleryItems()
      
      resetForm()
      setShowAddDialog(false)
      setEditingItem(null)
      
      // Show success message
      alert(editingItem ? 'Gallery item updated successfully!' : 'Gallery item created successfully!')
      
    } catch (error) {
      console.error('Error saving gallery item:', error)
      alert('Failed to save gallery item. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      category: '',
      date_taken: '',
      photographer: '',
      location: '',
      images: [],
      is_featured: false,
      is_public: true,
      tags: []
    })
  }

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title_en: item.title_en,
      title_ar: item.title_ar,
      description_en: item.description_en,
      description_ar: item.description_ar,
      category: item.category,
      date_taken: item.date_taken,
      photographer: item.photographer,
      location: item.location,
      images: item.images,
      is_featured: item.is_featured,
      is_public: item.is_public,
      tags: item.tags
    })
    setEditingItem(item)
    setShowAddDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to delete gallery item: ${await response.text()}`)
        }
        
        // Reload gallery items from database
        await loadGalleryItems()
        alert('Gallery item deleted successfully!')
        
      } catch (error) {
        console.error('Error deleting gallery item:', error)
        alert('Failed to delete gallery item. Please try again.')
      }
    }
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
    setFormData(prev => ({ ...prev, tags }))
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
            <p className="text-emerald-100">Organize and showcase your community photos with automatic Arabic translation</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg p-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="text-white"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="text-white"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
                  onClick={resetForm}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Photos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    {editingItem ? 'Edit Gallery Item' : 'Add New Photos'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* English Content */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                          🇺🇸 English Content
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title_en" className="text-sm font-medium">Title (English)</Label>
                            <Input
                              id="title_en"
                              value={formData.title_en}
                              onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                              placeholder="Enter photo collection title in English"
                              required
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="description_en" className="text-sm font-medium">Description (English)</Label>
                            <Textarea
                              id="description_en"
                              value={formData.description_en}
                              onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                              placeholder="Describe the photos in English"
                              rows={4}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arabic Content */}
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                          🇵🇸 Arabic Content
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title_ar" className="text-sm font-medium">Title (Arabic)</Label>
                            <Input
                              id="title_ar"
                              value={formData.title_ar}
                              onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                              placeholder="أدخل عنوان الصورة بالعربية"
                              required
                              className="mt-1 text-right"
                              dir="rtl"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="description_ar" className="text-sm font-medium">Description (Arabic)</Label>
                            <Textarea
                              id="description_ar"
                              value={formData.description_ar}
                              onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                              placeholder="اكتب وصف الصور بالعربية"
                              rows={4}
                              required
                              className="mt-1 text-right"
                              dir="rtl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Photo Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                          required
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {galleryCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center space-x-2">
                                  <span>{category.icon}</span>
                                  <span>{category.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="date_taken" className="text-sm font-medium">Date Taken</Label>
                        <Input
                          id="date_taken"
                          type="date"
                          value={formData.date_taken}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_taken: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="photographer" className="text-sm font-medium">Photographer</Label>
                        <Input
                          id="photographer"
                          value={formData.photographer}
                          onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                          placeholder="Photographer name"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Photo location"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags.join(', ')}
                          onChange={(e) => handleTagsChange(e.target.value)}
                          placeholder="protest, peace, community"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_featured" className="text-sm font-medium">Featured Collection</Label>
                        <Switch
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_public" className="text-sm font-medium">Public Gallery</Label>
                        <Switch
                          id="is_public"
                          checked={formData.is_public}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Upload Photos</h3>
                    <ImageUpload
                      onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                      maxImages={20}
                      existingImages={formData.images}
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingItem ? 'Update' : 'Upload'} Photos
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search photos by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {galleryCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.category)
            
            return (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="p-0">
                  {item.images.length > 0 && (
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setPreviewImage(item.images[0])}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryInfo.color} text-white`}>
                          {categoryInfo.icon} {categoryInfo.label}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black bg-opacity-50 text-white">
                          {item.images.length} photos
                        </Badge>
                      </div>
                      {item.is_featured && (
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-yellow-500 text-white">
                            ⭐ Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                        {item.title_en}
                      </h3>
                      <p className="text-sm text-gray-600 text-right mt-1" dir="rtl">
                        {item.title_ar}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description_en}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.date_taken).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.views} views
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.category)
            
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {item.images.length > 0 && (
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.title_en}
                          className="w-full h-full object-cover rounded-lg cursor-pointer"
                          onClick={() => setPreviewImage(item.images[0])}
                        />
                        <Badge className="absolute top-2 left-2 text-xs bg-black bg-opacity-50 text-white">
                          {item.images.length}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-xl text-gray-800">{item.title_en}</h3>
                            <p className="text-gray-600 text-right mt-1" dir="rtl">{item.title_ar}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${categoryInfo.color} text-white`}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </Badge>
                            {item.is_featured && (
                              <Badge className="bg-yellow-500 text-white">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600">{item.description_en}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>📸 {item.photographer}</span>
                          <span>📍 {item.location}</span>
                          <span>📅 {new Date(item.date_taken).toLocaleDateString()}</span>
                          <span>👁️ {item.views} views</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No photos found</div>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
