"use client"

import { AppShell } from "@/components/app-shell"
import { PendingQueue } from "./pending-queue"

export default function SupervisorPendingPage() {
  return (
    <AppShell title="Pending Queue">
      <PendingQueue />
    </AppShell>
  )
}
