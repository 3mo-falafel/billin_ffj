'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  Image as ImageIcon,
  Play,
  ExternalLink
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface PhotoAlbum {
  id: string
  title: string
  location: string
  images: string[]
  category: string
  created_at: string
}

interface VideoItem {
  id: string
  title: string
  description: string
  video_url: string
  cover_image: string
  category: string
  created_at: string
}

const categories = [
  { value: 'resistance', label: 'Resistance Activities', color: 'bg-red-500', icon: '✊' },
  { value: 'culture', label: 'Cultural Events', color: 'bg-purple-500', icon: '🎭' },
  { value: 'education', label: 'Educational Programs', color: 'bg-blue-500', icon: '📚' },
  { value: 'community', label: 'Community Life', color: 'bg-green-500', icon: '🏘️' },
  { value: 'heritage', label: 'Heritage & Traditions', color: 'bg-orange-500', icon: '🏛️' },
  { value: 'nature', label: 'Nature & Landscape', color: 'bg-emerald-500', icon: '🌿' },
  { value: 'festivals', label: 'Festivals & Celebrations', color: 'bg-yellow-500', icon: '🎉' },
  { value: 'visitors', label: 'International Visitors', color: 'bg-pink-500', icon: '🌍' }
]

export default function GalleryAdminWrapper() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<PhotoAlbum | VideoItem | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Form state for photos
  const [photoFormData, setPhotoFormData] = useState({
    title: '',
    location: '',
    category: '',
    images: [] as string[]
  })

  // Form state for videos
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    cover_image: '',
    category: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      // Load photo albums
      const { data: photoData, error: photoError } = await supabase
        .from('gallery')
        .select('*')
        .eq('media_type', 'image')
        .order('created_at', { ascending: false })
      
      if (photoError) {
        console.error('Error loading photos:', photoError)
      } else {
        // Group photos by title to create albums
        const albumMap = new Map<string, PhotoAlbum>()
        
        photoData?.forEach(item => {
          const key = item.title_en || 'Untitled Album'
          if (!albumMap.has(key)) {
            albumMap.set(key, {
              id: item.id,
              title: item.title_en || 'Untitled Album',
              location: 'Bil\'in, Palestine',
              images: [],
              category: item.category || 'general',
              created_at: item.created_at
            })
          }
          if (item.media_url) {
            albumMap.get(key)!.images.push(item.media_url)
          }
        })
        
        setPhotoAlbums(Array.from(albumMap.values()))
      }

      // Load videos
      const { data: videoData, error: videoError } = await supabase
        .from('gallery')
        .select('*')
        .eq('media_type', 'video')
        .order('created_at', { ascending: false })
      
      if (videoError) {
        console.error('Error loading videos:', videoError)
      } else {
        const videoItems: VideoItem[] = (videoData || []).map(item => {
          // Extract cover image from description
          const coverMatch = item.description_en?.match(/COVER_IMAGE:([^|]+)/);
          const coverImage = coverMatch ? coverMatch[1] : '';
          
          // Clean description by removing cover image info
          const cleanDescription = item.description_en?.replace(/\s*\|\s*COVER_IMAGE:[^|]+/, '') || '';
          
          return {
            id: item.id,
            title: item.title_en || 'Untitled Video',
            description: cleanDescription,
            video_url: item.media_url || '',
            cover_image: coverImage,
            category: item.category || 'general',
            created_at: item.created_at
          };
        })
        
        setVideos(videoItems)
      }
    } catch (error) {
      console.error('Failed to load gallery data:', error)
    }
  }

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0]
  }

  const filteredPhotos = photoAlbums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         album.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || album.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
            <p className="text-emerald-100">Simple photo albums and video gallery management</p>
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
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Content
            </Button>
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
                placeholder="Search by title or location..."
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
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'photos' | 'videos')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">Photo Albums ({filteredPhotos.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({filteredVideos.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="photos">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((album) => {
                const categoryInfo = getCategoryInfo(album.category)
                
                return (
                  <Card key={album.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                      {album.images.length > 0 && (
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={album.images[0]}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setPreviewImage(album.images[0])}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className={`${categoryInfo.color} text-white`}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-black bg-opacity-50 text-white">
                              {album.images.length} photos
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                            {album.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            📍 {album.location}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingItem(album)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setPreviewImage(album.images[0])}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => alert('Delete functionality coming soon')}
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
              {filteredPhotos.map((album) => {
                const categoryInfo = getCategoryInfo(album.category)
                
                return (
                  <Card key={album.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {album.images.length > 0 && (
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <img
                              src={album.images[0]}
                              alt={album.title}
                              className="w-full h-full object-cover rounded-lg cursor-pointer"
                              onClick={() => setPreviewImage(album.images[0])}
                            />
                            <Badge className="absolute top-2 left-2 text-xs bg-black bg-opacity-50 text-white">
                              {album.images.length}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-xl text-gray-800">{album.title}</h3>
                                <p className="text-gray-600">📍 {album.location}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`${categoryInfo.color} text-white`}>
                                  {categoryInfo.icon} {categoryInfo.label}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingItem(album)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setPreviewImage(album.images[0])}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                            
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => alert('Delete functionality coming soon')}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((video) => {
              const categoryInfo = getCategoryInfo(video.category)
              
              return (
                <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      {video.cover_image ? (
                        <img
                          src={video.cover_image}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                            <p className="text-lg font-semibold">{video.title}</p>
                            <p className="text-sm opacity-80">Click to watch</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-black"
                          onClick={() => window.open(video.video_url, '_blank')}
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Watch Video
                        </Button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryInfo.color} text-white`}>
                          {categoryInfo.icon} {categoryInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(video)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => window.open(video.video_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => alert('Delete functionality coming soon')}
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
        </TabsContent>
      </Tabs>

      {filteredPhotos.length === 0 && filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No content found</div>
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

