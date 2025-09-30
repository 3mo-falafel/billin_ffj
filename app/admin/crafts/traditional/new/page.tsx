import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TraditionalForm } from "../components/traditional-form"

export default function NewTraditionalPage() {
  return (
    <div className="space-y-6 relative">
      {/* Palestinian Embroidery Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5 cross-stitch-bg"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center space-x-4">
        <Button asChild variant="outline" size="sm" className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white">
          <Link href="/admin/crafts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Crafts
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#C8102E]">Add Traditional Embroidery</h1>
          <p className="text-gray-600">Showcase traditional Palestinian embroidery (educational content)</p>
        </div>
      </div>

      {/* Form */}
      <Card className="relative z-10 max-w-4xl border-t-4 border-t-[#C8102E] shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#C8102E]/10 to-[#DAA520]/10 border-b">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-[#C8102E]" />
            <div>
              <CardTitle className="text-xl text-[#C8102E]">Traditional Embroidery Showcase</CardTitle>
              <CardDescription>
                Add pictures and descriptions to educate visitors about traditional Palestinian embroidery
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-br from-[#F8F5F0] to-white">
          <TraditionalForm />
        </CardContent>
      </Card>
    </div>
  )
}
