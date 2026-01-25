"use client"

import { useState } from "react"
import { 
  CalendarIcon, 
  MapPin, 
  UserPlus, 
  ChevronDown, 
  ChevronUp, 
  User,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  jobs as initialJobs,
  workers,
  dayAssignments as initialAssignments,
  getJobDates,
  getJobDuration,
  getAssignmentStatus,
  getWorkerById,
  Job,
  DayAssignment,
  JobStatus,
} from "@/lib/mock-data"

// Status badge styling
const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ElementType }> = {
  scheduled: { label: "Scheduled", variant: "secondary", icon: Circle },
  in_progress: { label: "In Progress", variant: "default", icon: Clock },
  done: { label: "Done", variant: "outline", icon: CheckCircle2 },
}

// Assignment status styling
const assignmentStatusConfig = {
  not_assigned: { label: "Not Assigned", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  partially_assigned: { label: "Partial", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  fully_assigned: { label: "Assigned", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
}

function formatDateDisplay(dateString: string) {
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function PendingQueue() {
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all")
  const [localJobs, setLocalJobs] = useState<Job[]>(initialJobs)
  const [localAssignments, setLocalAssignments] = useState<DayAssignment[]>(initialAssignments)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  
  // Dialog state
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [selectedMultiplier, setSelectedMultiplier] = useState<string>("1.0")

  // Get current assignment status using local state
  const getLocalAssignmentStatus = (job: Job): "not_assigned" | "partially_assigned" | "fully_assigned" => {
    const dates = getJobDates(job)
    const assignedDates = dates.filter(date => 
      localAssignments.some(da => da.job_id === job.id && da.day_date === date)
    )
    
    if (assignedDates.length === 0) return "not_assigned"
    if (assignedDates.length < dates.length) return "partially_assigned"
    return "fully_assigned"
  }

  // Filter jobs based on selected date and status
  const filteredJobs = localJobs.filter((job) => {
    // Status filter
    if (statusFilter !== "all" && job.status !== statusFilter) return false
    
    // Date filter - show job if any of its days match the filter
    if (dateFilter) {
      const filterDateStr = dateFilter.toISOString().split('T')[0]
      const jobDates = getJobDates(job)
      if (!jobDates.includes(filterDateStr)) return false
    }
    
    return true
  })

  const toggleExpanded = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleOpenAssignDialog = (job: Job) => {
    setSelectedJob(job)
    setSelectedDays([])
    setSelectedWorker("")
    setSelectedMultiplier("1.0")
    setIsAssignDialogOpen(true)
  }

  const handleDayToggle = (date: string) => {
    setSelectedDays(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const confirmAssign = () => {
    if (!selectedJob || !selectedWorker || selectedDays.length === 0) return
    
    const newAssignments: DayAssignment[] = selectedDays.map((date, index) => ({
      id: `da-new-${Date.now()}-${index}`,
      job_id: selectedJob.id,
      day_date: date,
      worker_id: selectedWorker,
      multiplier: parseFloat(selectedMultiplier) as 1.0 | 0.5,
    }))
    
    setLocalAssignments(prev => [...prev, ...newAssignments])
    setIsAssignDialogOpen(false)
  }

  const removeAssignment = (assignmentId: string) => {
    setLocalAssignments(prev => prev.filter(a => a.id !== assignmentId))
  }

  const updateJobStatus = (jobId: string, newStatus: JobStatus) => {
    setLocalJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    )
  }

  const clearFilter = () => {
    setDateFilter(undefined)
    setStatusFilter("all")
  }

  // Get assignments for a job on a specific day (using local state)
  const getDayAssignments = (jobId: string, date: string) => {
    return localAssignments.filter(a => a.job_id === jobId && a.day_date === date)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as JobStatus | "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {(dateFilter || statusFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={clearFilter}>
            Clear filters
          </Button>
        )}
        
        <span className="text-sm text-muted-foreground ml-auto">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Jobs List */}
      <div className="flex flex-col gap-3">
        {filteredJobs.map((job) => {
          const jobDates = getJobDates(job)
          const duration = getJobDuration(job)
          const isExpanded = expandedJobs.has(job.id)
          const assignmentStatus = getLocalAssignmentStatus(job)
          const StatusIcon = statusConfig[job.status].icon

          return (
            <div
              key={job.id}
              className="rounded-lg border bg-card text-card-foreground overflow-hidden"
            >
              {/* Job Header */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Customer Name */}
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-semibold truncate">{job.customer_name}</span>
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="truncate">{job.address}</span>
                    </div>
                    
                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="h-4 w-4 shrink-0" />
                      <span>
                        {duration === 1 
                          ? formatDateDisplay(job.start_date)
                          : `${formatDateDisplay(job.start_date)} → ${formatDateDisplay(job.end_date)} (${duration} days)`
                        }
                      </span>
                    </div>

                    {/* Notes */}
                    {job.notes && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        {job.notes}
                      </p>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Job Status */}
                    <div className="flex items-center gap-1">
                      <Select 
                        value={job.status} 
                        onValueChange={(v) => updateJobStatus(job.id, v as JobStatus)}
                      >
                        <SelectTrigger className="h-7 w-[130px] text-xs">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">
                            <span className="flex items-center gap-1">
                              <Circle className="h-3 w-3" /> Scheduled
                            </span>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> In Progress
                            </span>
                          </SelectItem>
                          <SelectItem value="done">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Done
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assignment Status */}
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", assignmentStatusConfig[assignmentStatus].className)}
                    >
                      {assignmentStatus === "not_assigned" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {assignmentStatus === "fully_assigned" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {assignmentStatus === "partially_assigned" && <Users className="h-3 w-3 mr-1" />}
                      {assignmentStatusConfig[assignmentStatus].label}
                    </Badge>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAssignDialog(job)}
                  >
                    <UserPlus className="mr-1 h-4 w-4" />
                    Assign Workers
                  </Button>
                  
                  {duration > 1 || getDayAssignments(job.id, job.start_date).length > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(job.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="mr-1 h-4 w-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 h-4 w-4" />
                          View Details
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Expanded Day-by-Day View */}
              {isExpanded && (
                <div className="border-t bg-muted/30">
                  {jobDates.map((date) => {
                    const dayAssignments = getDayAssignments(job.id, date)
                    
                    return (
                      <div key={date} className="p-3 border-b last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {formatDateDisplay(date)}
                          </span>
                          {dayAssignments.length === 0 && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                              No workers
                            </Badge>
                          )}
                        </div>
                        
                        {dayAssignments.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {dayAssignments.map((assignment) => {
                              const worker = getWorkerById(assignment.worker_id)
                              return (
                                <div 
                                  key={assignment.id}
                                  className="flex items-center gap-2 bg-background rounded-md px-2 py-1 text-sm border"
                                >
                                  <User className="h-3 w-3 text-muted-foreground" />
                                  <span>{worker?.name || "Unknown"}</span>
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {assignment.multiplier}x
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeAssignment(assignment.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Click &quot;Assign Workers&quot; to add workers for this day
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Jobs Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No jobs match your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Assign Workers Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
            <DialogDescription>
              Select a worker and the days they will work on this job.
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="flex flex-col gap-4 py-2">
              {/* Job Info */}
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-semibold">{selectedJob.customer_name}</p>
                <p className="text-muted-foreground">{selectedJob.address}</p>
                <p className="text-muted-foreground mt-1">
                  {getJobDuration(selectedJob)} day{getJobDuration(selectedJob) > 1 ? "s" : ""}: {" "}
                  {formatDateDisplay(selectedJob.start_date)}
                  {selectedJob.start_date !== selectedJob.end_date && (
                    <> → {formatDateDisplay(selectedJob.end_date)}</>
                  )}
                </p>
              </div>

              {/* Worker Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="worker">Worker</Label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger id="worker">
                    <SelectValue placeholder="Select a worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day Selection */}
              <div className="flex flex-col gap-2">
                <Label>Days to Assign</Label>
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                  {getJobDates(selectedJob).map((date) => {
                    const existingAssignments = getDayAssignments(selectedJob.id, date)
                    const alreadyAssigned = selectedWorker && existingAssignments.some(a => a.worker_id === selectedWorker)
                    
                    return (
                      <div 
                        key={date} 
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md border",
                          alreadyAssigned && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`day-${date}`}
                            checked={selectedDays.includes(date)}
                            onCheckedChange={() => handleDayToggle(date)}
                            disabled={alreadyAssigned}
                          />
                          <label 
                            htmlFor={`day-${date}`}
                            className="text-sm cursor-pointer"
                          >
                            {formatDateDisplay(date)}
                          </label>
                        </div>
                        {existingAssignments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {existingAssignments.length} assigned
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Multiplier Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="multiplier">Pay Multiplier</Label>
                <Select value={selectedMultiplier} onValueChange={setSelectedMultiplier}>
                  <SelectTrigger id="multiplier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0x (Full Day)</SelectItem>
                    <SelectItem value="0.5">0.5x (Half Day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAssign} 
              disabled={!selectedWorker || selectedDays.length === 0}
            >
              Assign to {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
