"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/use-auth"
import { useRole } from "@/lib/role-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "worker" | "supervisor" | "admin"
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requiredRole,
  redirectTo = "/login" 
}: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { role, loading: roleLoading } = useRole()

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && role !== requiredRole) {
        // Redirect based on user's actual role
        switch (role) {
          case "worker":
            router.push("/worker/assignments")
            break
          case "supervisor":
            router.push("/supervisor/pending")
            break
          case "admin":
            router.push("/admin/payroll")
            break
          default:
            router.push(redirectTo)
        }
      }
    }
  }, [isAuthenticated, role, requiredRole, authLoading, roleLoading, router, redirectTo])

  if (authLoading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
