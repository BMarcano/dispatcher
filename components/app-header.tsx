"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRole } from "@/lib/role-context"

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { role, workerName } = useRole()

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
          {role === "worker" && (
            <span className="text-sm text-muted-foreground">{workerName}</span>
          )}
          <Badge variant={getRoleBadgeVariant()}>{getRoleLabel()}</Badge>
        </div>
      </div>
    </header>
  )
}
