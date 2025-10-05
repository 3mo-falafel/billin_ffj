"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
// Using API endpoints instead of Supabase client
import { GraduationCap, DollarSign, Heart, Mail, Phone, UserCheck, Users } from "lucide-react"

interface Scholarship {
  id: number
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  category: 'awarded' | 'available' | 'sponsor_opportunity'
  student_name?: string
  university_name?: string
  scholarship_amount?: number
  deadline?: string
  requirements_en?: string
  requirements_ar?: string
  contact_info?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export default function ScholarshipsPage() {
  const { language } = useLanguage()
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScholarships()
  }, [])

  const fetchScholarships = async () => {
    try {
      console.log('🔍 SCHOLARSHIPS PUBLIC DEBUG - Loading scholarships from API...')
      
      const response = await fetch('/api/scholarships?active=true')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🔍 SCHOLARSHIPS PUBLIC DEBUG - API response:', result)
      
      if (result.data) {
        console.log('🔍 SCHOLARSHIPS PUBLIC DEBUG - Loaded scholarships:', result.data.length, 'items')
        setScholarships(result.data || [])
      } else if (result.error) {
        console.error('🔍 SCHOLARSHIPS PUBLIC DEBUG - API error:', result.error)
        setScholarships([])
      } else {
        console.error('🔍 SCHOLARSHIPS PUBLIC DEBUG - Unexpected response format')
        setScholarships([])
      }
    } catch (error: any) {
      console.error('🔍 SCHOLARSHIPS PUBLIC DEBUG - Error loading scholarships:', error)
      setScholarships([])
    } finally {
      setLoading(false)
    }
  }

  const getScholarshipsByCategory = (category: string) => {
    return scholarships.filter(s => s.category === category)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <NewsTicker />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
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
      <section className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'ar' ? 'المنح الدراسية' : 'Scholarships'}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'نساعد طلاب بلعين في تحقيق أحلامهم التعليمية من خلال المنح الدراسية والدعم الأكاديمي'
              : 'Helping Bil\'in students achieve their educational dreams through scholarships and academic support'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="needing-help" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="needing-help" className="flex items-center gap-2 px-6 py-3">
              <Heart className="w-4 h-4" />
              {language === 'ar' ? 'طلاب يحتاجون مساعدة' : 'Students Needing Help'}
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2 px-6 py-3">
              <GraduationCap className="w-4 h-4" />
              {language === 'ar' ? 'المنح المتاحة' : 'Available Scholarships'}
            </TabsTrigger>
            <TabsTrigger value="helped" className="flex items-center gap-2 px-6 py-3">
              <UserCheck className="w-4 h-4" />
              {language === 'ar' ? 'طلاب ساعدناهم' : 'Students We Helped'}
            </TabsTrigger>
          </TabsList>

          {/* Students Needing Help */}
          <TabsContent value="needing-help">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {language === 'ar' ? 'طلاب يحتاجون مساعدة مالية' : 'Students Needing Help'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  {language === 'ar'
                    ? 'هؤلاء الطلاب يحتاجون دعمكم لمواصلة تعليمهم. كل تبرع يقربهم خطوة من تحقيق أحلامهم'
                    : 'These students need your support to continue their education. Every donation brings them closer to achieving their dreams'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getScholarshipsByCategory('sponsor_opportunity').map((scholarship) => (
                  <Card key={scholarship.id} className="border-red-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                            {scholarship.student_name || (language === 'ar' ? scholarship.title_ar : scholarship.title_en)}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{scholarship.university_name}</p>
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          {language === 'ar' ? 'يحتاج مساعدة' : 'Needs Help'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            {language === 'ar' ? 'المبلغ المطلوب:' : 'Amount Needed:'}
                          </span>
                          <span className="text-red-600 font-bold text-xl">
                            ${scholarship.scholarship_amount?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full" style={{ width: '25%' }} />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          {language === 'ar' ? '25% من الهدف تم جمعه' : '25% of goal reached'}
                        </p>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? scholarship.description_ar : scholarship.description_en}
                      </p>
                      
                      {scholarship.requirements_en && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <strong>{language === 'ar' ? 'تفاصيل الطالب:' : 'Student Details:'}</strong>
                          <p className="mt-1">{scholarship.requirements_en}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Button size="lg" className="bg-green-500 hover:bg-green-600 flex-1" asChild>
                          <Link href="/donate">
                            <DollarSign className="w-5 h-5 mr-2" />
                            {language === 'ar' ? 'تبرع للطالب' : 'Donate for Student'}
                          </Link>
                        </Button>
                        {scholarship.contact_info && (
                          <Button size="lg" variant="outline" asChild>
                            <a href={`mailto:${scholarship.contact_info}`}>
                              <Mail className="w-5 h-5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {getScholarshipsByCategory('sponsor_opportunity').length === 0 && (
                <div className="text-center py-16">
                  <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                    {language === 'ar' ? 'لا يوجد طلاب يحتاجون مساعدة حالياً' : 'No students need help currently'}
                  </h3>
                  <p className="text-gray-500 text-lg">
                    {language === 'ar' ? 'سيتم عرض الطلاب هنا عند إضافتهم من لوحة الإدارة' : 'Students will appear here when added from the admin dashboard'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Available Scholarships */}
          <TabsContent value="available">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {language === 'ar' ? 'المنح الدراسية المتاحة' : 'Available Scholarships'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  {language === 'ar'
                    ? 'منح دراسية متاحة للطلاب المؤهلين. تقدم بطلبك الآن واحصل على فرصة لتحقيق حلمك التعليمي'
                    : 'Scholarships available for qualified students. Apply now and get a chance to achieve your educational dreams'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {getScholarshipsByCategory('available').map((scholarship) => (
                  <Card key={scholarship.id} className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                            {language === 'ar' ? scholarship.title_ar : scholarship.title_en}
                          </h3>
                          <p className="text-blue-600 font-bold text-2xl mt-2">
                            ${scholarship.scholarship_amount?.toLocaleString() || 0}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {language === 'ar' ? 'متاح للتقديم' : 'Open for Applications'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? scholarship.description_ar : scholarship.description_en}
                      </p>
                      
                      {scholarship.requirements_en && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 text-blue-800">
                            {language === 'ar' ? 'المتطلبات:' : 'Requirements:'}
                          </h4>
                          <p className="text-sm text-blue-700">
                            {language === 'ar' ? scholarship.requirements_ar : scholarship.requirements_en}
                          </p>
                        </div>
                      )}
                      
                      {scholarship.deadline && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {language === 'ar' ? 'آخر موعد للتقديم:' : 'Application Deadline:'}
                          </span>
                          <span className="text-blue-600 font-medium">
                            {new Date(scholarship.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 text-gray-800">
                          {language === 'ar' ? 'للتواصل والتقديم:' : 'Contact to Apply:'}
                        </h4>
                        {scholarship.contact_info && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${scholarship.contact_info}`} className="hover:underline">
                              {scholarship.contact_info}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                        <a href={`mailto:${scholarship.contact_info || 'ffj.mediacenter@gmail.com'}?subject=Scholarship Application - ${scholarship.title_en}`}>
                          <GraduationCap className="w-5 h-5 mr-2" />
                          {language === 'ar' ? 'تقدم للمنحة' : 'Apply for Scholarship'}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {getScholarshipsByCategory('available').length === 0 && (
                <div className="text-center py-16">
                  <GraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                    {language === 'ar' ? 'لا توجد منح متاحة حالياً' : 'No scholarships available currently'}
                  </h3>
                  <p className="text-gray-500 text-lg">
                    {language === 'ar' ? 'ابقوا متابعين للمنح الجديدة' : 'Stay tuned for new scholarship opportunities'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Students We Helped - Success Stories */}
          <TabsContent value="helped">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {language === 'ar' ? 'قصص نجاح طلابنا' : 'Our Students\' Success Stories'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  {language === 'ar'
                    ? 'نفتخر بإنجازات طلابنا الذين ساعدناهم في تحقيق أحلامهم التعليمية'
                    : 'We are proud of the achievements of our students whom we helped achieve their educational dreams'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getScholarshipsByCategory('awarded').map((scholarship) => (
                  <Card key={scholarship.id} className="border-green-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                            {scholarship.student_name || (language === 'ar' ? scholarship.title_ar : scholarship.title_en)}
                          </h3>
                          <p className="text-green-600 font-bold text-lg mt-1">
                            ${scholarship.scholarship_amount?.toLocaleString() || 0} {language === 'ar' ? 'حصل عليها' : 'received'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {language === 'ar' ? 'تم مساعدته' : 'Helped'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-800">{scholarship.university_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? scholarship.title_ar : scholarship.title_en}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-green-800">
                          {language === 'ar' ? 'قصة النجاح:' : 'Success Story:'}
                        </h4>
                        <p className="text-sm text-green-700">
                          {language === 'ar' ? scholarship.description_ar : scholarship.description_en}
                        </p>
                      </div>
                      
                      {scholarship.requirements_en && (
                        <div className="text-sm text-gray-600">
                          <strong>{language === 'ar' ? 'الوضع الحالي:' : 'Current Status:'}</strong>
                          <p className="mt-1">{scholarship.requirements_en}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {getScholarshipsByCategory('awarded').length === 0 && (
                <div className="text-center py-16">
                  <UserCheck className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                    {language === 'ar' ? 'لا توجد قصص نجاح حالياً' : 'No success stories yet'}
                  </h3>
                  <p className="text-gray-500 text-lg">
                    {language === 'ar' ? 'سنشارك قصص نجاح طلابنا قريباً' : 'We will share our students\' success stories soon'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Support Our Students' Education - Always visible */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-red-600 via-white to-green-600 rounded-xl shadow-lg">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-800" />
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'ادعم تعليم طلابنا' : 'Support Our Students\' Education'}
          </h3>
          <p className="text-gray-700 mb-8 max-w-3xl mx-auto text-lg">
            {language === 'ar'
              ? 'كل تبرع يساهم في بناء مستقبل أفضل لطلاب فلسطين. انضم إلينا في رحلة التعليم والأمل'
              : 'Every donation contributes to building a better future for Palestinian students. Join us in the journey of education and hope'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5 text-green-600" />
              <span className="font-medium">ffj.mediacenter@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="font-medium">+972-59-840-3676</span>
            </div>
          </div>
          
          <Link href="/donate">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-xl">
              <Heart className="w-6 h-6 mr-3" />
              {language === 'ar' ? 'تبرع للطلاب' : 'Donate for Students'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}