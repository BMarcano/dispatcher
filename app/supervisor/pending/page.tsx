"use client"

import { AppShell } from "@/components/app-shell"
import { AuthGuard } from "@/components/auth-guard"
import { PendingQueue } from "./pending-queue"

export default function SupervisorPendingPage() {
  return (
    <AuthGuard requiredRole="supervisor">
      <AppShell title="Job Management">
        <PendingQueue />
      </AppShell>
    </AuthGuard>
  )
}
