import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "@/components/admin/gallery-form"
import { notFound } from "next/navigation"

interface EditGalleryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: galleryItem, error } = await supabase.from("gallery").select("*").eq("id", id).single()

  if (error || !galleryItem) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-palestinian-green">Edit Media</h1>
        <p className="text-gray-600 mt-2">Update media information</p>
      </div>

      <GalleryForm galleryItem={galleryItem} />
    </div>
  )
}
