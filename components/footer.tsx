"use client"

import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const { language, isArabic } = useLanguage()

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/bilin.village", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/bilin_village", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/bilin_village", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/c/BilinVillage", label: "YouTube" },
  ]

  const quickLinks = [
    { key: "about" as const, href: "/about" },
    { key: "activities" as const, href: "/activities" },
    { key: "news" as const, href: "/news" },
    { key: "gallery" as const, href: "/gallery" },
    { key: "contact" as const, href: "/contact" },
  ]

  return (
    <footer className={`bg-card border-t ${isArabic ? "arabic-text" : "english-text"}`} dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Organization Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/bilin-logo.avif" alt="Bil'in Village" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">{getTranslation("heroTitle", language)}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{getTranslation("established", language)}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {getTranslation("organizationDescription", language)}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">{getTranslation("quickLinks", language)}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getTranslation(link.key, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">{getTranslation("contact", language)}</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {getTranslation("addressText", language)}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                <div className="text-xs sm:text-sm text-muted-foreground">+972598403676</div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                <div className="text-xs sm:text-sm text-muted-foreground break-all">ffj.mediacenter@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Documentary Recognition */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">
              {getTranslation("internationalRecognition", language)}
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="text-xs sm:text-sm text-muted-foreground">
                <strong className="text-foreground">{getTranslation("fiveBrokenCameras", language)}</strong>
                <br />
                {getTranslation("oscarNominated", language)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                <strong className="text-foreground">19</strong>{" "}
                {getTranslation("yearsOfResistance", language)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © 2024 {getTranslation("heroTitle", language)}. {getTranslation("allRightsReserved", language)}
          </div>
          <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              {getTranslation("privacyPolicy", language)}
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              {getTranslation("termsOfUse", language)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
