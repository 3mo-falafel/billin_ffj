"use client"

import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { useEffect, useState } from "react"

export function AboutHero() {
  const { language, isArabic } = useLanguage()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.2 }
    )

    const element = document.getElementById('about-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const aboutText = {
    title: getTranslation("aboutTitle", language),
    subtitle: getTranslation("aboutSubtitle", language),
    description: getTranslation("aboutDescription", language),
    mission: getTranslation("aboutMission", language),
    vision: getTranslation("aboutVision", language)
  }

  return (
    <section id="about-section" className="relative py-24 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${isArabic ? "arabic-text" : "english-text"}`}>
          
          {/* Image Section */}
          <div className={`relative order-2 lg:order-1 transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative group space-y-6">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500" />
              
              {/* First image container */}
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-700">
                <div 
                  className="w-full h-80 bg-cover bg-center rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: 'url("/B2.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Second image container */}
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-700">
                <div 
                  className="w-full h-80 bg-cover bg-center rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: 'url("/B333333.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Historical accent elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-primary/40 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 border-2 border-secondary/40 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`space-y-8 order-1 lg:order-2 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            
            {/* Header */}
            <div className="space-y-4">
              <div className={`inline-block px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold text-primary tracking-wider transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {aboutText.subtitle}
              </div>
              
              <h1 className={`text-4xl lg:text-5xl font-bold text-foreground leading-tight transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {aboutText.title}
              </h1>
            </div>

            {/* Main Description */}
            <div className="space-y-6">
              <p className={`text-lg text-muted-foreground leading-relaxed transition-all duration-700 delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {aboutText.description}
              </p>

              <p className={`text-lg text-muted-foreground leading-relaxed transition-all duration-700 delay-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {aboutText.mission}
              </p>

              <div className={`relative pl-6 border-l-4 border-primary/30 transition-all duration-700 delay-600 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <p className="text-lg font-medium text-foreground leading-relaxed italic">
                  {aboutText.vision}
                </p>
              </div>
            </div>

            {/* Historical timeline accent */}
            <div className={`flex items-center space-x-8 pt-6 transition-all duration-700 delay-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">2008</div>
                <div className="text-sm text-muted-foreground">{getTranslation("founded", language)}</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">16+</div>
                <div className="text-sm text-muted-foreground">{getTranslation("years", language)}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
