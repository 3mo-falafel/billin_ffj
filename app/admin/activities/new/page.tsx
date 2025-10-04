import { ActivityForm } from "@/components/admin/activity-form"

export const dynamic = 'force-dynamic'

export default function NewActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-palestinian-green">Add New Activity</h1>
        <p className="text-gray-600 mt-2">Create a new community activity or event</p>
      </div>

      <ActivityForm />
    </div>
  )
}
