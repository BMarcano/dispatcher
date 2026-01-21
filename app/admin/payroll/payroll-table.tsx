"use client"

import { Download, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { payrollSnapshots } from "@/lib/mock-data"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export function PayrollTable() {
  const handleDownloadCSV = () => {
    // Mock CSV download behavior
    const headers = [
      "Worker Name",
      "Week Range",
      "Days Counted",
      "Rate Snapshot",
      "Total",
    ]
    const rows = payrollSnapshots.map((p) => [
      p.worker_name,
      `${p.week_start} to ${p.week_end}`,
      p.unique_days.toString(),
      p.rate_snapshot.toFixed(2),
      p.total.toFixed(2),
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    )

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "payroll_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate totals
  const totalPayroll = payrollSnapshots.reduce((sum, p) => sum + p.total, 0)
  const uniqueWorkers = new Set(payrollSnapshots.map((p) => p.worker_name)).size

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-muted-foreground">
              Across all snapshots
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workers</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueWorkers}</div>
            <p className="text-xs text-muted-foreground">
              Unique workers with payroll
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSnapshots.length}</div>
            <p className="text-xs text-muted-foreground">
              Total payroll snapshots
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Weekly Totals</h2>
        <Button variant="outline" onClick={handleDownloadCSV}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker Name</TableHead>
              <TableHead>Week Range</TableHead>
              <TableHead className="text-center">Days Counted</TableHead>
              <TableHead className="text-right">Rate Snapshot</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollSnapshots.map((snapshot, index) => (
              <TableRow key={`${snapshot.worker_name}-${snapshot.week_start}-${index}`}>
                <TableCell className="font-medium">
                  {snapshot.worker_name}
                </TableCell>
                <TableCell>
                  {formatDateRange(snapshot.week_start, snapshot.week_end)}
                </TableCell>
                <TableCell className="text-center">
                  {snapshot.unique_days}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(snapshot.rate_snapshot)}/hr
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  {formatCurrency(snapshot.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 md:hidden">
        {payrollSnapshots.map((snapshot, index) => (
          <Card key={`${snapshot.worker_name}-${snapshot.week_start}-${index}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{snapshot.worker_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(snapshot.week_start, snapshot.week_end)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">
                    {formatCurrency(snapshot.total)}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Days</p>
                  <p className="font-medium">{snapshot.unique_days}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rate</p>
                  <p className="font-mono">{formatCurrency(snapshot.rate_snapshot)}/hr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
