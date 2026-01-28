"use client"

import { MapPin, Clock, Calendar, User, Users, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/lib/role-context"
import { useWorkerAssignments } from "@/lib/supabase/hooks"
import type { JobStatus } from "@/lib/supabase/types"

function formatDate(dateString: string) {
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  scheduled: { label: "Scheduled", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  done: { label: "Done", variant: "outline" },
}

export function AssignmentList() {
  const { worker } = useRole()
  const { assignments, loading, error } = useWorkerAssignments(worker?.id || null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Error</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    )
  }

  // Sort assignments by date
  const sortedAssignments = [...assignments].sort((a, b) => 
    new Date(a.day_date).getTime() - new Date(b.day_date).getTime()
  )

  if (sortedAssignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Assignments</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t have any assignments scheduled at this time.
        </p>
      </div>
    )
  }

  // Group assignments by date for better organization
  const groupedByDate = sortedAssignments.reduce((acc, assignment) => {
    const date = assignment.day_date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(assignment)
    return acc
  }, {} as Record<string, typeof sortedAssignments>)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Showing {sortedAssignments.length} assignment{sortedAssignments.length !== 1 ? "s" : ""}
      </p>
      
      {Object.entries(groupedByDate).map(([date, dayAssignments]) => (
        <div key={date} className="flex flex-col gap-3">
          {/* Date Header */}
          <div className="flex items-center gap-2 pb-2 border-b">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold">{formatDate(date)}</span>
            <Badge variant="outline" className="ml-auto">
              {dayAssignments.length} job{dayAssignments.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Jobs for this date */}
          {dayAssignments.map((assignment) => {
            const job = assignment.job
            if (!job) return null

            const jobStatus = statusConfig[job.status]
            const coworkers = assignment.coworkers || []

            return (
              <Card key={assignment.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    {/* Customer Name - Primary Info */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-semibold">{job.customer_name}</span>
                      </div>
                      <Badge variant={jobStatus.variant}>
                        {job.status === "done" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {job.status === "scheduled" && <Circle className="h-3 w-3 mr-1" />}
                        {job.status === "in_progress" && <Clock className="h-3 w-3 mr-1" />}
                        {jobStatus.label}
                      </Badge>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{job.address}</span>
                    </div>

                    {/* Notes if any */}
                    {job.notes && (
                      <p className="text-sm text-muted-foreground italic mb-2">
                        {job.notes}
                      </p>
                    )}

                    {/* Coworkers */}
                    {coworkers.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">Working with:</span>
                        <div className="flex flex-wrap gap-1">
                          {coworkers.map((coworker) => (
                            <Badge key={coworker?.id} variant="secondary" className="text-xs">
                              {coworker?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pay Info */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-sm text-muted-foreground">Pay multiplier</span>
                      <Badge
                        variant={assignment.multiplier === 1.0 ? "default" : "secondary"}
                        className="font-mono"
                      >
                        {assignment.multiplier}x {assignment.multiplier === 1.0 ? "(Full Day)" : "(Half Day)"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ))}
    </div>
  )
}
