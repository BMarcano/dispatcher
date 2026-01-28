"use client"

import { AppShell } from "@/components/app-shell"
import { AuthGuard } from "@/components/auth-guard"
import { AssignmentList } from "./assignment-list"

export default function WorkerAssignmentsPage() {
  return (
    <AuthGuard requiredRole="worker">
      <AppShell title="My Assignments">
        <AssignmentList />
      </AppShell>
    </AuthGuard>
  )
}
