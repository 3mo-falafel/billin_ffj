"use client"

import { InvolvementRequestsAdmin } from "@/components/admin/involvement-requests-admin"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminInvolvementPage() {
  return <InvolvementRequestsAdmin />
}
