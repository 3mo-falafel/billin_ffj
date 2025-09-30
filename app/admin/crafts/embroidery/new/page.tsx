import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Scissors } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmbroideryForm } from "../components/embroidery-form"

export default function NewEmbroideryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/crafts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Crafts
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Embroidery</h1>
          <p className="text-gray-600">Create a new embroidery listing for the website</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl text-blue-900">Embroidery Details</CardTitle>
              <CardDescription>
                Fill in the details for this handmade embroidery piece
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <EmbroideryForm />
        </CardContent>
      </Card>
    </div>
  )
}
