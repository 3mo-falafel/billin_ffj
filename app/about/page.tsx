"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to homepage with about section
    router.push("/#about")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to the About section on our homepage.</p>
      </div>
    </div>
  )
}
