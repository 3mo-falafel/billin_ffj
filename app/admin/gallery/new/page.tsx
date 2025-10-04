import { GalleryForm } from "@/components/admin/gallery-form"

export const dynamic = 'force-dynamic'

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-palestinian-green">Add New Media</h1>
        <p className="text-gray-600 mt-2">Upload photos or videos to the gallery</p>
      </div>

      <GalleryForm />
    </div>
  )
}
