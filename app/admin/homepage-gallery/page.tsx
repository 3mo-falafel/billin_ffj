import { AdminHomepageGallery } from "@/components/admin/homepage-gallery-admin"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminHomepageGalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHomepageGallery />
    </div>
  )
}
