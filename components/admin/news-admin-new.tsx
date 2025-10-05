"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus, Search, Filter, Star, Eye, TrendingUp, Newspaper, Calendar, Clock, Image } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewsArticle {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  video_url?: string
  featured: boolean
  is_active: boolean
  created_at: string
  date: string
}

export function NewsAdmin() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    image_url: "",
    video_url: "",
    featured: false,
    is_active: true,
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const api = createClient()
      const { data, error } = await api.news.getAll()

      if (error) throw new Error(error.message)
      setArticles(data || [])
    } catch (error: any) {
      console.error("Error fetching articles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch news articles",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const api = createClient()
      
      if (editingArticle) {
        const { error } = await api.news.update(editingArticle.id, formData)

        if (error) throw new Error(error.message)
        
        toast({
          title: "Success",
          description: "Article updated successfully"
        })
      } else {
        const { error } = await api.news.create(formData)

        if (error) throw new Error(error.message)
        
        toast({
          title: "Success",
          description: "Article created successfully"
        })
      }

      fetchArticles()
      resetForm()
      setShowForm(false)
      setEditingArticle(null)
    } catch (error: any) {
      console.error("Error saving article:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      title_en: article.title_en,
      title_ar: article.title_ar,
      content_en: article.content_en,
      content_ar: article.content_ar,
      image_url: article.image_url || "",
      video_url: article.video_url || "",
      featured: article.featured,
      is_active: article.is_active,
      date: article.date
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const api = createClient()
      const { error } = await api.news.delete(id)

      if (error) throw new Error(error.message)
      
      fetchArticles()
      toast({
        title: "Success",
        description: "Article deleted successfully"
      })
    } catch (error: any) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_ar: "",
      content_en: "",
      content_ar: "",
      image_url: "",
      video_url: "",
      featured: false,
      is_active: true,
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleNewArticle = () => {
    setEditingArticle(null)
    resetForm()
    setShowForm(true)
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.title_ar.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeatured = featuredFilter === "all" || 
                           (featuredFilter === "featured" && article.featured) ||
                           (featuredFilter === "regular" && !article.featured)
    return matchesSearch && matchesFeatured
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">News Management</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
          News & Updates
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share the latest news, updates, and stories from the Bil'in community with the world
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-3xl font-bold text-orange-600">{articles.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-yellow-600">{articles.filter(a => a.featured).length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">{articles.filter(a => a.is_active).length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-blue-600">
                  {articles.filter(a => {
                    const articleDate = new Date(a.date)
                    const now = new Date()
                    return articleDate.getMonth() === now.getMonth() && articleDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-[200px] bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Articles</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                  <SelectItem value="regular">Regular Articles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleNewArticle}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <Card 
            key={article.id} 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up overflow-hidden"
            style={{animationDelay: `${index * 100}ms`}}
          >
            {/* Image Header */}
            <div className="relative h-48 overflow-hidden">
              {article.image_url ? (
                <img 
                  src={article.image_url} 
                  alt={article.title_en}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Newspaper className="w-16 h-16 text-white/80" />
                </div>
              )}
              
              <div className="absolute top-4 left-4 flex gap-2">
                {article.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant={article.is_active ? "default" : "secondary"} className="bg-white/90 text-gray-800">
                  {article.is_active ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                  {article.title_en}
                </h3>
                <p className="text-sm text-gray-600 font-arabic mt-1 line-clamp-1">
                  {article.title_ar}
                </p>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {article.content_en}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(article)}
                  className="flex-1 mr-2 hover:bg-orange-50 hover:border-orange-300"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Article</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{article.title_en}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(article.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Newspaper className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || featuredFilter !== "all" 
                ? "No articles match your current filters."
                : "Get started by creating your first news article."
              }
            </p>
            <Button 
              onClick={handleNewArticle}
              className="bg-gradient-to-r from-orange-500 to-amber-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First News
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {editingArticle ? "Edit News" : "Create New News"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title_en" className="text-sm font-medium">Title (English)</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder="Enter article title in English"
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_ar" className="text-sm font-medium">Title (Arabic)</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  placeholder="أدخل عنوان المقال بالعربية"
                  required
                  className="bg-white font-arabic text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">News Image</Label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    {/* File Upload Option */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Upload from Device</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            try {
                              setUploading(true)
                              console.log('🔍 NEWS ADMIN DEBUG - Starting file upload process...')
                              
                              // Convert file to data URL for storage in database
                              const dataUrl = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                  const dataUrl = e.target?.result as string
                                  console.log('🔍 NEWS ADMIN DEBUG - File converted to data URL successfully')
                                  resolve(dataUrl)
                                }
                                reader.onerror = (e) => {
                                  console.error('🔍 NEWS ADMIN DEBUG - FileReader error:', e)
                                  reject(new Error('Failed to read file'))
                                }
                                reader.readAsDataURL(file)
                              })
                              
                              setFormData(prev => ({ ...prev, image_url: dataUrl }))
                            } catch (error) {
                              console.error('🔍 NEWS ADMIN DEBUG - Upload failed:', error)
                              alert('Failed to process image. Please try again.')
                            } finally {
                              setUploading(false)
                            }
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                    </div>
                    
                    {/* URL Option */}
                    <div className="space-y-2">
                      <Label htmlFor="image_url" className="text-xs font-medium text-gray-600">Or Enter Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="bg-white"
                      />
                    </div>
                    
                    {/* Image Preview */}
                    {formData.image_url && (
                      <div className="mt-2">
                        <Label className="text-xs font-medium text-gray-600">Preview</Label>
                        <div className="mt-1 relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setFormData(prev => ({ ...prev, image_url: '' }))
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Publication Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">Publication Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url" className="text-sm font-medium">Video URL (Optional)</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="content_en" className="text-sm font-medium">Content (English)</Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                  placeholder="Enter article content in English"
                  rows={8}
                  required
                  className="bg-white resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_ar" className="text-sm font-medium">Content (Arabic)</Label>
                <Textarea
                  id="content_ar"
                  value={formData.content_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
                  placeholder="أدخل محتوى المقال بالعربية"
                  rows={8}
                  required
                  className="bg-white resize-none font-arabic text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured" className="text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Featured Article
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active" className="text-sm font-medium">Published</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploading}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg transition-all duration-300"
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  editingArticle ? "Update News" : "Create News"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
