"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Play, Award, Calendar, Users, ExternalLink } from "lucide-react"

export default function FiveBrokenCamerasPage() {
  const { language, isArabic } = useLanguage()

  const awards = [
    {
      name_en: "World Cinema Directing Award",
      name_ar: "جائزة الإخراج العالمية",
      event_en: "Sundance Film Festival",
      event_ar: "مهرجان صندانس السينمائي",
      year: "2012"
    },
    {
      name_en: "International Emmy Award",
      name_ar: "جائزة إيمي الدولية",
      event_en: "Best Documentary",
      event_ar: "أفضل فيلم وثائقي",
      year: "2013"
    },
    {
      name_en: "Academy Award Nomination",
      name_ar: "ترشيح لجائزة الأوسكار",
      event_en: "Best Documentary Feature",
      event_ar: "أفضل فيلم وثائقي طويل",
      year: "2013"
    },
    {
      name_en: "Special Jury & Audience Awards",
      name_ar: "جائزة لجنة التحكيم الخاصة وجائزة الجمهور",
      event_en: "IDFA Amsterdam",
      event_ar: "مهرجان أمستردام للأفلام الوثائقية",
      year: "2011"
    }
  ]

  const creators = [
    {
      name: "Emad Burnat",
      name_ar: "عماد برناط",
      role_en: "Palestinian farmer, cinematographer, co-director, co-producer",
      role_ar: "مزارع فلسطيني، مصور سينمائي، مخرج مشارك، منتج مشارك",
      bio_en: "Born in Bil'in, recorded the story through five cameras, and risked his life documenting the struggle.",
      bio_ar: "ولد في بلعين، سجل القصة من خلال خمس كاميرات، وخاطر بحياته لتوثيق النضال.",
      image: "/emad-burnat.jpg"
    },
    {
      name: "Jibreel Burnat",
      name_ar: "جبريل برناط",
      role_en: "Emad's son, central figure in the documentary",
      role_ar: "ابن عماد، الشخصية المحورية في الفيلم الوثائقي",
      bio_en: "Grew up during the filming, representing a generation under occupation. Now an adult, he has created this website to continue sharing the story of Bil'in and its people.",
      bio_ar: "نشأ خلال التصوير، يمثل جيلاً تحت الاحتلال. الآن وهو بالغ، قام بإنشاء هذا الموقع لمتابعة مشاركة قصة بلعين وشعبها.",
      image: "/jibreel-burnat.jpg"
    },
    {
      name: "Guy Davidi",
      name_ar: "غاي دافيدي",
      role_en: "Israeli filmmaker, co-director, writer, editor",
      role_ar: "مخرج إسرائيلي، مخرج مشارك، كاتب، محرر",
      bio_en: "Collaborated since 2009, helped shape the narrative and structure of the film.",
      bio_ar: "تعاون منذ 2009، ساعد في تشكيل السرد وبنية الفيلم.",
      image: "/guy-davidi.jpg"
    }
  ]

  const streamingPlatforms = [
    { name: "Kanopy", url: "https://kanopy.com", note_en: "with closed captions", note_ar: "مع ترجمة مغلقة" },
    { name: "Prime Video", url: "https://amazon.com", note_en: "availability varies", note_ar: "التوفر متغير" },
    { name: "Netflix", url: "https://netflix.com", note_en: "availability varies", note_ar: "التوفر متغير" },
    { name: "Tubi", url: "https://tubi.tv", note_en: "free with ads", note_ar: "مجاني مع إعلانات" }
  ]

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url("/5-broken-cameras-banner.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-foreground hover:text-primary">
              <Link href="/#about" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === "en" ? "Back to Homepage" : "العودة للصفحة الرئيسية"}
              </Link>
            </Button>
          </div>

          <div className="text-center text-foreground">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              5 Broken Cameras
            </h1>
            <div className="text-2xl md:text-3xl text-primary font-medium mb-8">
              خمس كاميرات محطمة
            </div>
            <p className={`text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed ${isArabic ? "arabic-text" : "english-text"}`}>
              {language === "en"
                ? "A testament of resistance and a portrait of family resilience through five years of peaceful struggle in Bil'in."
                : "شهادة على المقاومة وصورة لصمود عائلي عبر خمس سنوات من النضال السلمي في بلعين."}
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {language === "en" ? "About the Film" : "حول الفيلم"}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === "en"
                    ? "5 Broken Cameras (2011), co-directed by Palestinian farmer Emad Burnat and Israeli filmmaker Guy Davidi, captures over five years of weekly peaceful protests in Bil'in as a separation barrier is erected, disrupting villagers' land and life."
                    : "خمس كاميرات محطمة (2011)، من إخراج مشترك للمزارع الفلسطيني عماد برناط والمخرج الإسرائيلي غاي دافيدي، يوثق أكثر من خمس سنوات من الاحتجاجات السلمية الأسبوعية في بلعين مع إقامة جدار الفصل الذي يعطل أراضي وحياة القرويين."}
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === "en"
                    ? "The film is structured around the destruction of five cameras—emphasizing the personal cost of filming the struggle. It follows Burnat's family life, especially his son Gibreel, and tracks the evolution of the resistance movement."
                    : "يتمحور الفيلم حول تدمير خمس كاميرات—مؤكداً على التكلفة الشخصية لتصوير النضال. يتابع حياة عائلة برناط، خاصة ابنه جبريل، ويتتبع تطور حركة المقاومة."}
                </p>
              </div>

              <div className="relative bg-gradient-to-br from-muted/30 to-muted/60 rounded-2xl p-6 border border-muted/40 backdrop-blur-sm">
                <div className="absolute -top-2 -right-2 w-8 h-8 border-2 border-primary/40 rounded-full bg-background/80 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {language === "en" ? "Film Details" : "تفاصيل الفيلم"}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "en" ? "Release Year:" : "سنة الإصدار:"}</span>
                    <span className="font-medium text-foreground">2011</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "en" ? "Runtime:" : "المدة:"}</span>
                    <span className="font-medium text-foreground">94 {language === "en" ? "minutes" : "دقيقة"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "en" ? "Language:" : "اللغة:"}</span>
                    <span className="font-medium text-foreground">{language === "en" ? "Arabic, Hebrew" : "عربي، عبري"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "en" ? "Genre:" : "النوع:"}</span>
                    <span className="font-medium text-foreground">{language === "en" ? "Documentary" : "وثائقي"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === "en" ? "Awards & Recognition" : "الجوائز والتقدير"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Internationally acclaimed and recognized by prestigious film festivals worldwide."
                : "معترف به دولياً ومُقدر من قبل مهرجانات سينمائية مرموقة عالمياً."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border border-muted/40 bg-gradient-to-br from-background to-muted/20 group">
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <CardTitle className={`text-sm ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? award.name_en : award.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-muted-foreground mb-2 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? award.event_en : award.event_ar}
                  </p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{award.year}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Where to Watch */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === "en" ? "Where to Watch" : "أين تشاهد"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Available on multiple streaming platforms and digital rental services."
                : "متوفر على منصات متعددة للبث وخدمات الإيجار الرقمي."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {streamingPlatforms.map((platform, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border border-muted/40 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{platform.name}</h3>
                  <p className={`text-sm text-muted-foreground mb-4 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? platform.note_en : platform.note_ar}
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Link href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      {language === "en" ? "Watch" : "شاهد"}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creators Section */}
      <section className="py-16 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isArabic ? "arabic-text" : "english-text"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === "en" ? "The Filmmakers" : "صناع الفيلم"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Meet the courageous individuals who brought this story to the world."
                : "تعرف على الأشخاص الشجعان الذين جلبوا هذه القصة إلى العالم."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {creators.map((creator, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border border-muted/40 bg-gradient-to-br from-background to-muted/20 group">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Users className="w-12 h-12 text-primary" />
                    {/* Replace with actual images when provided */}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {language === "en" ? creator.name : creator.name_ar}
                  </h3>
                  <p className={`text-sm text-muted-foreground mb-3 ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? creator.role_en : creator.role_ar}
                  </p>
                  <p className={`text-sm leading-relaxed text-muted-foreground ${isArabic ? "arabic-text" : "english-text"}`}>
                    {language === "en" ? creator.bio_en : creator.bio_ar}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
