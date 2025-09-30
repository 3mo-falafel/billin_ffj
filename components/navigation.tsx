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
      <div className="w-full flex h-24 items-center px-2 sm:px-4 lg:px-6 relative overflow-hidden">
        {/* Logo + Identity - Absolute Left */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <span className="relative inline-flex h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/50 backdrop-blur-sm transition-all group-hover:shadow-lg">
              <Image
                src="/bilin-logo.avif"
                alt={getTranslation("brandName", language)}
                width={64}
                height={64}
                className="h-full w-full object-cover object-center"
              />
            </span>
            <div className={`flex flex-col justify-center ${isArabic ? "items-end text-right" : "items-start text-left"}`}>
              <div className="text-lg font-bold tracking-tight text-foreground leading-tight whitespace-nowrap">
                {getTranslation("brandName", language)}
              </div>
              <div className="text-sm font-medium text-muted-foreground leading-tight whitespace-nowrap">
                {getTranslation("brandTagline", language)} • {getTranslation("established", language)}
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav - Positioned to avoid overlap */}
        <div className="hidden md:flex flex-1 justify-center ml-8">
          <ul
            className={`relative flex gap-1 rounded-full border border-border/60 bg-muted/30 p-1.5 backdrop-blur supports-[backdrop-filter]:bg-muted/40 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.key} className="">
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    data-active={active || undefined}
                    className={`group relative inline-flex min-w-[3.5rem] items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:text-sm ${
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
        <div className="flex items-center gap-3 ml-auto shrink-0 min-w-[200px]">
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary via-accent to-secondary px-5 font-semibold text-primary-foreground shadow hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 focus-visible:ring-2 focus-visible:ring-ring/60 whitespace-nowrap min-w-[80px]"
            >
              <Link href="/donate">{getTranslation("donate", language)}</Link>
            </Button>
            <div className="min-w-[80px]">
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`md:hidden transition-[max-height,opacity] duration-300 ease-out overflow-hidden ${
          isMenuOpen ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-3">
          {/* Mobile brand extended info */}
          <div
            className={`mb-3 flex items-center gap-4 rounded-xl border border-border/50 bg-muted/40 px-4 py-3 backdrop-blur-sm ${
              isArabic ? "flex-row-reverse text-right" : ""
            }`}
          >
            <span className="relative inline-flex h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
              <Image
                src="/bilin-logo.avif"
                alt={getTranslation("brandName", language)}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </span>
            <div className={`flex flex-col justify-center ${isArabic ? "items-end arabic-text text-right" : "english-text items-start text-left"}`}>
              <div className="text-base font-bold text-foreground leading-tight">
                {getTranslation("brandName", language)}
              </div>
              <div className="text-sm font-medium text-muted-foreground leading-tight">
                {getTranslation("brandTagline", language)} • {getTranslation("established", language)}
              </div>
            </div>
          </div>
          <ul
            className={`flex flex-col gap-1 rounded-2xl border border-border/60 bg-muted/40 p-2 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/50 ${
              isArabic ? "items-end" : "items-start"
            }`}
          >
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.key} className="w-full">
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    data-active={active || undefined}
                    className={`group relative block w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
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
          <div className="mt-4 flex gap-3">
            <Button
              asChild
              className="flex-1 rounded-full bg-gradient-to-r from-primary via-accent to-secondary font-semibold text-primary-foreground shadow hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/donate">{getTranslation("donate", language)}</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
