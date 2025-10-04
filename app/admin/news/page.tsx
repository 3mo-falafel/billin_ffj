import { NewsAdmin } from "@/components/admin/news-admin-new"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function NewsPage() {
  return <NewsAdmin />
}
