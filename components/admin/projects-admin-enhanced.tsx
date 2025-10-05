'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Target,
  Users
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
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Switch } from '../ui/switch'

interface Project {
  id: string
  name: string
  description: string
  location: string
  goal_amount: number
  raised_amount: number
  start_date: string
  end_date?: string
  status: 'planning' | 'active' | 'completed' | 'paused'
  images: string[]
  is_featured: boolean
  is_active: boolean
  created_at: string
}

const projectStatuses = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-500', icon: '📋' },
  { value: 'active', label: 'Active', color: 'bg-green-500', icon: '🚀' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-500', icon: '✅' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-500', icon: '⏸️' }
]

export default function ProjectsAdminEnhanced() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    goal_amount: 0,
    start_date: '',
    end_date: '',
    status: 'planning' as Project['status'],
    images: [] as string[],
    is_featured: false,
    is_active: true
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()
      
      if (result.success) {
        setProjects(result.data || [])
        return
      }
      
      const error = result.error
      
      if (error) {
        console.error('Error loading projects:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        
        // Fallback to sample data if database fails
        setProjects([
          {
            id: 'sample-1',
            name: 'Community Greenhouse Project',
            description: 'Building a modern greenhouse to grow fresh vegetables for the community year-round. This project will provide sustainable food source and create job opportunities.',
            location: 'Bil\'in Village Center',
            goal_amount: 25000,
            raised_amount: 8500,
            start_date: '2024-01-15',
            end_date: '2024-06-30',
            status: 'active',
            images: ['/placeholder.jpg'],
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'sample-2',
            name: 'Solar Panel Installation',
            description: 'Installing solar panels on community buildings to reduce electricity costs and promote renewable energy.',
            location: 'Community Center',
            goal_amount: 15000,
            raised_amount: 12000,
            start_date: '2024-02-01',
            status: 'active',
            images: ['/placeholder.jpg'],
            is_featured: false,
            is_active: true,
            created_at: new Date().toISOString()
          }
        ])
        return
      }
      
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects([])
    }
  }

  const openAddDialog = () => {
    setEditingProject(null)
    resetForm()
    setShowAddDialog(true)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      location: project.location,
      goal_amount: project.goal_amount,
      start_date: project.start_date,
      end_date: project.end_date || '',
      status: project.status,
      images: project.images,
      is_featured: project.is_featured,
      is_active: project.is_active
    })
    setShowAddDialog(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      goal_amount: 0,
      start_date: '',
      end_date: '',
      status: 'planning',
      images: [],
      is_featured: false,
      is_active: true
    })
  }

  const handleSubmit = async () => {
    try {
      // Using API fetch calls instead of Supabase
      
      const projectData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        goal_amount: formData.goal_amount,
        raised_amount: editingProject?.raised_amount || 0,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        status: formData.status,
        images: formData.images,
        is_featured: formData.is_featured,
        is_active: formData.is_active
      }

      if (editingProject) {
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.error)
      } else {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.error)
      }

      await loadProjects()
      setShowAddDialog(false)
      resetForm()
      setEditingProject(null)
      
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
      
    } catch (error) {
      console.error('Error saving project:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      alert(`Failed to save project. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.error)
        
        await loadProjects()
        alert('Project deleted successfully!')
        
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const getStatusInfo = (status: string) => {
    return projectStatuses.find(s => s.value === status) || projectStatuses[0]
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // For now, create blob URLs for preview (in production, upload to cloud storage)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Village Projects Management</h1>
            <p className="text-green-100">Manage community development projects and fundraising campaigns</p>
          </div>
          <Button 
            onClick={openAddDialog}
            size="lg" 
            className="bg-white text-green-600 hover:bg-green-50 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const statusInfo = getStatusInfo(project.status)
          const progressPercentage = project.goal_amount > 0 
            ? (project.raised_amount / project.goal_amount) * 100 
            : 0
          
          return (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                {project.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <Badge className={`${statusInfo.color} text-white`}>
                        {statusInfo.icon} {statusInfo.label}
                      </Badge>
                      {project.is_featured && (
                        <Badge className="bg-yellow-500 text-white">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black bg-opacity-50 text-white">
                        {project.images.length} photos
                      </Badge>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {project.description}
                  </p>

                  {/* Fundraising Progress */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fundraising Goal:</span>
                      <span className="text-green-600 font-bold">${project.goal_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Amount Raised:</span>
                      <span className="text-blue-600 font-bold">${project.raised_amount.toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      {Math.round(progressPercentage)}% completed
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.start_date).toLocaleDateString()}
                    </div>
                    {project.end_date && (
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {new Date(project.end_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(project.id)}
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

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No projects found</div>
          <p className="text-gray-500">Start by creating your first village project</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {editingProject ? 'Edit Project' : 'Create New Village Project'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Project Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Community Greenhouse, Solar Panel Installation"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project, its goals, and expected impact on the community"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Village Center, Main Street"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Project Status</Label>
                    <Select value={formData.status} onValueChange={(value: Project['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.icon} {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Fundraising */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Fundraising Details</h3>
              
              <div>
                <Label htmlFor="goal_amount">Fundraising Goal ($)</Label>
                <Input
                  id="goal_amount"
                  type="number"
                  min="0"
                  max="1000000"
                  value={formData.goal_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal_amount: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter fundraising goal amount"
                  required
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Project Timeline</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Expected End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Project Images</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Project Photos</Label>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured Project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
              <Save className="w-4 h-4 mr-2" />
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
