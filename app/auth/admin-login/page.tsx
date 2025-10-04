"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useTransition } from "react"
import { useLanguage } from "@/hooks/use-language"
import { loginAction } from "./actions"

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    console.log('🔵 Form submitted - using server action')

    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        const result = await loginAction(formData)
        
        if (result?.error) {
          console.log('🔴 Server action returned error:', result.error)
          setError(result.error)
        }
        // If successful, the server action will redirect automatically
      } catch (error) {
        console.error('🔴 Client error:', error)
        setError('An unexpected error occurred')
      }
    })
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
                    name="email"
                    type="email"
                    placeholder="admin@bilin.org"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("common.password", "Password")}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                {error && <p className="text-sm text-palestinian-red">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-palestinian-green hover:bg-palestinian-green/90"
                  disabled={isPending}
                >
                  {isPending ? t("common.loading", "Loading...") : t("admin.login.button", "Login to Admin")}
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
