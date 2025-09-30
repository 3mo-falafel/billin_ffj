import { createClient } from "@/lib/supabase/server"
import { ActivityForm } from "@/components/admin/activity-form"
import { notFound } from "next/navigation"

interface EditActivityPageProps {
  params: Promise<{ id: string }>
}

export default async function EditActivityPage({ params }: EditActivityPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: activity, error } = await supabase.from("activities").select("*").eq("id", id).single()

  if (error || !activity) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-palestinian-green">Edit Activity</h1>
        <p className="text-gray-600 mt-2">Update activity information</p>
      </div>

      <ActivityForm activity={activity} />
    </div>
  )
}
