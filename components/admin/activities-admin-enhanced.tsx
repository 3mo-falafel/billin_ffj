'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  Languages,
  Save,
  X
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
import ImageUpload from './image-upload'
import { translateToArabic } from '@/lib/utils/admin-helpers'

interface Activity {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  category: string
  date: string
  time: string
  location: string
  capacity: number
  images: string[]
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

const categories = [
  { value: 'cultural-workshop', label: 'Cultural Workshop', color: 'bg-purple-500', icon: '🎨' },
  { value: 'peaceful-demonstration', label: 'Peaceful Demonstration', color: 'bg-green-500', icon: '✊' },
  { value: 'educational-program', label: 'Educational Program', color: 'bg-blue-500', icon: '📚' },
  { value: 'community-event', label: 'Community Event', color: 'bg-orange-500', icon: '🏘️' },
  { value: 'heritage-celebration', label: 'Heritage Celebration', color: 'bg-red-500', icon: '🏛️' },
  { value: 'olive-harvest', label: 'Olive Harvest', color: 'bg-emerald-500', icon: '🫒' },
  { value: 'solidarity-action', label: 'Solidarity Action', color: 'bg-pink-500', icon: '🤝' },
  { value: 'youth-program', label: 'Youth Program', color: 'bg-indigo-500', icon: '👥' }
]

export default function ActivitiesAdminEnhanced() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title_en: '',
    description_en: '',
    category: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    images: [] as string[],
    status: 'draft' as Activity['status']
  })

  // Auto-generated Arabic translations
  const [translations, setTranslations] = useState({
    title_ar: '',
    description_ar: ''
  })

  useEffect(() => {
    // Load activities from API/database
    loadActivities()
  }, [])

  // Auto-translate when English fields change
  useEffect(() => {
    const translateFields = async () => {
      if (formData.title_en && !isTranslating) {
        setIsTranslating(true)
        try {
          const titleAr = await translateToArabic(formData.title_en)
          const descriptionAr = formData.description_en ? await translateToArabic(formData.description_en) : ''
          
          setTranslations({
            title_ar: titleAr,
            description_ar: descriptionAr
          })
        } catch (error) {
          console.error('Translation failed:', error)
        } finally {
          setIsTranslating(false)
        }
      }
    }

    const debounceTimer = setTimeout(translateFields, 1000)
    return () => clearTimeout(debounceTimer)
  }, [formData.title_en, formData.description_en])

  const loadActivities = async () => {
    try {
      console.log('🔍 ADMIN ACTIVITIES DEBUG - Loading activities...')
      
      // Get API client
      const { createClient } = await import('@/lib/api/client')
      const api = createClient()
      
      // Fetch real activities from database
      const { data, error } = await api.activities.getAll()
      
      console.log('🔍 ADMIN ACTIVITIES DEBUG - Raw data from DB:', data)
      console.log('🔍 ADMIN ACTIVITIES DEBUG - Error from DB:', error)
      
      if (error) {
        console.error('Error fetching activities:', error)
        return
      }
      
      // Transform database data to match component interface
      const transformedActivities: Activity[] = (data || []).map(activity => ({
        id: activity.id,
        title_en: activity.title_en,
        title_ar: activity.title_ar,
        description_en: activity.description_en,
        description_ar: activity.description_ar,
        category: 'general', // Default category since DB doesn't have this field
        date: activity.date,
        time: '12:00', // Default time since DB doesn't have this field
        location: 'Bil\'in Village', // Default location since DB doesn't have this field
        capacity: 100, // Default capacity since DB doesn't have this field
        images: activity.image_url ? [activity.image_url] : ['/placeholder.jpg'],
        status: 'published' as 'draft' | 'published' | 'archived', // Default to published since no is_active field
        created_at: activity.created_at
      }))
      
      console.log('🔍 ADMIN ACTIVITIES DEBUG - Transformed activities:', transformedActivities)
      
      setActivities(transformedActivities)
    } catch (error) {
      console.error('🔍 ADMIN ACTIVITIES DEBUG - Error loading activities:', error)
    }
  }

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0]
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.title_ar.includes(searchTerm)
    const matchesCategory = filterCategory === 'all' || activity.category === filterCategory
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const activityData = {
      ...formData,
      title_ar: translations.title_ar,
      description_ar: translations.description_ar,
      id: editingActivity?.id || Date.now().toString()
    }

    if (editingActivity) {
      // Update existing activity
      setActivities(prev => prev.map(act => 
        act.id === editingActivity.id ? { ...act, ...activityData } : act
      ))
    } else {
      // Add new activity
      setActivities(prev => [...prev, { 
        ...activityData, 
        created_at: new Date().toISOString() 
      } as Activity])
    }

    resetForm()
    setShowAddDialog(false)
    setEditingActivity(null)
  }

  const resetForm = () => {
    setFormData({
      title_en: '',
      description_en: '',
      category: '',
      date: '',
      time: '',
      location: '',
      capacity: 50,
      images: [],
      status: 'draft'
    })
    setTranslations({ title_ar: '', description_ar: '' })
  }

  const handleEdit = (activity: Activity) => {
    setFormData({
      title_en: activity.title_en,
      description_en: activity.description_en,
      category: activity.category,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      capacity: activity.capacity,
      images: activity.images,
      status: activity.status
    })
    setTranslations({
      title_ar: activity.title_ar,
      description_ar: activity.description_ar
    })
    setEditingActivity(activity)
    setShowAddDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        // Delete from database
        const { createClient } = await import('@/lib/api/client')
        const api = createClient()
        
        const { error } = await api.activities.delete(id)
        
        if (error) {
          console.error('Error deleting activity:', error)
          alert('Failed to delete activity. Please try again.')
          return
        }
        
        // Remove from local state
        setActivities(prev => prev.filter(act => act.id !== id))
      } catch (error) {
        console.error('Error deleting activity:', error)
        alert('Failed to delete activity. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Activities Management</h1>
            <p className="text-purple-100">Create and manage community activities with automatic Arabic translation</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                onClick={resetForm}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {editingActivity ? 'Edit Activity' : 'Create New Activity'}
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
                            placeholder="Enter activity title in English"
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
                            placeholder="Describe the activity in English"
                            rows={4}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arabic Content (Auto-translated) */}
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                        🇵🇸 Arabic Content (Auto-translated)
                        {isTranslating && <Languages className="w-4 h-4 ml-2 animate-spin" />}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Title (Arabic)</Label>
                          <div className="mt-1 p-3 bg-white border rounded-md text-right" dir="rtl">
                            {translations.title_ar || 'Translation will appear automatically...'}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Description (Arabic)</Label>
                          <div className="mt-1 p-3 bg-white border rounded-md min-h-[100px] text-right" dir="rtl">
                            {translations.description_ar || 'Translation will appear automatically...'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Activity Details</h3>
                  
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
                          {categories.map((category) => (
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
                      <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
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
                        placeholder="Activity location"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="capacity" className="text-sm font-medium">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Activity Images</h3>
                  <ImageUpload
                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                    maxImages={5}
                    existingImages={formData.images}
                  />
                </div>

                {/* Status and Submit */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Activity['status']) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="w-40 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-3">
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
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingActivity ? 'Update' : 'Create'} Activity
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search activities..."
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
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const categoryInfo = getCategoryInfo(activity.category)
          
          return (
            <Card key={activity.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                {activity.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.images[0]}
                      alt={activity.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${categoryInfo.color} text-white`}>
                        {categoryInfo.icon} {categoryInfo.label}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={activity.status === 'published' ? 'default' : 'secondary'}
                        className={activity.status === 'published' ? 'bg-green-500' : ''}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {activity.title_en}
                    </h3>
                    <p className="text-sm text-gray-600 text-right mt-1" dir="rtl">
                      {activity.title_ar}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {activity.description_en}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {activity.capacity}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(activity.id)}
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

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No activities found</div>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
