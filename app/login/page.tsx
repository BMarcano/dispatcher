"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRole, UserRole } from "@/lib/role-context"

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useRole()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("worker")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRole(selectedRole)
    
    // Navigate to the appropriate dashboard based on role
    switch (selectedRole) {
      case "worker":
        router.push("/worker/assignments")
        break
      case "supervisor":
        router.push("/supervisor/pending")
        break
      case "admin":
        router.push("/admin/payroll")
        break
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">HCP-OPS-SYNC</CardTitle>
          <CardDescription>
            Sign in to access crew scheduling and payroll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role (Demo Only)</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: UserRole) => setSelectedRole(value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a role to preview different dashboards
              </p>
            </div>
            <Button type="submit" className="mt-2 w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
