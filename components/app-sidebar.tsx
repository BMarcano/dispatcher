"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  ClipboardList,
  DollarSign,
  LogOut,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRole } from "@/lib/role-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { role } = useRole()

  const workerNav = [
    {
      title: "My Assignments",
      href: "/worker/assignments",
      icon: CalendarDays,
    },
  ]

  const supervisorNav = [
    {
      title: "Pending Queue",
      href: "/supervisor/pending",
      icon: ClipboardList,
    },
  ]

  const adminNav = [
    {
      title: "Payroll",
      href: "/admin/payroll",
      icon: DollarSign,
    },
  ]

  const getNavItems = () => {
    switch (role) {
      case "worker":
        return workerNav
      case "supervisor":
        return supervisorNav
      case "admin":
        return adminNav
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Settings className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">HCP-OPS-SYNC</span>
            <span className="text-xs text-muted-foreground">
              Crew Scheduling
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/login">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
