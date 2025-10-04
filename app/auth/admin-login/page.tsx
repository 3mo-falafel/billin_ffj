"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Call our custom login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies in the request
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Wait a moment for cookies to be set, then redirect with full page reload
      setTimeout(() => {
        window.location.href = "/admin"
      }, 100)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-palestinian-green/10 to-palestinian-red/10">
      <div className="w-full max-w-sm">
        <Card className="border-palestinian-green/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-palestinian-green">{t("admin.login.title", "Admin Login")}</CardTitle>
            <CardDescription>{t("admin.login.description", "Access the content management system")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("common.email", "Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@bilin.org"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("common.password", "Password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-palestinian-red">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-palestinian-green hover:bg-palestinian-green/90"
                  disabled={isLoading}
                >
                  {isLoading ? t("common.loading", "Loading...") : t("admin.login.button", "Login to Admin")}
                </Button>
              </div>
              {/* Registration is disabled for security */}
              <div className="mt-4 text-center text-xs text-gray-500">
                Admin access is restricted. Contact the system administrator for credentials.
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
