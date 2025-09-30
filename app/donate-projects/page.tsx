"use client"

import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import { Heart, Target, Home, TreePine, Users, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DonateProjectsPage() {
  const { language, isArabic } = useLanguage()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const projectImpactAreas = [
    {
      icon: Home,
      title: isArabic ? "مشاريع البنية التحتية" : "Infrastructure Projects",
      description: isArabic ? "بناء وتطوير المرافق المجتمعية" : "Building and developing community facilities",
      color: "bg-blue-500",
    },
    {
      icon: TreePine,
      title: isArabic ? "المشاريع الزراعية" : "Agricultural Projects",
      description: isArabic ? "البيوت البلاستيكية والمشاريع الزراعية المستدامة" : "Greenhouses and sustainable farming projects",
      color: "bg-green-500",
    },
    {
      icon: Target,
      title: isArabic ? "مشاريع الطاقة المتجددة" : "Renewable Energy Projects",
      description: isArabic ? "الألواح الشمسية والطاقة النظيفة" : "Solar panels and clean energy initiatives",
      color: "bg-yellow-500",
    },
    {
      icon: Users,
      title: isArabic ? "المشاريع التعليمية" : "Educational Projects",
      description: isArabic ? "مكتبات ومراكز تعليمية للمجتمع" : "Libraries and educational centers for the community",
      color: "bg-purple-500",
    },
  ]

  const bankInfo = {
    name: "Alalusi Foundation",
    accountNo: "658616633",
    routingUSA: "322271627",
    swiftCode: "CHASUS33",
    address: {
      line1: "1975 National Ave",
      line2: "Hayward, CA 94545"
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 h-8 w-8 p-0"
    >
      {copiedField === field ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </Button>
  )

  return (
    <div
      className={`min-h-screen bg-background ${isArabic ? "arabic-text" : "english-text"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Navigation />
      <NewsTicker />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-600/10 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {isArabic ? "تبرع لمشاريع القرية" : "Donate to Village Projects"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isArabic 
              ? "ساعدنا في بناء مستقبل أفضل لقرية بلعين من خلال دعم مشاريعنا التنموية المهمة"
              : "Help us build a better future for Bil'in village by supporting our important development projects"
            }
          </p>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Bank Transfer Information */}
            <div className="space-y-6">
              <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-600" />
                    {isArabic ? "تبرع للمشاريع" : "Donate to Projects"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic 
                      ? "استخدم المعلومات المصرفية التالية للتبرع لمشاريع تطوير القرية"
                      : "Use the following bank information to donate to village development projects"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Bank Information */}
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">
                      {isArabic ? "معلومات التحويل البنكي" : "Bank Transfer Information"}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {isArabic ? "اسم الحساب:" : "Account Name:"}
                        </span>
                        <div className="flex items-center">
                          <span className="font-mono text-lg">{bankInfo.name}</span>
                          <CopyButton text={bankInfo.name} field="name" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {isArabic ? "رقم الحساب:" : "Account Number:"}
                        </span>
                        <div className="flex items-center">
                          <span className="font-mono text-lg">{bankInfo.accountNo}</span>
                          <CopyButton text={bankInfo.accountNo} field="account" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {isArabic ? "رقم التوجيه (الولايات المتحدة):" : "Routing (USA):"}
                        </span>
                        <div className="flex items-center">
                          <span className="font-mono text-lg">{bankInfo.routingUSA}</span>
                          <CopyButton text={bankInfo.routingUSA} field="routing" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {isArabic ? "رمز سويفت:" : "Swift Code:"}
                        </span>
                        <div className="flex items-center">
                          <span className="font-mono text-lg">{bankInfo.swiftCode}</span>
                          <CopyButton text={bankInfo.swiftCode} field="swift" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address for Checks */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">
                      {isArabic ? "عنوان الشيكات:" : "Address for Checks:"}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{bankInfo.address.line1}</span>
                        <CopyButton text={bankInfo.address.line1} field="address1" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{bankInfo.address.line2}</span>
                        <CopyButton text={bankInfo.address.line2} field="address2" />
                      </div>
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          onClick={() => copyToClipboard(`${bankInfo.address.line1}, ${bankInfo.address.line2}`, 'fullAddress')}
                          className="w-full"
                        >
                          {copiedField === 'fullAddress' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                          {isArabic ? "نسخ العنوان الكامل" : "Copy Full Address"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Important Note */}
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>{isArabic ? "ملاحظة مهمة:" : "Important Note:"}</strong>
                      <br />
                      {isArabic 
                        ? "جميع التبرعات لهذه الصفحة مخصصة لمشاريع تطوير القرية. يرجى ذكر 'مشروع القرية' في ملاحظات التحويل."
                        : "All donations on this page are dedicated to village development projects. Please mention 'Village Project' in your transfer notes."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Impact Areas */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {isArabic ? "تأثير مشاريعكم" : "Your Project Impact"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {isArabic 
                    ? "تبرعاتكم تساهم في تطوير البنية التحتية وتحسين جودة الحياة في قرية بلعين"
                    : "Your donations contribute to infrastructure development and improving quality of life in Bil'in village"
                  }
                </p>
              </div>

              <div className="space-y-4">
                {projectImpactAreas.map((area, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${area.color}`}>
                          <area.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{area.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>


              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isArabic ? "تواصل معنا" : "Contact Us"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isArabic 
                      ? "لأي استفسارات حول المشاريع أو التبرعات، يرجى التواصل معنا:"
                      : "For any questions about projects or donations, please contact us:"
                    }
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span className="font-mono">ffj.mediacenter@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span>
                      <span className="font-mono">+972-59-840-3676</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simple Note */}
              <Card className="border-emerald-200">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-emerald-600" />
                    {isArabic ? "شكراً لدعمكم" : "Thank You for Your Support"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isArabic 
                      ? "كل تبرع يساهم في بناء مستقبل أفضل لأهالي بلعين. مشاريعكم تحدث فرقاً حقيقياً في حياة المجتمع وتساعد في تطوير القرية بطريقة مستدامة."
                      : "Every donation helps build a better future for the people of Bil'in. Your projects make a real difference in the community's life and help develop the village sustainably."
                    }
                  </p>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-sm text-emerald-800 font-medium text-center">
                      {isArabic 
                        ? "100% من تبرعاتكم تذهب مباشرة للمشاريع"
                        : "100% of your donations go directly to projects"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Copy Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {isArabic ? "نسخ سريع للمعلومات المصرفية" : "Quick Copy Bank Information"}
              </CardTitle>
              <CardDescription>
                {isArabic ? "انقر لنسخ المعلومات" : "Click to copy information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(bankInfo.accountNo, 'quickAccount')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {isArabic ? "رقم الحساب" : "Account Number"}
                  </span>
                  <span className="font-mono text-lg">{bankInfo.accountNo}</span>
                  {copiedField === 'quickAccount' && <span className="text-xs text-green-600 mt-1">Copied!</span>}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(bankInfo.routingUSA, 'quickRouting')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {isArabic ? "رقم التوجيه" : "Routing Number"}
                  </span>
                  <span className="font-mono text-lg">{bankInfo.routingUSA}</span>
                  {copiedField === 'quickRouting' && <span className="text-xs text-green-600 mt-1">Copied!</span>}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(bankInfo.swiftCode, 'quickSwift')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {isArabic ? "رمز سويفت" : "Swift Code"}
                  </span>
                  <span className="font-mono text-lg">{bankInfo.swiftCode}</span>
                  {copiedField === 'quickSwift' && <span className="text-xs text-green-600 mt-1">Copied!</span>}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`${bankInfo.address.line1}, ${bankInfo.address.line2}`, 'quickAddress')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {isArabic ? "العنوان" : "Address"}
                  </span>
                  <div className="font-mono text-sm">
                    <div>{bankInfo.address.line1}</div>
                    <div>{bankInfo.address.line2}</div>
                  </div>
                  {copiedField === 'quickAddress' && <span className="text-xs text-green-600 mt-1">Copied!</span>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
