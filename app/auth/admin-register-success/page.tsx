import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminRegisterSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-palestinian-green/10 to-palestinian-red/10">
      <div className="w-full max-w-sm">
        <Card className="border-palestinian-green/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-palestinian-green">Registration Successful!</CardTitle>
            <CardDescription>Check your email to confirm your account</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You've successfully registered as an admin. Please check your email to confirm your account before signing
              in.
            </p>
            <Button asChild className="w-full bg-palestinian-green hover:bg-palestinian-green/90">
              <Link href="/auth/admin-login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
