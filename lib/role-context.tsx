"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type UserRole = "worker" | "supervisor" | "admin"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  workerName: string
}

const RoleContext = createContext<RoleContextType | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("worker")

  // For demo purposes, the logged-in worker is "John Smith"
  const workerName = "John Smith"

  return (
    <RoleContext.Provider value={{ role, setRole, workerName }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
