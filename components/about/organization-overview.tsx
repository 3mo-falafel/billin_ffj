"use client"

import { useLanguage } from "@/hooks/use-language"
import { Heart, Users, Globe, Target } from "lucide-react"

export function OrganizationOverview() {
  const { language, isArabic } = useLanguage()

  const features = {
    en: [
      {
        icon: Heart,
        title: "Peaceful Resistance",
        description: "Since 2005, leading non-violent demonstrations and creative advocacy for human rights (Organization established 2008)"
      },
      {
        icon: Users,
        title: "Community Rebuilding", 
        description: "Land restoration, education funding, and trauma support programs for our people"
      },
      {
        icon: Globe,
        title: "Global Awareness",
        description: "Putting Bil'in on the international map through media attention and storytelling"
      },
      {
        icon: Target,
        title: "Future Vision",
        description: "Working tirelessly for justice, peace, and a better tomorrow for all"
      }
    ],
    ar: [
      {
        icon: Heart,
        title: "المقاومة السلمية",
        description: "منذ 2005، نقود التظاهرات اللاعنفية والمناصرة الإبداعية لحقوق الإنسان (تأسست المنظمة 2008)"
      },
      {
        icon: Users,
        title: "بناء المجتمع",
        description: "استصلاح الأراضي وتمويل التعليم وبرامج دعم الصدمات لشعبنا"
      },
      {
        icon: Globe,
        title: "الوعي العالمي",
        description: "وضع بلعين على الخريطة الدولية من خلال الاهتمام الإعلامي ورواية القصص"
      },
      {
        icon: Target,
        title: "رؤية المستقبل",
        description: "العمل بلا كلل من أجل العدالة والسلام وغد أفضل للجميع"
      }
    ]
  }

  const content = {
    en: {
      subtitle: "An authentic, community-rooted movement of peaceful resistance and renewal.",
      description: "Friends of Freedom and Justice (FFJ) is a non-profit organization recognized by the Palestinian Authority, based in Bil'in and Ramallah. We are more than an organization - we are a living testament to the power of peaceful resistance and community resilience.",
      mission: "Through creativity, determination, and unwavering commitment to non-violence, we document the challenges faced by our community, advocate for human rights globally, and foster international understanding of the Palestinian struggle for justice."
    },
    ar: {
      subtitle: "حركة أصيلة متجذرة في المجتمع للمقاومة السلمية والبناء المتجدد.",
      description: "أصدقاء الحرية والعدالة (FFJ) منظمة غير ربحية معترف بها من قبل السلطة الفلسطينية، مقرها في بلعين ورام الله. نحن أكثر من منظمة - نحن شاهد حي على قوة المقاومة السلمية وصمود المجتمع.",
      mission: "من خلال الإبداع والعزيمة والالتزام الثابت باللاعنف، نوثق التحديات التي يواجهها مجتمعنا، وندافع عن حقوق الإنسان عالمياً، ونعزز الفهم الدولي للنضال الفلسطيني من أجل العدالة."
    }
  }

  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-background via-muted/20 to-primary/5 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 sm:w-40 h-32 sm:h-40 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-10 sm:mb-16 ${isArabic ? "arabic-text" : "english-text"}`}>
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4 sm:mb-6">
            {language === "en" ? "Who We Are" : "من نحن"}
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed px-2">
            {content[language].subtitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-10 sm:mb-16">
          {/* Content Side */}
          <div className={`space-y-6 sm:space-y-8 ${isArabic ? "arabic-text lg:order-2" : "english-text"}`}>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {content[language].description}
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {content[language].mission}
              </p>
            </div>
            
            {/* Call to action */}
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  {language === "en" ? "Global Impact" : "تأثير عالمي"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === "en" 
                    ? "Bil'in's story reaches hearts and minds worldwide"
                    : "قصة بلعين تصل إلى القلوب والعقول في جميع أنحاء العالم"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`${isArabic ? "lg:order-1" : ""}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl transform rotate-6" />
              <div 
                className="relative h-80 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                style={{ backgroundImage: "url('/peaceful-demonstration.png')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-white font-medium text-sm">
                      {language === "en" 
                        ? "Every Friday: Peaceful demonstrations for justice"
                        : "كل جمعة: مظاهرات سلمية من أجل العدالة"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features[language].map((feature, index) => (
            <div key={index} className="group">
              <div className="relative p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className={`font-semibold text-foreground mb-2 ${isArabic ? "arabic-text text-right" : "english-text"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm text-muted-foreground leading-relaxed ${isArabic ? "arabic-text text-right" : "english-text"}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrganizationOverview
