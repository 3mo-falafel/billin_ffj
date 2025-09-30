"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { MapPin, Phone, Mail, Clock, Crown } from "lucide-react"

export default function ContactPage() {
  const { language, isArabic } = useLanguage()

  const teamMembers = [
    {
      name: "Iyad Bornat",
      nameAr: "إياد برناط",
      title: "Head",
      titleAr: "الرئيس",
      phone: "+972598403676",
      image: "/iyad.jpg",
      isHead: true
    },
    {
      name: "Sameer Bornat",
      nameAr: "سمير برناط",
      title: "Team Member",
      titleAr: "عضو الفريق",
      phone: "+970599800252",
      image: "/sameer.jpg",
      isHead: false
    },
    {
      name: "Kefah Mnasour",
      nameAr: "كفاح منصور",
      title: "Team Member", 
      titleAr: "عضو الفريق",
      phone: "+972598412416",
      image: "/kefah.jpg",
      isHead: false
    }
  ]

  return (
    <div
      className={`min-h-screen bg-background ${isArabic ? "arabic-text" : "english-text"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Navigation />
      <NewsTicker />

      {/* Hero Section with Palestinian Flag Colors */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 relative overflow-hidden">
        {/* Palestinian Flag Background */}
        <div className="absolute inset-0 opacity-5">
          {/* Flag stripes */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
          <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
          {/* Red triangle - pointing RIGHT into the flag, covering all 3 stripes */}
          <div className="absolute top-1/2 left-0 w-0 h-0 -translate-y-1/2 border-l-[150px] border-l-red-600 border-t-[150px] border-t-transparent border-b-[150px] border-b-transparent"></div>
        </div>
        
        {/* Decorative flag elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <div className="w-32 h-20 relative">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
            <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white border-y border-gray-200"></div>
            <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
            {/* Small triangle pointing RIGHT, covering all stripes */}
            <div className="absolute top-0 left-0 w-0 h-0 border-l-[32px] border-l-red-600 border-t-[40px] border-t-transparent border-b-[40px] border-b-transparent"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getTranslation("contactUs", language)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getTranslation("contactDescription", language)}
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isArabic ? "فريق القيادة" : "Leadership Team"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isArabic 
                ? "تواصل مع فريق قيادة أصدقاء الحرية والعدالة في بلعين"
                : "Get in touch with the leadership team of Friends of Freedom and Justice in Bil'in"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                {/* Palestinian Flag Header */}
                <div className="relative h-4">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
                  <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
                  <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
                  {/* Triangle pointing RIGHT into the flag, covering all 3 stripes */}
                  <div className="absolute top-0 left-0 w-0 h-0 border-l-[16px] border-l-red-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                </div>
                
                <div className="relative bg-gradient-to-br from-white to-gray-50">
                  {/* Subtle flag accent in corner */}
                  <div className="absolute top-2 right-2 opacity-30">
                    <div className="w-8 h-5 relative">
                      <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
                      <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
                      <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
                      {/* Small triangle pointing RIGHT, covering all stripes */}
                      <div className="absolute top-0 left-0 w-0 h-0 border-l-[8px] border-l-red-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent"></div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-gray-100 group-hover:ring-green-200 transition-all duration-300">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-user.jpg';
                          }}
                        />
                      </div>
                      {member.isHead && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg border-2 border-white">
                          <Crown className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {isArabic ? member.nameAr : member.name}
                        </h3>
                        <div className="flex items-center justify-center mt-2">
                          <Badge 
                            variant={member.isHead ? "default" : "secondary"}
                            className={member.isHead 
                              ? "bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }
                          >
                            {member.isHead && <Crown className="w-3 h-3 mr-1" />}
                            {isArabic ? member.titleAr : member.title}
                          </Badge>
                        </div>
                      </div>

                      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="bg-green-700 text-white rounded-full p-2 shadow-sm">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                {getTranslation("phone", language)}
                              </p>
                              <a 
                                href={`tel:${member.phone}`}
                                className="text-gray-800 font-mono text-sm hover:text-green-700 transition-colors font-semibold"
                              >
                                {member.phone}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Information - Now Full Width */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">{getTranslation("getInTouch", language)}</h2>
              <p className="text-muted-foreground mb-12 text-lg">{getTranslation("contactIntro", language)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-green-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-700 text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{getTranslation("address", language)}</h3>
                  <p className="text-muted-foreground">
                    {isArabic
                      ? "بلعين، رام الله والبيرة، فلسطين"
                      : "Bil'in Village, Ramallah and Al-Bireh, Palestine"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-red-600 text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{getTranslation("email", language)}</h3>
                  <a 
                    href="mailto:ffj.mediacenter@gmail.com" 
                    className="text-muted-foreground hover:text-red-600 transition-colors font-medium"
                  >
                    ffj.mediacenter@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-black hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-black text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {getTranslation("officeHours", language)}
                  </h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>{isArabic ? "الأحد - الخميس: 8:00 ص - 4:00 م" : "Sunday - Thursday: 8:00 AM - 4:00 PM"}</p>
                    <p>{isArabic ? "الجمعة: 8:00 ص - 12:00 م" : "Friday: 8:00 AM - 12:00 PM"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
