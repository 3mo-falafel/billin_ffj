"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Target, DollarSign, MapPin, Calendar, Heart, Users, ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react"

interface Project {
  id: number
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

export default function ProjectsPage() {
  const { language } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        // Fallback to sample data
        console.log('Using fallback sample data for projects')
        setProjects([
          {
            id: 1,
            name: 'Community Greenhouse Project',
            description: 'Building a modern greenhouse to grow fresh vegetables for the community year-round. This project will provide sustainable food source and create job opportunities for local families.',
            location: 'Bil\'in Village Center',
            goal_amount: 25000,
            raised_amount: 8500,
            start_date: '2024-01-15',
            end_date: '2024-06-30',
            status: 'active',
            images: ['/B1.jpg', '/B2.jpg', '/placeholder.jpg'],
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Solar Panel Installation',
            description: 'Installing solar panels on community buildings to reduce electricity costs and promote renewable energy in our village.',
            location: 'Community Center',
            goal_amount: 15000,
            raised_amount: 12000,
            start_date: '2024-02-01',
            status: 'active',
            images: ['/B333333.jpg', '/placeholder.jpg'],
            is_featured: false,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Children\'s Playground',
            description: 'Creating a safe and modern playground for children in the village with swings, slides, and safety equipment.',
            location: 'Village Park Area',
            goal_amount: 18000,
            raised_amount: 3200,
            start_date: '2024-03-01',
            end_date: '2024-07-01',
            status: 'planning',
            images: ['/olive-harvest.png', '/peaceful-demonstration.png'],
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString()
          }
        ])
      } else {
        console.log('Projects loaded from database:', data)
        setProjects(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500'
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-gray-500'
      case 'paused': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return language === 'ar' ? 'قيد التخطيط' : 'Planning'
      case 'active': return language === 'ar' ? 'نشط' : 'Active'
      case 'completed': return language === 'ar' ? 'مكتمل' : 'Completed'
      case 'paused': return language === 'ar' ? 'متوقف' : 'Paused'
      default: return status
    }
  }

  const nextImage = () => {
    if (selectedProject && selectedProject.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length)
    }
  }

  const prevImage = () => {
    if (selectedProject && selectedProject.images.length > 0) {
      setCurrentImageIndex((prev) => prev === 0 ? selectedProject.images.length - 1 : prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <NewsTicker />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <NewsTicker />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Target className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'ar' ? 'مشاريع القرية' : 'Village Projects'}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'مشاريع تنموية لتحسين حياة أهالي بلعين وبناء مستقبل أفضل لأطفالنا'
              : 'Development projects to improve the lives of Bil\'in residents and build a better future for our children'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Projects */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            {language === 'ar' ? 'المشاريع المميزة' : 'Featured Projects'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => p.is_featured).map((project) => {
              const progressPercentage = project.goal_amount > 0 
                ? (project.raised_amount / project.goal_amount) * 100 
                : 0
                
              return (
                <Card key={project.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                      onClick={() => setSelectedProject(project)}>
                  <CardHeader className="p-0">
                    <div className="relative h-56 overflow-hidden">
                      {project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <Badge className={`${getStatusColor(project.status)} text-white`}>
                          {getStatusLabel(project.status)}
                        </Badge>
                        <Badge className="bg-yellow-500 text-white">
                          ⭐ {language === 'ar' ? 'مميز' : 'Featured'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Fundraising Progress */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {language === 'ar' ? 'الهدف:' : 'Goal:'}
                        </span>
                        <span className="text-green-600 font-bold">
                          ${project.goal_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">
                          {language === 'ar' ? 'تم جمعه:' : 'Raised:'}
                        </span>
                        <span className="text-blue-600 font-bold">
                          ${project.raised_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {Math.round(progressPercentage)}% {language === 'ar' ? 'مكتمل' : 'completed'}
                      </p>
                    </div>

                    <Button size="lg" className="w-full bg-green-500 hover:bg-green-600" asChild>
                      <Link href="/donate-projects">
                        <DollarSign className="w-5 h-5 mr-2" />
                        {language === 'ar' ? 'تبرع للمشروع' : 'Donate to Project'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* All Projects */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            {language === 'ar' ? 'جميع المشاريع' : 'All Projects'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.filter(p => !p.is_featured).map((project) => {
              const progressPercentage = project.goal_amount > 0 
                ? (project.raised_amount / project.goal_amount) * 100 
                : 0
                
              return (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedProject(project)}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 flex-shrink-0">
                        {project.images.length > 0 ? (
                          <img
                            src={project.images[0]}
                            alt={project.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {project.name}
                          </h3>
                          <Badge className={`${getStatusColor(project.status)} text-white ml-2`}>
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>{Math.round(progressPercentage)}% {language === 'ar' ? 'مكتمل' : 'funded'}</span>
                          <span className="font-bold text-green-600">
                            ${project.raised_amount.toLocaleString()} / ${project.goal_amount.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {language === 'ar' ? 'لا توجد مشاريع حالياً' : 'No projects currently'}
            </h3>
            <p className="text-gray-500 text-lg">
              {language === 'ar' ? 'ابقوا متابعين للمشاريع الجديدة' : 'Stay tuned for new community projects'}
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl text-white">
          <Users className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'كن جزءاً من التغيير' : 'Be Part of the Change'}
          </h3>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            {language === 'ar'
              ? 'ساعدنا في بناء مستقبل أفضل لقرية بلعين من خلال دعم مشاريعنا التنموية'
              : 'Help us build a better future for Bil\'in village by supporting our development projects'
            }
          </p>
          <Link href="/donate-projects">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-10 py-4 text-xl font-semibold">
              <Heart className="w-6 h-6 mr-3" />
              {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
             onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto relative"
               onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10"
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Image Gallery */}
            <div className="relative h-80 overflow-hidden">
              {selectedProject.images.length > 0 ? (
                <>
                  <img
                    src={selectedProject.images[currentImageIndex]}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  {selectedProject.images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        variant="outline"
                        size="sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        className="absolute right-16 top-1/2 transform -translate-y-1/2"
                        variant="outline"
                        size="sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedProject.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedProject.name}
                  </h2>
                  <Badge className={`${getStatusColor(selectedProject.status)} text-white`}>
                    {getStatusLabel(selectedProject.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {selectedProject.location}
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Detailed Fundraising Info */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4 text-green-800">
                  {language === 'ar' ? 'تفاصيل التمويل' : 'Funding Details'}
                </h3>
                
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'الهدف:' : 'Goal:'}
                    </span>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedProject.goal_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'تم جمعه:' : 'Raised:'}
                    </span>
                    <p className="text-2xl font-bold text-blue-600">
                      ${selectedProject.raised_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((selectedProject.raised_amount / selectedProject.goal_amount) * 100, 100)}%` }}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold text-green-700">
                    {Math.round((selectedProject.raised_amount / selectedProject.goal_amount) * 100)}% {language === 'ar' ? 'مكتمل' : 'completed'}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${(selectedProject.goal_amount - selectedProject.raised_amount).toLocaleString()} {language === 'ar' ? 'متبقي' : 'remaining'}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {language === 'ar' ? 'بدء:' : 'Started:'} {new Date(selectedProject.start_date).toLocaleDateString()}
                </div>
                {selectedProject.end_date && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {language === 'ar' ? 'متوقع الانتهاء:' : 'Expected end:'} {new Date(selectedProject.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Donate Button */}
              <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-lg py-4" asChild>
                <Link href="/donate-projects">
                  <DollarSign className="w-6 h-6 mr-3" />
                  {language === 'ar' ? 'تبرع لهذا المشروع' : 'Donate to This Project'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
