"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { Target, Eye, Heart } from "lucide-react"

export function MissionVisionValues() {
  const { language, isArabic } = useLanguage()

  const sections = [
    {
      icon: Target,
      title: { en: "Our Mission", ar: "مهمتنا" },
      content: {
        en: "To preserve the cultural heritage of Bil'in while promoting peaceful resistance, community development, and social justice through education, cultural programs, and non-violent activism.",
        ar: "الحفاظ على التراث الثقافي لبلعين مع تعزيز المقاومة السلمية وتنمية المجتمع والعدالة الاجتماعية من خلال التعليم والبرامج الثقافية والنشاط اللاعنفي.",
      },
    },
    {
      icon: Eye,
      title: { en: "Our Vision", ar: "رؤيتنا" },
      content: {
        en: "A thriving Bil'in community that maintains its cultural identity, lives in peace and dignity, and serves as a model for peaceful coexistence and sustainable development.",
        ar: "مجتمع بلعين مزدهر يحافظ على هويته الثقافية، ويعيش في سلام وكرامة، ويكون نموذجاً للتعايش السلمي والتنمية المستدامة.",
      },
    },
    {
      icon: Heart,
      title: { en: "Our Values", ar: "قيمنا" },
      content: {
        en: "Non-violence, cultural preservation, community solidarity, environmental stewardship, education, transparency, and unwavering commitment to justice and human dignity.",
        ar: "اللاعنف، والحفاظ على الثقافة، والتضامن المجتمعي، والإشراف البيئي، والتعليم، والشفافية، والالتزام الثابت بالعدالة والكرامة الإنسانية.",
      },
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="border-border h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className={`text-2xl ${isArabic ? "arabic-text" : "english-text"}`}>
                    {section.title[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-muted-foreground leading-relaxed text-center ${isArabic ? "arabic-text" : "english-text"}`}
                  >
                    {section.content[language]}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
