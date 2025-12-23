// Simple translation utility - In production, you'd use a proper translation service
export async function translateToArabic(text: string): Promise<string> {
  // This is a mock translation function
  // In a real application, you would integrate with Google Translate API, Azure Translator, or similar service
  
  const translations: Record<string, string> = {
    // Common words and phrases
    "activities": "الأنشطة",
    "news": "الأخبار", 
    "events": "الأحداث",
    "community": "المجتمع",
    "resistance": "المقاومة",
    "peaceful": "سلمية",
    "education": "التعليم",
    "cultural": "ثقافية",
    "workshop": "ورشة عمل",
    "demonstration": "مظاهرة",
    "solidarity": "التضامن",
    "freedom": "الحرية",
    "justice": "العدالة",
    "village": "القرية",
    "festival": "مهرجان",
    "olive": "الزيتون",
    "harvest": "الحصاد",
    "traditional": "تقليدية",
    "heritage": "التراث",
    "children": "الأطفال",
    "youth": "الشباب",
    "women": "النساء",
    "farmers": "المزارعون",
    "students": "الطلاب",
    "weekly": "أسبوعية",
    "friday": "الجمعة",
    "center": "المركز",
    "square": "الساحة",
    "school": "المدرسة",
    "mosque": "المسجد",
    "celebration": "احتفال",
    "program": "برنامج",
    "project": "مشروع",
    "initiative": "مبادرة",
    "volunteer": "متطوع",
    "support": "الدعم",
    "help": "المساعدة",
    "unity": "الوحدة",
    "together": "معاً",
    "palestine": "فلسطين",
    "palestinian": "فلسطيني",
    "international": "دولي",
    "visitors": "الزوار",
    "guests": "الضيوف"
  }

  // Simple word-by-word translation for demo
  let translatedText = text.toLowerCase()
  
  Object.entries(translations).forEach(([english, arabic]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi')
    translatedText = translatedText.replace(regex, arabic)
  })

  // If no translation found, return a generic Arabic placeholder
  if (translatedText === text.toLowerCase()) {
    return `${text} (ترجمة تلقائية)`
  }

  return translatedText
}

// Image upload utility
export const uploadImage = async (file: File): Promise<string> => {
  // Create a promise to handle the file reading
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      if (event.target?.result) {
        // In a real application, you would upload to your storage service (Supabase Storage, AWS S3, etc.)
        // For now, we'll return the data URL for preview
        resolve(event.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Validate image file - accepts any image type, we'll compress it on the server
export const validateImageFile = (file: File): boolean => {
  const maxSize = 50 * 1024 * 1024 // 50MB - server will compress
  
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file')
  }
  
  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 50MB')
  }
  
  return true
}
