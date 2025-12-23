"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DocumentaryBanner() {
  const { language } = useLanguage()

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 my-6 sm:my-8">
      <div className="max-w-6xl mx-auto">
        <div 
          className="relative w-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Background with your uploaded image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: "url('/5-broken-cameras-banner.png')"
            }}
          />
          
          {/* Content - Responsive Layout */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 sm:px-8 gap-3 sm:gap-4">
            {/* Left side - Image */}
            <div className="flex-shrink-0 order-1">
              <img 
                src="/5bc.png" 
                alt="5 Broken Cameras"
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Center - Text */}
            <div className="flex-1 text-center order-3 sm:order-2 mx-1 sm:mx-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                {language === 'ar' ? 'خمس كاميرات محطمة' : '5 Broken Cameras'}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-tight line-clamp-2 sm:line-clamp-none">
                {language === 'ar' 
                  ? 'فيلم وثائقي مؤثر عن النضال السلمي لقرية بلعين'
                  : 'A powerful documentary about Bil\'in village\'s peaceful resistance'
                }
              </p>
            </div>
            
            {/* Right side - Button */}
            <div className="flex-shrink-0 order-2 sm:order-3">
              <Link href="/film/5-broken-cameras">
                <Button 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap"
                >
                  {language === 'ar' ? 'شاهد قصتنا' : 'Watch Our Story'}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Palestinian flag accent - bottom border */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />
        </div>
      </div>
    </section>
  )
}
