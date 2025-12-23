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
  title_en: string
  location: string
  images: string[]
  thumbnail?: string  // First image as thumbnail
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
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<PhotoAlbum | VideoItem | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAlbum, setIsLoadingAlbum] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
      setIsLoading(true)
      console.log('📸 GalleryAdminWrapper - Loading data...')
      
      const { createClient } = await import('@/lib/api/client')
      const api = createClient()
      
      // Load photo albums with thumbnails (first image per album)
      // Use active: false to get ALL items for admin management
      const { data: photoData, error: photoError, mode } = await api.gallery.getAll({ 
        media_type: 'image',
        with_thumbnails: true,  // Get albums with first image as thumbnail
        active: false  // Get ALL items including inactive for admin
      }) as { data: any; error: any; mode?: string }
      
      console.log('📸 GalleryAdminWrapper - Photo response:', { photoData, photoError, mode })
      
      if (photoError) {
        console.error('Error loading photos:', photoError)
      } else if (mode === 'albums_with_thumbnails' && photoData) {
        // Data is already grouped into albums with thumbnails
        const albums: PhotoAlbum[] = photoData.map((item: any) => ({
          id: item.id,
          title: item.title_en || 'Untitled Album',
          title_en: item.title_en || 'Untitled Album',
          location: 'Bil\'in, Palestine',
          images: Array(item.imageCount).fill('placeholder'),
          thumbnail: item.thumbnail,
          category: item.category || 'general',
          created_at: item.created_at
        }))
        console.log('📸 GalleryAdminWrapper - Albums created:', albums.length, albums)
        setPhotoAlbums(albums)
      } else if (photoData && !mode) {
        // Fallback: data is raw items, group them manually
        console.log('📸 GalleryAdminWrapper - Raw data, grouping manually:', photoData.length)
        const albumMap = new Map<string, PhotoAlbum>()
        
        photoData.forEach((item: any) => {
          const key = item.title_en || 'Untitled Album'
          if (!albumMap.has(key)) {
            albumMap.set(key, {
              id: item.id,
              title: item.title_en || 'Untitled Album',
              title_en: item.title_en || 'Untitled Album',
              location: 'Bil\'in, Palestine',
              images: [],
              thumbnail: item.media_url,
              category: item.category || 'general',
              created_at: item.created_at
            })
          }
          if (item.media_url) {
            albumMap.get(key)!.images.push(item.media_url)
          }
        })
        
        const albums = Array.from(albumMap.values())
        console.log('📸 GalleryAdminWrapper - Manually grouped albums:', albums.length, albums)
        setPhotoAlbums(albums)
      }

      // Load videos - also with active: false for admin
      const { data: videoData, error: videoError } = await api.gallery.getAll({ 
        media_type: 'video',
        active: false 
      })
      
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
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0]
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        console.log('🔍 GALLERY ADMIN DEBUG - Deleting photo:', photoId)
        
        const response = await fetch(`/api/gallery/${photoId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
        
        const result = await response.json()
        console.log('🔍 GALLERY ADMIN DEBUG - Delete response:', result)
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        console.log('🔍 GALLERY ADMIN DEBUG - Photo deleted successfully')
        
        // Reload data to refresh the list
        await loadData()
        alert('Photo deleted successfully!')
        
      } catch (error: any) {
        console.error('🔍 GALLERY ADMIN DEBUG - Error deleting photo:', error)
        alert(`Failed to delete photo: ${error.message}`)
      }
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        console.log('🔍 GALLERY ADMIN DEBUG - Deleting video:', videoId)
        
        const response = await fetch(`/api/gallery/${videoId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
        
        const result = await response.json()
        console.log('🔍 GALLERY ADMIN DEBUG - Delete response:', result)
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        console.log('🔍 GALLERY ADMIN DEBUG - Video deleted successfully')
        
        // Reload data to refresh the list
        await loadData()
        alert('Video deleted successfully!')
        
      } catch (error: any) {
        console.error('🔍 GALLERY ADMIN DEBUG - Error deleting video:', error)
        alert(`Failed to delete video: ${error.message}`)
      }
    }
  }

  const handleDeleteAlbum = async (albumTitle: string, imageCount: number) => {
    const confirmMessage = `Are you sure you want to delete the entire album "${albumTitle}"?\n\nThis will permanently delete all ${imageCount} image(s) in this album.\n\nThis action cannot be undone.`
    
    if (confirm(confirmMessage)) {
      try {
        const response = await fetch('/api/gallery/album', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ albumTitle }),
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
        
        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        // Reload data to refresh the list
        await loadData()
        alert(`Album "${albumTitle}" deleted successfully! (${result.deletedCount} images removed)`)
        
      } catch (error: any) {
        console.error('Error deleting album:', error)
        alert(`Failed to delete album: ${error.message}`)
      }
    }
  }

  // Load album images on demand for editing
  const openEditAlbum = async (album: PhotoAlbum) => {
    setIsLoadingAlbum(true)
    setEditingItem(album)
    
    try {
      // Fetch the actual images for this album
      const response = await fetch(`/api/gallery/album?title=${encodeURIComponent(album.title_en)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.data && result.data.length > 0) {
        const images = result.data.map((img: { media_url: string }) => img.media_url)
        setPhotoFormData({
          title: album.title,
          location: album.location,
          category: album.category,
          images: images
        })
      } else {
        setPhotoFormData({
          title: album.title,
          location: album.location,
          category: album.category,
          images: []
        })
      }
      
      setShowEditDialog(true)
    } catch (error) {
      console.error('Error loading album images:', error)
      alert('Failed to load album images')
    } finally {
      setIsLoadingAlbum(false)
    }
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
            <p className="text-emerald-100">
              Simple photo albums and video gallery management
              {isLoading && <span className="ml-2 animate-pulse">⏳ Loading...</span>}
            </p>
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

      {/* Loading overlay when loading album for edit */}
      {isLoadingAlbum && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700">Loading album images...</p>
          </div>
        </div>
      )}

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
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {/* Show thumbnail if available and valid (not base64), otherwise placeholder */}
                        {album.thumbnail && !album.thumbnail.startsWith('data:') ? (
                          <img
                            src={album.thumbnail}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              // On error, hide the image and show placeholder
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-16 h-16 mb-2" />
                            <span className="text-sm">No preview available</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${categoryInfo.color} text-white`}>
                            {categoryInfo.icon} {categoryInfo.label}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-black bg-opacity-50 text-white">
                            {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
                          </Badge>
                        </div>
                      </div>
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
                            <Button size="sm" variant="outline" onClick={() => openEditAlbum(album)} disabled={isLoadingAlbum}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => alert('Preview: Click View button after selecting an album')} disabled={true}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteAlbum(album.title_en, album.images.length)}
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
                        <div className="relative w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                          {album.thumbnail && !album.thumbnail.startsWith('data:') ? (
                            <img
                              src={album.thumbnail}
                              alt={album.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                          <Badge className="absolute top-2 left-2 text-xs bg-black bg-opacity-50 text-white">
                            {album.images.length}
                          </Badge>
                        </div>
                        
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
                            <Button size="sm" variant="outline" onClick={() => openEditAlbum(album)} disabled={isLoadingAlbum}>
                              <Edit className="w-4 h-4 mr-1" />
                              {isLoadingAlbum ? 'Loading...' : 'Edit'}
                            </Button>
                              <Button size="sm" variant="outline" onClick={() => alert('Preview: Click View button after editing an album')} disabled={true}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                            
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteAlbum(album.title_en, album.images.length)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete Album
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
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingItem(video)
                            setVideoFormData({
                              title: video.title,
                              description: video.description,
                              video_url: video.video_url,
                              cover_image: video.cover_image,
                              category: video.category
                            })
                            setShowEditDialog(true)
                          }}>
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
                          onClick={() => handleDeleteVideo(video.id)}
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

      {/* Add Content Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Content' : 'Add New Content'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'photos' | 'videos')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">Photo Album</TabsTrigger>
              <TabsTrigger value="videos">Video</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photo-title">Album Title</Label>
                  <Input
                    id="photo-title"
                    value={photoFormData.title}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                    placeholder="Enter album title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo-location">Location</Label>
                  <Input
                    id="photo-location"
                    value={photoFormData.location}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, location: e.target.value })}
                    placeholder="Enter location..."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo-category">Category</Label>
                <Select value={photoFormData.category} onValueChange={(value) => setPhotoFormData({ ...photoFormData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Images</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length === 0) return
                    
                    console.log('🔍 GALLERY ADMIN DEBUG - Starting image uploads with compression...', files.length, 'files')
                    
                    // Function to upload image to server with compression
                    const uploadImage = async (file: File): Promise<string> => {
                      console.log('🔍 Uploading:', file.name, '- Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
                      
                      const formData = new FormData()
                      formData.append('file', file)
                      formData.append('maxWidth', '1600')
                      formData.append('quality', '80')
                      formData.append('generateThumbnail', 'true')
                      formData.append('maxFileSizeKB', '150')

                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                      })

                      const responseText = await response.text()
                      console.log('🔍 Upload response status:', response.status, 'body:', responseText)
                      
                      if (!response.ok) {
                        let errorMsg = 'Upload failed'
                        try {
                          const errorData = JSON.parse(responseText)
                          errorMsg = errorData.error || errorData.details || errorMsg
                        } catch { }
                        throw new Error(errorMsg)
                      }

                      const result = JSON.parse(responseText)
                      const imageUrl = result.data?.url || result.url
                      console.log('🔍 GALLERY ADMIN DEBUG - Uploaded:', file.name, '→', imageUrl)
                      return imageUrl
                    }
                    
                    try {
                      // Upload all images to server (replaces existing, not adds to them)
                      const imageUrls = await Promise.all(files.map(file => uploadImage(file)))
                      console.log('🔍 GALLERY ADMIN DEBUG - All images uploaded successfully:', imageUrls.length)
                      // Replace images completely (not append)
                      setPhotoFormData(prev => ({ ...prev, images: imageUrls }))
                    } catch (error: any) {
                      console.error('🔍 GALLERY ADMIN DEBUG - Error uploading images:', error)
                      alert('Failed to upload images: ' + (error.message || 'Unknown error'))
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground">Select images for the album (auto-compressed to ~150KB each)</p>
                <p className="text-xs text-green-600">✓ Large files automatically compressed</p>
                {photoFormData.images.length > 0 && (
                  <p className="text-sm text-green-600">✅ {photoFormData.images.length} image(s) ready to upload</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  try {
                    setIsSaving(true)
                    console.log('🔍 GALLERY ADMIN DEBUG - Saving photo album:', photoFormData)
                    
                    if (!photoFormData.title || !photoFormData.category || photoFormData.images.length === 0) {
                      alert('Please fill in all required fields and add at least one image')
                      return
                    }
                    
                    const { createClient } = await import('@/lib/api/client')
                    const api = createClient()
                    
                    // Create gallery entries for each image
                    for (let i = 0; i < photoFormData.images.length; i++) {
                      const imageData = {
                        title_en: photoFormData.title,
                        title_ar: photoFormData.title, // Could be translated
                        description_en: photoFormData.location,
                        description_ar: photoFormData.location, // Could be translated
                        media_url: photoFormData.images[i],
                        media_type: 'image',
                        category: photoFormData.category,
                        is_active: true
                      }
                      
                      const { error } = await api.gallery.create(imageData)
                      if (error) {
                        throw new Error(`Failed to save image ${i + 1}: ${error.message}`)
                      }
                    }
                    
                    console.log('🔍 GALLERY ADMIN DEBUG - Photo album saved successfully')
                    
                    // Reload data and close dialog
                    await loadData()
                    setShowAddDialog(false)
                    setPhotoFormData({ title: '', location: '', category: '', images: [] })
                    alert('Photo album created successfully!')
                    
                  } catch (error: any) {
                    console.error('🔍 GALLERY ADMIN DEBUG - Error saving photo album:', error)
                    alert(`Failed to save photo album: ${error.message}`)
                  } finally {
                    setIsSaving(false)
                  }
                }} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Album'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    placeholder="Enter video title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-category">Category</Label>
                  <Select value={videoFormData.category} onValueChange={(value) => setVideoFormData({ ...videoFormData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-description">Description</Label>
                <Input
                  id="video-description"
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                  placeholder="Enter video description..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={videoFormData.video_url}
                  onChange={(e) => setVideoFormData({ ...videoFormData, video_url: e.target.value })}
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cover-image">Cover Image URL</Label>
                <Input
                  id="cover-image"
                  value={videoFormData.cover_image}
                  onChange={(e) => setVideoFormData({ ...videoFormData, cover_image: e.target.value })}
                  placeholder="Enter cover image URL..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  try {
                    setIsSaving(true)
                    console.log('🔍 GALLERY ADMIN DEBUG - Saving video:', videoFormData)
                    
                    if (!videoFormData.title || !videoFormData.video_url || !videoFormData.category) {
                      alert('Please fill in all required fields')
                      return
                    }
                    
                    const { createClient } = await import('@/lib/api/client')
                    const api = createClient()
                    
                    // Store cover image in description for now (could be improved)
                    const description = videoFormData.description + 
                      (videoFormData.cover_image ? ` | COVER_IMAGE:${videoFormData.cover_image}` : '')
                    
                    const videoData = {
                      title_en: videoFormData.title,
                      title_ar: videoFormData.title, // Could be translated
                      description_en: description,
                      description_ar: description, // Could be translated
                      media_url: videoFormData.video_url,
                      media_type: 'video',
                      category: videoFormData.category,
                      is_active: true
                    }
                    
                    const { error } = await api.gallery.create(videoData)
                    if (error) {
                      throw new Error(error.message)
                    }
                    
                    console.log('🔍 GALLERY ADMIN DEBUG - Video saved successfully')
                    
                    // Reload data and close dialog
                    await loadData()
                    setShowAddDialog(false)
                    setVideoFormData({ title: '', description: '', video_url: '', cover_image: '', category: '' })
                    alert('Video created successfully!')
                    
                  } catch (error: any) {
                    console.error('🔍 GALLERY ADMIN DEBUG - Error saving video:', error)
                    alert(`Failed to save video: ${error.message}`)
                  } finally {
                    setIsSaving(false)
                  }
                }} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Video'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open)
        if (!open) {
          setEditingItem(null)
          setPhotoFormData({ title: '', location: '', category: '', images: [] })
          setVideoFormData({ title: '', description: '', video_url: '', cover_image: '', category: '' })
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingItem && 'images' in editingItem ? 'Photo Album' : 'Video'}</DialogTitle>
          </DialogHeader>
          
          {editingItem && 'images' in editingItem ? (
            // Edit Photo Album
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-photo-title">Album Title</Label>
                  <Input
                    id="edit-photo-title"
                    value={photoFormData.title}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                    placeholder="Enter album title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-photo-location">Location</Label>
                  <Input
                    id="edit-photo-location"
                    value={photoFormData.location}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, location: e.target.value })}
                    placeholder="Enter location..."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-photo-category">Category</Label>
                <Select value={photoFormData.category} onValueChange={(value) => setPhotoFormData({ ...photoFormData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Current Images ({photoFormData.images.length})</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.multiple = true
                      input.onchange = async (e) => {
                        const files = (e.target as HTMLInputElement).files
                        if (!files || files.length === 0) return
                        
                        const newImages: string[] = []
                        for (const file of Array.from(files)) {
                          // Upload the image to server with compression
                          const formData = new FormData()
                          formData.append('file', file)
                          formData.append('maxWidth', '1600')
                          formData.append('quality', '80')
                          formData.append('generateThumbnail', 'true')
                          formData.append('maxFileSizeKB', '150') // Target max 150KB

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          })

                          if (!response.ok) {
                            const error = await response.json()
                            console.error('Upload failed:', error)
                            continue
                          }

                          const result = await response.json()
                          const imageUrl = result.data?.url || result.url
                          console.log('🔍 GALLERY ADMIN DEBUG - Uploaded image:', file.name, '→', imageUrl)
                          newImages.push(imageUrl)
                        }
                        
                        setPhotoFormData({ 
                          ...photoFormData, 
                          images: [...photoFormData.images, ...newImages] 
                        })
                      }
                      input.click()
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Images
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {photoFormData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img 
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%236b7280" font-size="12" x="50%25" y="50%25" text-anchor="middle"%3EImg ' + (idx + 1) + '%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={() => {
                          const newImages = photoFormData.images.filter((_, i) => i !== idx)
                          setPhotoFormData({ ...photoFormData, images: newImages })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Click X to remove images, or use &quot;Add Images&quot; button to add more</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  try {
                    setIsSaving(true)
                    
                    if (!photoFormData.title || !photoFormData.category) {
                      alert('Please fill in all required fields')
                      return
                    }
                    
                    if (photoFormData.images.length === 0) {
                      alert('Album must have at least one image')
                      return
                    }
                    
                    // Use the album API to update/add/remove images
                    const response = await fetch('/api/gallery/album', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        originalTitle: editingItem!.title_en,
                        newTitle: photoFormData.title,
                        location: photoFormData.location || 'Bil\'in, Palestine',
                        category: photoFormData.category,
                        images: photoFormData.images
                      }),
                    })
                    
                    if (!response.ok) {
                      const errorData = await response.json()
                      throw new Error(errorData.error || 'Failed to update album')
                    }
                    
                    await loadData()
                    setShowEditDialog(false)
                    setEditingItem(null)
                    
                  } catch (error: any) {
                    console.error('Error updating album:', error)
                    alert(`Failed to update album: ${error.message}`)
                  } finally {
                    setIsSaving(false)
                  }
                }} disabled={isSaving}>
                  {isSaving ? 'Updating...' : 'Update Album'}
                </Button>
              </div>
            </div>
          ) : editingItem ? (
            // Edit Video
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-video-title">Video Title</Label>
                <Input
                  id="edit-video-title"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="Enter video title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-video-description">Description</Label>
                <Input
                  id="edit-video-description"
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                  placeholder="Enter description..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-video-category">Category</Label>
                <Select value={videoFormData.category} onValueChange={(value) => setVideoFormData({ ...videoFormData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-video-url">Video URL</Label>
                <Input
                  id="edit-video-url"
                  value={videoFormData.video_url}
                  onChange={(e) => setVideoFormData({ ...videoFormData, video_url: e.target.value })}
                  placeholder="Enter video URL..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-cover-image">Cover Image URL</Label>
                <Input
                  id="edit-cover-image"
                  value={videoFormData.cover_image}
                  onChange={(e) => setVideoFormData({ ...videoFormData, cover_image: e.target.value })}
                  placeholder="Enter cover image URL..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  try {
                    setIsSaving(true)
                    alert('Edit feature for videos coming soon. Please delete and recreate for now.')
                    setShowEditDialog(false)
                  } catch (error: any) {
                    alert(`Failed to update video: ${error.message}`)
                  } finally {
                    setIsSaving(false)
                  }
                }} disabled={isSaving}>
                  {isSaving ? 'Updating...' : 'Update Video'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

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

