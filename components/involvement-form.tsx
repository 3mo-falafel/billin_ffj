"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Send, Users, Heart, BookOpen, Megaphone, Camera, Palette } from "lucide-react"

export function InvolvementForm() {
  const { language, isArabic } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    nationality: "",
    email: "",
    phone_number: "",
    involvement_type: "",
    details: ""
  })

  const involvementOptions = [
    {
      value: "volunteering",
      label_en: "Volunteering",
      label_ar: "التطوع",
      icon: Heart,
      description_en: "Help with community activities and events",
      description_ar: "المساعدة في الأنشطة والفعاليات المجتمعية"
    },
    {
      value: "education",
      label_en: "Educational Programs",
      label_ar: "البرامج التعليمية",
      icon: BookOpen,
      description_en: "Teach or assist in cultural and language programs",
      description_ar: "التدريس أو المساعدة في البرامج الثقافية واللغوية"
    },
    {
      value: "advocacy",
      label_en: "Advocacy & Awareness",
      label_ar: "الدعوة والتوعية",
      icon: Megaphone,
      description_en: "Help spread awareness about our cause",
      description_ar: "المساعدة في نشر الوعي حول قضيتنا"
    },
    {
      value: "media",
      label_en: "Media & Documentation",
      label_ar: "الإعلام والتوثيق",
      icon: Camera,
      description_en: "Photography, videography, or content creation",
      description_ar: "التصوير الفوتوغرافي أو الفيديو أو إنشاء المحتوى"
    },
    {
      value: "arts",
      label_en: "Arts & Culture",
      label_ar: "الفنون والثقافة",
      icon: Palette,
      description_en: "Contribute to cultural events and artistic projects",
      description_ar: "المساهمة في الفعاليات الثقافية والمشاريع الفنية"
    },
    {
      value: "community",
      label_en: "Community Organizing",
      label_ar: "تنظيم المجتمع",
      icon: Users,
      description_en: "Help organize community events and gatherings",
      description_ar: "المساعدة في تنظيم الفعاليات والتجمعات المجتمعية"
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.nationality || !formData.email || !formData.phone_number || !formData.involvement_type) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Please fill in all required fields"
          : "يرجى ملء جميع الحقول المطلوبة"
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Please enter a valid email address"
          : "يرجى إدخال عنوان بريد إلكتروني صحيح"
      })
      return
    }

    setLoading(true)
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("involvement_requests")
        .insert([formData])
        .select()

      if (error) {
        throw error
      }

      toast({
        title: language === "en" ? "Success!" : "تم بنجاح!",
        description: language === "en" 
          ? "Your involvement request has been submitted. We will contact you soon!"
          : "تم إرسال طلب المشاركة. سنتواصل معك قريباً!"
      })

      // Reset form
      setFormData({
        name: "",
        nationality: "",
        email: "",
        phone_number: "",
        involvement_type: "",
        details: ""
      })

    } catch (error: any) {
      // Handle table not existing yet
      if (error?.message?.includes("Could not find the table") || error?.code === 'PGRST106') {
        toast({
          variant: "destructive",
          title: language === "en" ? "System Not Ready" : "النظام غير جاهز",
          description: language === "en" 
            ? "The involvement system is being set up. Please contact us directly for now."
            : "يتم إعداد نظام المشاركة. يرجى الاتصال بنا مباشرة في الوقت الحالي."
        })
      } else if (error?.message?.includes("row-level security") || error?.code === '42501') {
        toast({
          variant: "destructive",
          title: language === "en" ? "Permission Error" : "خطأ في الصلاحيات",
          description: language === "en" 
            ? "Database permissions need to be configured. Please contact the administrator."
            : "تحتاج صلاحيات قاعدة البيانات إلى التكوين. يرجى الاتصال بالمدير."
        })
      } else {
        const errorMessage = error?.message || "Unknown error occurred"
        toast({
          variant: "destructive",
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" 
            ? `Failed to submit request: ${errorMessage}`
            : `فشل في إرسال الطلب: ${errorMessage}`
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className={`text-2xl flex items-center gap-3 ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Send className="h-4 w-4 text-primary" />
          </div>
          {language === "en" ? "Join Our Community" : "انضم إلى مجتمعنا"}
        </CardTitle>
        <p className={`text-muted-foreground ${isArabic ? "arabic-text" : "english-text"}`}>
          {language === "en" 
            ? "Fill out this form to let us know how you'd like to get involved with our community."
            : "املأ هذا النموذج لتخبرنا كيف تريد المشاركة في مجتمعنا."}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className={isArabic ? "arabic-text" : "english-text"}>
              {language === "en" ? "Full Name" : "الاسم الكامل"} *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={language === "en" ? "Enter your full name" : "أدخل اسمك الكامل"}
              required
              className={isArabic ? "text-right" : "text-left"}
            />
          </div>

          {/* Nationality Field */}
          <div className="space-y-2">
            <Label htmlFor="nationality" className={isArabic ? "arabic-text" : "english-text"}>
              {language === "en" ? "Nationality" : "الجنسية"} *
            </Label>
            <Input
              id="nationality"
              type="text"
              value={formData.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder={language === "en" ? "Enter your nationality" : "أدخل جنسيتك"}
              required
              className={isArabic ? "text-right" : "text-left"}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className={isArabic ? "arabic-text" : "english-text"}>
              {language === "en" ? "Email Address" : "البريد الإلكتروني"} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={language === "en" ? "your.email@example.com" : "your.email@example.com"}
              required
              className="text-left"
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className={isArabic ? "arabic-text" : "english-text"}>
              {language === "en" ? "Phone Number" : "رقم الهاتف"} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder={language === "en" ? "+1 (555) 123-4567" : "+1 (555) 123-4567"}
              required
              className="text-left"
            />
          </div>

          {/* Involvement Type Field */}
          <div className="space-y-2">
            <Label htmlFor="involvement" className={isArabic ? "arabic-text" : "english-text"}>
              {language === "en" ? "How would you like to get involved?" : "كيف تريد المشاركة؟"} *
            </Label>
            <Select value={formData.involvement_type} onValueChange={(value) => handleInputChange("involvement_type", value)}>
              <SelectTrigger className={isArabic ? "text-right" : "text-left"}>
                <SelectValue placeholder={language === "en" ? "Select involvement type" : "اختر نوع المشاركة"} />
              </SelectTrigger>
              <SelectContent>
                {involvementOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div className={isArabic ? "arabic-text" : "english-text"}>
                          <div className="font-medium">
                            {language === "en" ? option.label_en : option.label_ar}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {language === "en" ? option.description_en : option.description_ar}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Details Field */}
          <div className="space-y-2">
            <Label htmlFor="details" className={isArabic ? "arabic-text" : "english-text"}>
              {language === "en" ? "Additional Details" : "تفاصيل إضافية"}
            </Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              placeholder={language === "en" 
                ? "Tell us more about your experience, availability, or any specific skills you'd like to contribute..."
                : "أخبرنا المزيد عن خبرتك أو توفرك أو أي مهارات محددة تريد المساهمة بها..."}
              rows={4}
              className={isArabic ? "text-right" : "text-left"}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {language === "en" ? "Submitting..." : "جاري الإرسال..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {language === "en" ? "Submit Request" : "إرسال الطلب"}
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
