"use client"

import { MapPin, Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/lib/role-context"
import { getWorkerAssignments } from "@/lib/mock-data"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function formatTimeRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  return `${formatTime(startDate)} - ${formatTime(endDate)}`
}

export function AssignmentList() {
  const { workerName } = useRole()
  const assignments = getWorkerAssignments(workerName)

  if (assignments.length === 0) {
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

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Showing {assignments.length} assignment
        {assignments.length !== 1 ? "s" : ""}
      </p>
      {assignments.map((assignment) => (
        <Card key={assignment?.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{formatDate(assignment?.start_time || "")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    {formatTimeRange(
                      assignment?.start_time || "",
                      assignment?.end_time || ""
                    )}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                  <span>{assignment?.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <Badge
                  variant={
                    assignment?.status === "assigned" ? "default" : "secondary"
                  }
                >
                  {assignment?.status === "assigned" ? "Confirmed" : "Pending"}
                </Badge>
                <Badge
                  variant={
                    assignment?.multiplier === 1.0 ? "outline" : "secondary"
                  }
                  className="font-mono"
                >
                  {assignment?.multiplier}x
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
