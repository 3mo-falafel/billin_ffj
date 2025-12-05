"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const { language, isArabic } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { key: "home" as const, href: "/" },
    { key: "about" as const, href: "/#about", isScroll: true },
    { key: "activities" as const, href: "/activities" },
    { key: "projects" as const, href: "/projects" },
    { key: "news" as const, href: "/news" },
    { key: "gallery" as const, href: "/gallery" },
    { key: "scholarships" as const, href: "/scholarships" },
    { key: "getInvolved" as const, href: "/get-involved" },
    { key: "contact" as const, href: "/contact" },
  ]

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.isScroll && pathname === '/') {
      e.preventDefault()
      const element = document.getElementById('about')
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
      setIsMenuOpen(false)
    }
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 shadow-sm"
      aria-label="Main navigation"
    >
      <div className="w-full flex h-20 md:h-24 items-center px-3 sm:px-4 lg:px-6 relative">
        {/* Logo + Identity */}
        <div className="flex items-center gap-2 shrink-0 min-w-0 flex-1 lg:flex-none">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 min-w-0"
          >
            <span className="relative inline-flex h-12 w-12 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/50 backdrop-blur-sm transition-all group-hover:shadow-lg">
              <Image
                src="/bilin-logo.avif"
                alt={getTranslation("brandName", language)}
                width={64}
                height={64}
                className="h-full w-full object-cover object-center"
              />
            </span>
            <div className={`hidden sm:flex flex-col justify-center min-w-0 ${isArabic ? "items-end text-right" : "items-start text-left"}`}>
              <div className="text-base md:text-lg font-bold tracking-tight text-foreground leading-tight truncate max-w-[150px] md:max-w-none">
                {getTranslation("brandName", language)}
              </div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground leading-tight truncate max-w-[150px] md:max-w-none">
                {getTranslation("brandTagline", language)} • {getTranslation("established", language)}
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav - Hidden on mobile and tablet */}
        <div className="hidden lg:flex flex-1 justify-center mx-4 xl:mx-8">
          <ul
            className={`relative flex gap-1 rounded-full border border-border/60 bg-muted/30 p-1.5 backdrop-blur supports-[backdrop-filter]:bg-muted/40 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    data-active={active || undefined}
                    className={`group relative inline-flex min-w-[3.5rem] items-center justify-center whitespace-nowrap rounded-full px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
                      isArabic ? "arabic-text" : "english-text"
                    } text-muted-foreground data-[active]:text-foreground`}
                  >
                    {/* Hover / active soft background */}
                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 data-[active=true]:opacity-100" />
                    <span className="relative">
                      {getTranslation(item.key, language)}
                      <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-4 data-[active=true]:w-6" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary via-accent to-secondary px-4 xl:px-5 font-semibold text-primary-foreground shadow hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 focus-visible:ring-2 focus-visible:ring-ring/60 whitespace-nowrap"
            >
              <Link href="/donate">{getTranslation("donate", language)}</Link>
            </Button>
            <LanguageToggle />
          </div>

          {/* Mobile & Tablet controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet panel */}
      <div
        className={`lg:hidden transition-[max-height,opacity] duration-300 ease-out overflow-hidden ${
          isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 sm:px-4 pb-6 pt-3 overflow-y-auto max-h-[calc(80vh-2rem)]">
          {/* Mobile brand extended info */}
          <div
            className={`mb-3 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 backdrop-blur-sm ${
              isArabic ? "flex-row-reverse text-right" : ""
            }`}
          >
            <span className="relative inline-flex h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
              <Image
                src="/bilin-logo.avif"
                alt={getTranslation("brandName", language)}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </span>
            <div className={`flex flex-col justify-center min-w-0 flex-1 ${isArabic ? "items-end arabic-text text-right" : "english-text items-start text-left"}`}>
              <div className="text-sm md:text-base font-bold text-foreground leading-tight truncate w-full">
                {getTranslation("brandName", language)}
              </div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground leading-tight truncate w-full">
                {getTranslation("brandTagline", language)} • {getTranslation("established", language)}
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <ul
            className={`flex flex-col gap-1 rounded-2xl border border-border/60 bg-muted/40 p-2 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/50 mb-3 ${
              isArabic ? "items-end" : "items-start"
            }`}
          >
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.key} className="w-full">
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(item, e)
                      setIsMenuOpen(false)
                    }}
                    data-active={active || undefined}
                    className={`group relative block w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
                      isArabic ? "arabic-text text-right" : "english-text"
                    } text-muted-foreground data-[active]:text-foreground`}
                  >
                    <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 opacity-0 shadow-sm ring-1 ring-border/60 transition-opacity group-hover:opacity-100 data-[active]:opacity-100" />
                    {getTranslation(item.key, language)}
                  </Link>
                </li>
              )
            })}
          </ul>
          
          {/* Donate Button */}
          <Button
            asChild
            className="w-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary font-semibold text-primary-foreground shadow hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/donate">{getTranslation("donate", language)}</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
