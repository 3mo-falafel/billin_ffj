import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Newspaper, ImageIcon, Plus, Users, TrendingUp, Eye, Star, Clock, Scissors, Package } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Aggregate counts + fetch recent content (limit small for dashboard)
  const [
    { count: activitiesCount },
    { count: newsCount },
    { count: galleryCount },
    { count: involvementCount },
    { count: embroideryCount },
    { count: projectsCount },
    { data: recentActivities },
    { data: recentNews },
    { data: recentGallery },
    { data: recentCrafts },
  ] = await Promise.all([
    supabase.from("activities").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase.from("involvement_requests").select("id", { count: "exact", head: true }),
    supabase.from("embroidery").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("activities").select("id,title_en,date").order("date", { ascending: false }).limit(3),
    supabase.from("news").select("id,title_en,date,featured").order("date", { ascending: false }).limit(3),
    supabase
      .from("gallery")
      .select("id,title_en,media_type,created_at,media_url")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase.from("embroidery").select("id,title_en,image_url,created_at").order("created_at", { ascending: false }).limit(4),
  ])

  const statsCards = [
    {
      title: "Activities",
      count: activitiesCount || 0,
      icon: Calendar,
      description: "Community activities and events",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      link: "/admin/activities",
      change: "+12%"
    },
    {
      title: "News Articles",
      count: newsCount || 0,
      icon: Newspaper,
      description: "Published news and updates",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      link: "/admin/news",
      change: "+8%"
    },
    {
      title: "Gallery Items",
      count: galleryCount || 0,
      icon: ImageIcon,
      description: "Photos and videos",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      link: "/admin/gallery",
      change: "+25%"
    },
    {
      title: "Village Projects",
      count: (embroideryCount || 0) + (projectsCount || 0),
      icon: Package,
      description: "Embroidery and village projects",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50",
      link: "/admin/projects",
      change: "+15%"
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">System Online</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-palestinian-green via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome back! Manage content for Friends of Freedom and Justice – Bil'in community website
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <QuickActionButton href="/admin/activities/new" icon={Calendar} label="New Activity" color="bg-blue-500" />
        <QuickActionButton href="/admin/news/new" icon={Newspaper} label="Add News" color="bg-orange-500" />
        <QuickActionButton href="/admin/gallery/new" icon={ImageIcon} label="Upload Media" color="bg-emerald-500" />
        <QuickActionButton href="/admin/crafts/embroidery/new" icon={Scissors} label="New Embroidery" color="bg-rose-500" />
        <QuickActionButton href="/admin/projects/new" icon={Package} label="New Project" color="bg-pink-500" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={stat.title} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up`} style={{animationDelay: `${index * 100}ms`}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{stat.count}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">{stat.change}</span>
                </div>
              </div>
              <Button asChild className={`w-full mt-4 bg-gradient-to-r ${stat.color} hover:shadow-lg transition-all duration-300`}>
                <Link href={stat.link}>Manage {stat.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <CardTitle>Recent Activities</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {recentActivities?.length || 0}
              </Badge>
            </div>
            <CardDescription className="text-blue-100">Latest community activities</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {(recentActivities || []).map((activity: any, index: number) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/activities/${activity.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate block"
                    >
                      {activity.title_en || "(untitled)"}
                    </Link>
                    <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {!recentActivities?.length && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No activities yet</p>
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="w-full mt-4 border-blue-200 hover:bg-blue-50">
              <Link href="/admin/activities">View All Activities</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent News */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5" />
                <CardTitle>Latest News</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {recentNews?.length || 0}
              </Badge>
            </div>
            <CardDescription className="text-orange-100">Recent articles and updates</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {(recentNews || []).map((news: any) => (
                <div key={news.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/news/${news.id}`}
                        className="font-medium text-gray-900 hover:text-orange-600 transition-colors truncate"
                      >
                        {news.title_en || "(untitled)"}
                      </Link>
                      {news.featured && <Star className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {!recentNews?.length && (
                <div className="text-center py-8 text-gray-500">
                  <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No news articles yet</p>
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="w-full mt-4 border-orange-200 hover:bg-orange-50">
              <Link href="/admin/news">View All News</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Gallery */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <CardTitle>Media Gallery</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {recentGallery?.length || 0}
              </Badge>
            </div>
            <CardDescription className="text-emerald-100">Recent uploads</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {(recentGallery || []).map((item: any) => (
                <Link
                  key={item.id}
                  href={`/admin/gallery/${item.id}`}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
                  title={item.title_en || 'Untitled'}
                >
                  {item.media_type === "image" ? (
                    <img src={item.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600">
                      <div className="text-center">
                        <Eye className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">Video</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </Link>
              ))}
              {!recentGallery?.length && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No media uploaded yet</p>
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="w-full mt-4 border-emerald-200 hover:bg-emerald-50">
              <Link href="/admin/gallery">View All Media</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Crafts */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5" />
                <CardTitle>Handmade Crafts</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {recentCrafts?.length || 0}
              </Badge>
            </div>
            <CardDescription className="text-rose-100">Recent craft items</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {(recentCrafts || []).map((item: any) => (
                <Link
                  key={item.id}
                  href={`/admin/crafts/embroidery/${item.id}`}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-lg"
                  title={item.title_en || 'Untitled'}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600">
                      <div className="text-center">
                        <Scissors className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">Craft</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </Link>
              ))}
              {!recentCrafts?.length && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <Scissors className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No crafts added yet</p>
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="w-full mt-4 border-rose-200 hover:bg-rose-50">
              <Link href="/admin/crafts">View All Crafts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

function QuickActionButton({ href, icon: Icon, label, color }: {
  href: string
  icon: any
  label: string
  color: string
}) {
  return (
    <Button asChild className={`${color} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>
      <Link href={href} className="flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </Link>
    </Button>
  )
}
