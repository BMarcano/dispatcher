"use client"

import { AppShell } from "@/components/app-shell"
import { AssignmentList } from "./assignment-list"

export default function WorkerAssignmentsPage() {
  return (
    <AppShell title="My Assignments">
      <AssignmentList />
    </AppShell>
  )
}
