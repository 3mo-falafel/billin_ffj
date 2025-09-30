import { createClient } from "@/lib/supabase/server"
import { NewsForm } from "@/components/admin/news-form"
import { notFound } from "next/navigation"

interface EditNewsPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: news, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error || !news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-palestinian-green">Edit News Article</h1>
        <p className="text-gray-600 mt-2">Update news article information</p>
      </div>

      <NewsForm news={news} />
    </div>
  )
}
