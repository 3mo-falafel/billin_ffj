'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  DollarSign, 
  GraduationCap, 
  Edit, 
  Trash2, 
  Heart,
  Mail,
  Phone,
  UserCheck,
  Eye
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

// Student needing help
interface StudentNeedingHelp {
  id: string
  name: string
  age: number
  university_name: string
  amount_needed: number
  field_of_study: string
  year_of_study: string
  why_need_scholarship: string
  contact_email?: string
  contact_phone?: string
  is_active: boolean
  donations_received: number
  created_at: string
}

// Available scholarship for applications
interface AvailableScholarship {
  id: string
  title: string
  description: string
  amount: number
  requirements: string
  deadline: string
  provider_name: string
  provider_email: string
  provider_phone?: string
  max_applicants: number
  current_applicants: number
  is_active: boolean
  created_at: string
}

// Student who received help
interface HelpedStudent {
  id: string
  name: string
  university_name: string
  field_of_study: string
  amount_received: number
  year_received: string
  success_story?: string
  current_status?: string
  created_at: string
}

const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate', 'Master\'s', 'PhD']

export default function ScholarshipsAdminEnhanced() {
  const [studentsNeedingHelp, setStudentsNeedingHelp] = useState<StudentNeedingHelp[]>([])
  const [availableScholarships, setAvailableScholarships] = useState<AvailableScholarship[]>([])
  const [helpedStudents, setHelpedStudents] = useState<HelpedStudent[]>([])
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'student' | 'scholarship' | 'helped'>('student')
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form state for students needing help
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    age: 18,
    university_name: '',
    amount_needed: 0,
    field_of_study: '',
    year_of_study: '',
    why_need_scholarship: '',
    contact_email: '',
    contact_phone: ''
  })

  // Form state for available scholarships
  const [scholarshipFormData, setScholarshipFormData] = useState({
    title: '',
    description: '',
    amount: 0,
    requirements: '',
    deadline: '',
    provider_name: '',
    provider_email: '',
    provider_phone: '',
    max_applicants: 10
  })

  // Form state for helped students
  const [helpedFormData, setHelpedFormData] = useState({
    name: '',
    university_name: '',
    field_of_study: '',
    amount_received: 0,
    year_received: new Date().getFullYear().toString(),
    success_story: '',
    current_status: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load from database using the existing scholarships table
      const response = await fetch('/api/scholarships')
      
      if (!response.ok) {
        throw new Error(`Failed to load scholarships: ${await response.text()}`)
      }
      
      const result = await response.json()
      const data = result.data || []
      
      // Ensure data is an array
      const scholarshipData = Array.isArray(data) ? data : []
      console.log('Loaded scholarship data:', scholarshipData)
      
      // Transform data based on category
      const studentsNeedingHelpData: StudentNeedingHelp[] = []
      const availableScholarshipsData: AvailableScholarship[] = []
      const helpedStudentsData: HelpedStudent[] = []
      
      scholarshipData.forEach((item: any) => {
        if (item.category === 'sponsor_opportunity') {
          // This is a student needing help
          studentsNeedingHelpData.push({
            id: item.id.toString(),
            name: item.student_name || 'Student',
            age: 20, // Default age since not in current schema
            university_name: item.university_name || 'Unknown University',
            amount_needed: item.scholarship_amount || 0,
            field_of_study: item.title_en || 'Unknown Field',
            year_of_study: '2nd Year', // Default since not in current schema
            why_need_scholarship: item.description_en || '',
            contact_email: item.contact_info || '',
            contact_phone: '',
            is_active: item.is_active !== false,
            donations_received: 0, // Default since not tracked yet
            created_at: item.created_at
          })
        } else if (item.category === 'available') {
          // This is an available scholarship
          availableScholarshipsData.push({
            id: item.id.toString(),
            title: item.title_en,
            description: item.description_en,
            amount: item.scholarship_amount || 0,
            requirements: item.requirements_en || '',
            deadline: item.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            provider_name: 'Bil\'in Education Committee',
            provider_email: item.contact_info || 'ffj.mediacenter@gmail.com',
            provider_phone: '',
            max_applicants: 20,
            current_applicants: 0,
            is_active: item.is_active !== false,
            created_at: item.created_at
          })
        } else if (item.category === 'awarded') {
          // This is a student we helped
          helpedStudentsData.push({
            id: item.id.toString(),
            name: item.student_name || 'Student',
            university_name: item.university_name || 'Unknown University',
            field_of_study: item.title_en || 'Unknown Field',
            amount_received: item.scholarship_amount || 0,
            year_received: new Date(item.created_at).getFullYear().toString(),
            success_story: item.description_en || '',
            current_status: 'Graduate',
            created_at: item.created_at
          })
        }
      })
      
      setStudentsNeedingHelp(studentsNeedingHelpData)
      setAvailableScholarships(availableScholarshipsData)
      setHelpedStudents(helpedStudentsData)
      
    } catch (error) {
      console.error('Error loading data:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // Set empty arrays on error
      setStudentsNeedingHelp([])
      setAvailableScholarships([])
      setHelpedStudents([])
      

    }
  }

  const openAddDialog = (type: 'student' | 'scholarship' | 'helped') => {
    setDialogType(type)
    setEditingItem(null)
    resetForms()
    setShowAddDialog(true)
  }

  const openEditDialog = (type: 'student' | 'scholarship' | 'helped', item: any) => {
    setDialogType(type)
    setEditingItem(item)
    
    if (type === 'student') {
      setStudentFormData({
        name: item.name,
        age: item.age,
        university_name: item.university_name,
        amount_needed: item.amount_needed,
        field_of_study: item.field_of_study,
        year_of_study: item.year_of_study,
        why_need_scholarship: item.why_need_scholarship,
        contact_email: item.contact_email || '',
        contact_phone: item.contact_phone || ''
      })
    } else if (type === 'scholarship') {
      setScholarshipFormData({
        title: item.title,
        description: item.description,
        amount: item.amount,
        requirements: item.requirements,
        deadline: item.deadline,
        provider_name: item.provider_name,
        provider_email: item.provider_email,
        provider_phone: item.provider_phone || '',
        max_applicants: item.max_applicants
      })
    } else if (type === 'helped') {
      setHelpedFormData({
        name: item.name,
        university_name: item.university_name,
        field_of_study: item.field_of_study,
        amount_received: item.amount_received,
        year_received: item.year_received,
        success_story: item.success_story || '',
        current_status: item.current_status || ''
      })
    }
    
    setShowAddDialog(true)
  }

  const resetForms = () => {
    setStudentFormData({
      name: '',
      age: 18,
      university_name: '',
      amount_needed: 0,
      field_of_study: '',
      year_of_study: '',
      why_need_scholarship: '',
      contact_email: '',
      contact_phone: ''
    })
    
    setScholarshipFormData({
      title: '',
      description: '',
      amount: 0,
      requirements: '',
      deadline: '',
      provider_name: '',
      provider_email: '',
      provider_phone: '',
      max_applicants: 10
    })
    
    setHelpedFormData({
      name: '',
      university_name: '',
      field_of_study: '',
      amount_received: 0,
      year_received: new Date().getFullYear().toString(),
      success_story: '',
      current_status: ''
    })
  }

  const handleSubmit = async () => {
    try {
      let scholarshipData: any = {}
      
      if (dialogType === 'student') {
        // Student needing help - save as sponsor_opportunity
        scholarshipData = {
          title_en: `${studentFormData.name} - ${studentFormData.field_of_study}`,
          title_ar: `${studentFormData.name} - ${studentFormData.field_of_study}`,
          description_en: studentFormData.why_need_scholarship,
          description_ar: studentFormData.why_need_scholarship,
          category: 'sponsor_opportunity',
          student_name: studentFormData.name,
          university_name: studentFormData.university_name,
          scholarship_amount: studentFormData.amount_needed,
          requirements_en: `Age: ${studentFormData.age}, Field: ${studentFormData.field_of_study}, Year: ${studentFormData.year_of_study}`,
          requirements_ar: `العمر: ${studentFormData.age}, التخصص: ${studentFormData.field_of_study}, السنة: ${studentFormData.year_of_study}`,
          contact_info: studentFormData.contact_email,
          is_active: true
        }
      } else if (dialogType === 'scholarship') {
        // Available scholarship
        scholarshipData = {
          title_en: scholarshipFormData.title,
          title_ar: scholarshipFormData.title,
          description_en: scholarshipFormData.description,
          description_ar: scholarshipFormData.description,
          category: 'available',
          scholarship_amount: scholarshipFormData.amount,
          deadline: scholarshipFormData.deadline,
          requirements_en: scholarshipFormData.requirements,
          requirements_ar: scholarshipFormData.requirements,
          contact_info: scholarshipFormData.provider_email,
          is_active: true
        }
      } else if (dialogType === 'helped') {
        // Student we helped - save as awarded
        scholarshipData = {
          title_en: `${helpedFormData.name} - ${helpedFormData.field_of_study}`,
          title_ar: `${helpedFormData.name} - ${helpedFormData.field_of_study}`,
          description_en: helpedFormData.success_story || `Received $${helpedFormData.amount_received} scholarship`,
          description_ar: helpedFormData.success_story || `حصل على منحة ${helpedFormData.amount_received} دولار`,
          category: 'awarded',
          student_name: helpedFormData.name,
          university_name: helpedFormData.university_name,
          scholarship_amount: helpedFormData.amount_received,
          requirements_en: `Field: ${helpedFormData.field_of_study}, Year: ${helpedFormData.year_received}`,
          requirements_ar: `التخصص: ${helpedFormData.field_of_study}, السنة: ${helpedFormData.year_received}`,
          contact_info: helpedFormData.current_status || '',
          is_active: true
        }
      }
      
      if (editingItem) {
        const response = await fetch(`/api/scholarships/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scholarshipData)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to update scholarship: ${await response.text()}`)
        }
      } else {
        const response = await fetch('/api/scholarships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scholarshipData)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to create scholarship: ${await response.text()}`)
        }
      }
      
      // Reload data from database
      await loadData()
      
      setShowAddDialog(false)
      resetForms()
      setEditingItem(null)
      
      alert(editingItem ? 'Updated successfully!' : 'Added successfully!')
      
    } catch (error) {
      console.error('Error saving:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      alert(`Failed to save. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDelete = async (type: 'student' | 'scholarship' | 'helped', id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/scholarships/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to delete scholarship: ${await response.text()}`)
        }
        
        // Reload data from database
        await loadData()
        alert('Deleted successfully!')
        
      } catch (error) {
        console.error('Error deleting:', error)
        alert('Failed to delete. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Scholarships Management</h1>
          <p className="text-blue-100">Manage student scholarships in three simple categories</p>
        </div>
      </div>

      {/* Tabs for the 3 sections */}
      <Tabs defaultValue="needing-help" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="needing-help" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Students Needing Help
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Available Scholarships
          </TabsTrigger>
          <TabsTrigger value="helped" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Students We Helped
          </TabsTrigger>
        </TabsList>

        {/* Section 1: Students Needing Help */}
        <TabsContent value="needing-help">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Students Needing Financial Help
                </CardTitle>
                <p className="text-muted-foreground">Students who need donations to continue their studies</p>
              </div>
              <Button onClick={() => openAddDialog('student')} className="bg-red-500 hover:bg-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentsNeedingHelp.map((student) => (
                  <Card key={student.id} className="border-red-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.age} years old</p>
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          Needs Help
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium">{student.university_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.field_of_study} • {student.year_of_study}
                        </p>
                      </div>
                      
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Amount Needed:</span>
                          <span className="text-red-600 font-bold">${student.amount_needed.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Donations Received:</span>
                          <span className="text-green-600 font-bold">${student.donations_received.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min((student.donations_received / student.amount_needed) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-3">{student.why_need_scholarship}</p>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 flex-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Donate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog('student', student)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete('student', student.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {student.contact_email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {student.contact_email}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 2: Available Scholarships */}
        <TabsContent value="available">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  Available Scholarships
                </CardTitle>
                <p className="text-muted-foreground">Scholarships available for students to apply for</p>
              </div>
              <Button onClick={() => openAddDialog('scholarship')} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Scholarship
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableScholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="border-blue-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{scholarship.title}</h3>
                          <p className="text-blue-600 font-bold text-xl">${scholarship.amount.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Open
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{scholarship.description}</p>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <p className="text-sm text-gray-600">{scholarship.requirements}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <p className="text-muted-foreground">{new Date(scholarship.deadline).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Applications:</span>
                          <p className="text-muted-foreground">{scholarship.current_applicants}/{scholarship.max_applicants}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <h4 className="font-medium mb-2">Provider Contact:</h4>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{scholarship.provider_name}</p>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {scholarship.provider_email}
                          </div>
                          {scholarship.provider_phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {scholarship.provider_phone}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View Applications
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog('scholarship', scholarship)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete('scholarship', scholarship.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 3: Students We Helped */}
        <TabsContent value="helped">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  Students We Helped
                </CardTitle>
                <p className="text-muted-foreground">Success stories of students who received scholarships through us</p>
              </div>
              <Button onClick={() => openAddDialog('helped')} className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Success Story
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpedStudents.map((student) => (
                  <Card key={student.id} className="border-green-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <p className="text-green-600 font-bold">${student.amount_received.toLocaleString()} received</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Helped
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium">{student.university_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.field_of_study} • Class of {student.year_received}
                        </p>
                      </div>
                      
                      {student.success_story && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2 text-green-800">Success Story:</h4>
                          <p className="text-sm text-green-700">{student.success_story}</p>
                        </div>
                      )}
                      
                      {student.current_status && (
                        <div>
                          <span className="font-medium">Current Status:</span>
                          <p className="text-sm text-muted-foreground">{student.current_status}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog('helped', student)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete('helped', student.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {
                dialogType === 'student' ? 'Student Needing Help' :
                dialogType === 'scholarship' ? 'Available Scholarship' :
                'Success Story'
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {dialogType === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Student Name</Label>
                    <Input
                      id="name"
                      value={studentFormData.name}
                      onChange={(e) => setStudentFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="16"
                      max="50"
                      value={studentFormData.age}
                      onChange={(e) => setStudentFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="university">University Name</Label>
                  <Input
                    id="university"
                    value={studentFormData.university_name}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, university_name: e.target.value }))}
                    placeholder="University or college name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field">Field of Study</Label>
                    <Input
                      id="field"
                      value={studentFormData.field_of_study}
                      onChange={(e) => setStudentFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year of Study</Label>
                    <Select value={studentFormData.year_of_study} onValueChange={(value) => setStudentFormData(prev => ({ ...prev, year_of_study: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {studyYears.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount Needed ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    max="100000"
                    value={studentFormData.amount_needed}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, amount_needed: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter amount needed"
                  />
                </div>
                
                <div>
                  <Label htmlFor="why">Why does this student need the scholarship?</Label>
                  <Textarea
                    id="why"
                    value={studentFormData.why_need_scholarship}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, why_need_scholarship: e.target.value }))}
                    placeholder="Explain the student's situation and why they need financial help"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Contact Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={studentFormData.contact_email}
                      onChange={(e) => setStudentFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Contact Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={studentFormData.contact_phone}
                      onChange={(e) => setStudentFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+970-59-123-4567"
                    />
                  </div>
                </div>
              </>
            )}
            
            {dialogType === 'scholarship' && (
              <>
                <div>
                  <Label htmlFor="title">Scholarship Title</Label>
                  <Input
                    id="title"
                    value={scholarshipFormData.title}
                    onChange={(e) => setScholarshipFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Name of the scholarship"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={scholarshipFormData.description}
                    onChange={(e) => setScholarshipFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the scholarship"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Scholarship Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      max="100000"
                      value={scholarshipFormData.amount}
                      onChange={(e) => setScholarshipFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={scholarshipFormData.deadline}
                      onChange={(e) => setScholarshipFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={scholarshipFormData.requirements}
                    onChange={(e) => setScholarshipFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="List the requirements for this scholarship"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="provider">Provider Name</Label>
                  <Input
                    id="provider"
                    value={scholarshipFormData.provider_name}
                    onChange={(e) => setScholarshipFormData(prev => ({ ...prev, provider_name: e.target.value }))}
                    placeholder="Organization or person providing the scholarship"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider_email">Provider Email</Label>
                    <Input
                      id="provider_email"
                      type="email"
                      value={scholarshipFormData.provider_email}
                      onChange={(e) => setScholarshipFormData(prev => ({ ...prev, provider_email: e.target.value }))}
                      placeholder="contact@provider.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="provider_phone">Provider Phone (Optional)</Label>
                    <Input
                      id="provider_phone"
                      value={scholarshipFormData.provider_phone}
                      onChange={(e) => setScholarshipFormData(prev => ({ ...prev, provider_phone: e.target.value }))}
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="max_applicants">Maximum Applicants</Label>
                  <Input
                    id="max_applicants"
                    type="number"
                    min="1"
                    max="1000"
                    value={scholarshipFormData.max_applicants}
                    onChange={(e) => setScholarshipFormData(prev => ({ ...prev, max_applicants: parseInt(e.target.value) || 10 }))}
                  />
                </div>
              </>
            )}
            
            {dialogType === 'helped' && (
              <>
                <div>
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    value={helpedFormData.name}
                    onChange={(e) => setHelpedFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={helpedFormData.university_name}
                      onChange={(e) => setHelpedFormData(prev => ({ ...prev, university_name: e.target.value }))}
                      placeholder="University name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="field">Field of Study</Label>
                    <Input
                      id="field"
                      value={helpedFormData.field_of_study}
                      onChange={(e) => setHelpedFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                      placeholder="e.g., Medicine"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount_received">Amount Received ($)</Label>
                    <Input
                      id="amount_received"
                      type="number"
                      min="0"
                      max="100000"
                      value={helpedFormData.amount_received}
                      onChange={(e) => setHelpedFormData(prev => ({ ...prev, amount_received: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year_received">Year Received</Label>
                    <Input
                      id="year_received"
                      value={helpedFormData.year_received}
                      onChange={(e) => setHelpedFormData(prev => ({ ...prev, year_received: e.target.value }))}
                      placeholder="2024"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="success_story">Success Story (Optional)</Label>
                  <Textarea
                    id="success_story"
                    value={helpedFormData.success_story}
                    onChange={(e) => setHelpedFormData(prev => ({ ...prev, success_story: e.target.value }))}
                    placeholder="Share the student's success story or achievements"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="current_status">Current Status (Optional)</Label>
                  <Input
                    id="current_status"
                    value={helpedFormData.current_status}
                    onChange={(e) => setHelpedFormData(prev => ({ ...prev, current_status: e.target.value }))}
                    placeholder="e.g., Working as Software Engineer at Google"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
