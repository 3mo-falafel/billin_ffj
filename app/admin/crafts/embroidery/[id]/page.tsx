import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Scissors } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmbroideryForm } from "../components/embroidery-form"
import { notFound } from "next/navigation"

interface EditEmbroideryPageProps {
  params: {
    id: string
  }
}

export default async function EditEmbroideryPage({ params }: EditEmbroideryPageProps) {
  const supabase = await createClient()
  
  const { data: embroidery, error } = await supabase
    .from("embroidery")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !embroidery) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Embroidery</h1>
          <p className="text-gray-600">Update the embroidery details</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl text-blue-900">
                {embroidery.title_en || "Untitled Embroidery"}
              </CardTitle>
              <CardDescription>
                Update the details for this embroidery piece
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <EmbroideryForm initialData={embroidery} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  )
}
