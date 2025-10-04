"use client"

import GalleryAdminWrapper from "@/components/admin/gallery-admin-wrapper"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminGalleryPage() {
  return <GalleryAdminWrapper />
}