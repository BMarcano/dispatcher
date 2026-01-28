"use client"

import { createContext, useContext, ReactNode, useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/use-auth"
import { getWorkerById } from "@/lib/supabase/queries"
import type { Worker } from "@/lib/supabase/types"

export type UserRole = "worker" | "supervisor" | "admin"

interface RoleContextType {
  role: UserRole | null
  workerName: string
  worker: Worker | null
  isAuthenticated: boolean
  loading: boolean
}

const RoleContext = createContext<RoleContextType | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user, profile, loading: authLoading, isAuthenticated } = useAuth()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loadingWorker, setLoadingWorker] = useState(false)

  // Load worker data if user has a worker_id
  useEffect(() => {
    if (profile?.worker_id && !worker) {
      setLoadingWorker(true)
      getWorkerById(profile.worker_id)
        .then((w) => {
          setWorker(w)
        })
        .catch((err) => {
          console.error('Error loading worker:', err)
        })
        .finally(() => {
          setLoadingWorker(false)
        })
    } else if (!profile?.worker_id) {
      setWorker(null)
    }
  }, [profile?.worker_id, worker])

  const role = profile?.role || null
  const workerName = worker?.name || ""

  const value: RoleContextType = {
    role,
    workerName,
    worker,
    isAuthenticated,
    loading: authLoading || loadingWorker,
  }

  return (
    <RoleContext.Provider value={value}>
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
