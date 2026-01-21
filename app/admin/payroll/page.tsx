"use client"

import { AppShell } from "@/components/app-shell"
import { PayrollTable } from "./payroll-table"

export default function AdminPayrollPage() {
  return (
    <AppShell title="Payroll">
      <PayrollTable />
    </AppShell>
  )
}
