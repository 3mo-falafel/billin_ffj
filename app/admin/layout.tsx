import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/admin-login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminUser) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20">
      <AdminNavigation user={user} />
      <main className="container mx-auto px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
