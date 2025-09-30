"use client"

import { useLanguage } from "@/hooks/use-language"
import { getTranslation, Language } from "@/lib/i18n"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scissors, Package, Phone, Star, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CraftsClientContentProps {
  traditionalItems: any[]
  handmadeItems: any[]
  saleItems: any[]
}

export function CraftsClientContent({ traditionalItems, handmadeItems, saleItems }: CraftsClientContentProps) {
  const { language, isArabic } = useLanguage()
  
  const showcaseItems = [...(traditionalItems || []), ...(handmadeItems || [])]
  const featuredShowcase = showcaseItems.filter(item => item.is_featured)
  const featuredSale = (saleItems || []).filter(item => item.is_featured)

  return (
    <div className={`min-h-screen embroidery-page-bg ${isArabic ? "arabic-text" : "english-text"}`} dir={isArabic ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <Scissors className="w-12 h-12" />
              <Package className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {getTranslation("craftsHeroTitle", language)}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            {getTranslation("craftsHeroDescription", language)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="btn-tatreez-primary">
              <Link href="#showcase">
                <Scissors className="w-5 h-5 mr-2" />
                {getTranslation("traditionalAndHandmade", language)}
              </Link>
            </Button>
            <Button asChild size="lg" className="btn-tatreez-gold">
              <Link href="#for-sale">
                <Package className="w-5 h-5 mr-2" />
                {getTranslation("embroideryToBuy", language)}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Showcase Section: Traditional + Handmade (pictures and texts) */}
      <section id="showcase" className="py-16 px-4 bg-white/95">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Scissors className="w-12 h-12 text-palestinian-red" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-palestinian-black mb-4">
              {getTranslation("traditionalEmbroideryShowcase", language)}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {getTranslation("embroideryShowcaseDescription", language)}
            </p>
          </div>

          {showcaseItems && showcaseItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {showcaseItems.map((item) => (
                <CraftCard key={item.id} item={item} type="showcase" language={language} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Scissors className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                {getTranslation("comingSoon", language)}
              </h3>
              <p className="text-gray-400">
                {language === "en" 
                  ? "Beautiful embroidery and handmade pieces will be available here soon."
                  : "قطع التطريز والحرف اليدوية الجميلة ستكون متاحة هنا قريباً."
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* For Sale Section */}
      <section id="for-sale" className="py-16 px-4 bg-gray-50/90">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Package className="w-12 h-12 text-palestinian-gold" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-palestinian-black mb-4">
              {getTranslation("embroideryToBuyTitle", language)}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {getTranslation("embroideryToBuyDescription", language)}
            </p>
          </div>

          {saleItems && saleItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {saleItems.map((item) => (
                <CraftCard key={item.id} item={item} type="sale" language={language} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                {getTranslation("comingSoon", language)}
              </h3>
              <p className="text-gray-400">
                {language === "en"
                  ? "Beautiful embroidery items for sale will be available here soon."
                  : "قطع التطريز الجميلة للبيع ستكون متاحة هنا قريباً."
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-palestinian-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getTranslation("supportBilinArtisans", language)}
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            {getTranslation("supportArtisansDescription", language)}
          </p>
          <Button asChild size="lg" className="btn-tatreez-red">
            <Link href="/contact">
              <Phone className="w-5 h-5 mr-2" />
              {getTranslation("getInTouchButton", language)}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function CraftCard({ item, type, featured = false, language }: { 
  item: any, 
  type?: "showcase" | "sale", 
  featured?: boolean,
  language: Language
}) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-gray-200/50">
      <div className="relative aspect-square bg-gray-100">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title_en || getTranslation("handmadeCraft", language)}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            {type === "sale" ? (
              <Package className="w-16 h-16 text-gray-400" />
            ) : (
              <Scissors className="w-16 h-16 text-gray-400" />
            )}
          </div>
        )}
        
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-palestinian-gold text-palestinian-black shadow-lg border-2 border-white/50">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {getTranslation("featured", language)}
            </Badge>
          </div>
        )}
        
        {item.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800 border border-gray-200/50">
              {item.category.replace('-', ' ')}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-palestinian-red transition-colors">
            {item.title_en || getTranslation("handmadeCraft", language)}
          </h3>
          
          {item.title_ar && (
            <h4 className="text-gray-700 text-right font-medium" dir="rtl">
              {item.title_ar}
            </h4>
          )}
          
          {item.description_en && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {item.description_en}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            {type === "sale" && item.price ? (
              <div className="text-2xl font-bold text-palestinian-green">
                ${item.price}
              </div>
            ) : <div />}

            {type === "sale" && item.contact_url && (
              <Button asChild size="sm" className="btn-tatreez-green">
                <Link href={item.contact_url} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {getTranslation("contactButton", language)}
                </Link>
              </Button>
            )}
          </div>
          {/* Optional details for showcase items */}
          {type === "showcase" && item.material && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">{getTranslation("material", language)}:</span> {item.material}
            </div>
          )}
          {type === "showcase" && item.dimensions && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">{getTranslation("size", language)}:</span> {item.dimensions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
