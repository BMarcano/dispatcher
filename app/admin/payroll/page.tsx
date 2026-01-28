"use client"

import { AppShell } from "@/components/app-shell"
import { AuthGuard } from "@/components/auth-guard"
import { PayrollTable } from "./payroll-table"

export default function AdminPayrollPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AppShell title="Payroll">
        <PayrollTable />
      </AppShell>
    </AuthGuard>
  )
}
