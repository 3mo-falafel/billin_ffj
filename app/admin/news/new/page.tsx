import { NewsForm } from "@/components/admin/news-form"

export const dynamic = 'force-dynamic'

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-palestinian-green">Add New News Article</h1>
        <p className="text-gray-600 mt-2">Create a new news article or press release</p>
      </div>

      <NewsForm />
    </div>
  )
}
