"use client"

import { Navigation } from "@/components/navigation"
import { NewsTicker } from "@/components/news-ticker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { Heart, Users, TreePine, GraduationCap, Camera } from "lucide-react"
import BankTransfer from "@/components/payments/stripe-payment"

export default function DonatePage() {
  const { language, isArabic } = useLanguage()

  const impactAreas = [
    {
      icon: Users,
      title: isArabic ? "المقاومة السلمية" : "Peaceful Resistance",
      description: isArabic ? "دعم المظاهرات السلمية الأسبوعية" : "Support weekly peaceful demonstrations",
      color: "bg-primary",
    },
    {
      icon: GraduationCap,
      title: isArabic ? "التعليم والثقافة" : "Education & Culture",
      description: isArabic ? "برامج تعليمية للأطفال والشباب" : "Educational programs for children and youth",
      color: "bg-secondary",
    },
    {
      icon: TreePine,
      title: isArabic ? "الزراعة المستدامة" : "Sustainable Farming",
      description: isArabic ? "حماية أشجار الزيتون والأراضي الزراعية" : "Protect olive trees and agricultural land",
      color: "bg-accent",
    },
    {
      icon: Camera,
      title: isArabic ? "التوثيق الإعلامي" : "Media Documentation",
      description: isArabic ? "توثيق الانتهاكات ونشر الوعي" : "Document violations and raise awareness",
      color: "bg-muted",
    },
  ]

  return (
    <div
      className={`min-h-screen bg-background ${isArabic ? "arabic-text" : "english-text"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Navigation />
      <NewsTicker />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getTranslation("supportOurCause", language)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getTranslation("donationDescription", language)}
          </p>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Bank Transfer Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{getTranslation("makeADonation", language)}</CardTitle>
                  <CardDescription>
                    {isArabic 
                      ? "يمكنك دعم قضيتنا من خلال التحويل البنكي المباشر"
                      : "You can support our cause through direct bank transfer"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BankTransfer />
                </CardContent>
              </Card>
            </div>

            {/* Impact Areas */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{getTranslation("yourImpact", language)}</h2>
                <p className="text-muted-foreground mb-6">{getTranslation("impactDescription", language)}</p>
              </div>

              <div className="space-y-4">
                {impactAreas.map((area, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${area.color}`}>
                          <area.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{area.title}</h3>
                          <p className="text-sm text-muted-foreground">{area.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Impact Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{getTranslation("recentImpact", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {getTranslation("demonstrationsSupported", language)}
                      </span>
                      <Badge variant="secondary">847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {getTranslation("childrenEducated", language)}
                      </span>
                      <Badge variant="secondary">1,234</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{getTranslation("treesPlanted", language)}</span>
                      <Badge variant="secondary">2,156</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {getTranslation("videosDocumented", language)}
                      </span>
                      <Badge variant="secondary">3,421</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simple Note */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isArabic ? "ملاحظة مهمة" : "Important Note"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isArabic 
                      ? "جميع التبرعات تذهب مباشرة لدعم مهمتنا في تعزيز السلام والعدالة وحقوق الإنسان. شكراً لمساهمتكم في هذه القضية المهمة."
                      : "All donations go directly to supporting our mission of promoting peace, justice, and human rights. Thank you for your contribution to this important cause."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
