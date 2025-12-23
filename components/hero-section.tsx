"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"
import { useEffect, useState } from "react"

// Enhanced hero with motion effects and new background
export function HeroSection() {
  const { language, isArabic } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] md:min-h-[100vh] flex items-center justify-center overflow-hidden entrance-hero">
      {/* Enhanced Background with new image */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full transform transition-transform duration-[2000ms] ease-out" 
             style={{ 
               backgroundImage: 'url("/B1.jpg")',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
               filter: 'saturate(1.1) contrast(1.1) brightness(0.9)',
               transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
               opacity: isLoaded ? 1 : 0
             }} 
             aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>



      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
        <div className={`space-y-6 sm:space-y-10 text-center ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className="space-y-4 sm:space-y-6">
            <div className={`inline-block px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 text-xs sm:text-sm tracking-wider font-medium text-primary shadow-sm transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {getTranslation("brandTagline", language)}
            </div>
            <h1 className={`font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-balance text-white drop-shadow-lg transition-all duration-1200 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              {getTranslation("heroTitle", language)}
            </h1>
            <p className={`text-base sm:text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {getTranslation("heroSubtitle", language)}
            </p>
          </div>

            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Button asChild size="lg" className="relative group w-full sm:w-auto px-8 sm:px-10 h-12 sm:h-14 text-sm sm:text-base font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link href="/about">
                  <span className="relative z-10">{getTranslation("learnMore", language)}</span>
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-primary via-primary/90 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-medium bg-transparent backdrop-blur-sm border-white/60 text-white hover:bg-white/20 hover:border-white/80 hover:scale-105 transition-all duration-300">
                <Link href="/gallery">{getTranslation("gallery", language)}</Link>
              </Button>
            </div>
        </div>
      </div>

      {/* Enhanced scroll cue with motion - hidden on very small screens */}
      <div className={`absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest flex-col items-center gap-2 hidden sm:flex transition-all duration-1000 delay-1400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="animate-pulse">{getTranslation("scroll", language)}</span>
        <span className="block h-8 w-px bg-gradient-to-b from-transparent via-white/60 to-white/0 animate-pulse" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`particle particle-1 transition-opacity duration-2000 delay-1600 ${isLoaded ? 'opacity-30' : 'opacity-0'}`} />
        <div className={`particle particle-2 transition-opacity duration-2000 delay-1800 ${isLoaded ? 'opacity-40' : 'opacity-0'}`} />
        <div className={`particle particle-3 transition-opacity duration-2000 delay-2000 ${isLoaded ? 'opacity-20' : 'opacity-0'}`} />
      </div>
    </section>
  )
}
