"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminRegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page since registration is disabled
    router.push("/auth/admin-login")
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-palestinian-green/10 to-palestinian-red/10">
      <div className="w-full max-w-sm">
        <Card className="border-palestinian-green/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-palestinian-green">Registration Disabled</CardTitle>
            <CardDescription>Admin registration is not available. Please use the login page.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Admin account creation has been disabled for security purposes.
            </p>
            <Link 
              href="/auth/admin-login" 
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-palestinian-green rounded-md hover:bg-palestinian-green/90 transition-colors"
            >
              Go to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
