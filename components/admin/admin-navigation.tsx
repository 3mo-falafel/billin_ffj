"use client"

// API calls will use fetch instead of Supabase
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
// Using custom User type instead of Supabase
interface User {
  email: string;
}
import { LogOut, Home, Calendar, Newspaper, ImageIcon, GraduationCap, Scroll, Users, Package, Images } from "lucide-react"

interface AdminNavigationProps {
  user: User
}

export function AdminNavigation({ user }: AdminNavigationProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (response.ok) {
        router.push("/")
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gradient-to-r from-palestinian-green/20 via-blue-500/20 to-emerald-500/20 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-palestinian-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-palestinian-green to-emerald-600 bg-clip-text text-transparent">
                  Bil'in Admin
                </div>
                <div className="text-xs text-gray-500 -mt-1">Content Management</div>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink href="/admin" icon={Home} label="Dashboard" />
              <NavLink href="/admin/news-ticker" icon={Scroll} label="News Ticker" color="from-red-500 to-pink-500" />
              <NavLink href="/admin/activities" icon={Calendar} label="Activities" color="from-blue-500 to-cyan-500" />
              <NavLink href="/admin/projects" icon={Package} label="Projects" color="from-green-500 to-emerald-500" />
              <NavLink href="/admin/news" icon={Newspaper} label="News" color="from-orange-500 to-amber-500" />
              <NavLink href="/admin/gallery" icon={ImageIcon} label="Gallery" color="from-emerald-500 to-teal-500" />
              <NavLink href="/admin/homepage-gallery" icon={Images} label="Homepage Gallery" color="from-purple-500 to-violet-500" />
              <NavLink href="/admin/scholarships" icon={GraduationCap} label="Scholarships" color="from-indigo-500 to-blue-500" />
              <NavLink href="/admin/involvement" icon={Users} label="Involvement" color="from-pink-500 to-rose-500" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-white/60 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-palestinian-green to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, icon: Icon, label, color = "from-palestinian-green to-emerald-600" }: {
  href: string
  icon: any
  label: string
  color?: string
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-white transition-all duration-300 hover:shadow-lg"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300`} />
      <div className="relative flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span className="hidden xl:inline">{label}</span>
      </div>
    </Link>
  )
}
