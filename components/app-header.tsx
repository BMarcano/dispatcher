"use client"

import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRole } from "@/lib/role-context"
import { useAuth } from "@/lib/supabase/use-auth"

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter()
  const { role, workerName } = useRole()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getRoleBadgeVariant = () => {
    switch (role) {
      case "admin":
        return "default"
      case "supervisor":
        return "secondary"
      case "worker":
        return "outline"
      default:
        return "outline"
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Admin"
      case "supervisor":
        return "Supervisor"
      case "worker":
        return "Worker"
      default:
        return role
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex items-center gap-3">
          {role === "worker" && workerName && (
            <span className="text-sm text-muted-foreground">{workerName}</span>
          )}
          <Badge variant={getRoleBadgeVariant()}>{getRoleLabel()}</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}
