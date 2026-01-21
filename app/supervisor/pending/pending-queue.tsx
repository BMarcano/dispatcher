"use client"

import { useState } from "react"
import { CalendarIcon, MapPin, Clock, UserPlus, UserMinus } from "lucide-react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  appointments,
  availableWorkers,
  Appointment,
} from "@/lib/mock-data"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
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

export function PendingQueue() {
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [localAppointments, setLocalAppointments] = useState(appointments)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [selectedMultiplier, setSelectedMultiplier] = useState<string>("1.0")
  const [dialogMode, setDialogMode] = useState<"assign" | "unassign">("assign")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter appointments based on selected date
  const filteredAppointments = localAppointments.filter((apt) => {
    if (!dateFilter) return true
    const aptDate = new Date(apt.start_time)
    return (
      aptDate.getFullYear() === dateFilter.getFullYear() &&
      aptDate.getMonth() === dateFilter.getMonth() &&
      aptDate.getDate() === dateFilter.getDate()
    )
  })

  const handleAssign = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogMode("assign")
    setSelectedWorker("")
    setSelectedMultiplier("1.0")
    setIsDialogOpen(true)
  }

  const handleUnassign = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogMode("unassign")
    setIsDialogOpen(true)
  }

  const confirmAssign = () => {
    if (!selectedAppointment || !selectedWorker) return
    setLocalAppointments((prev) =>
      prev.map((apt) =>
        apt.id === selectedAppointment.id ? { ...apt, status: "assigned" as const } : apt
      )
    )
    setIsDialogOpen(false)
  }

  const confirmUnassign = () => {
    if (!selectedAppointment) return
    setLocalAppointments((prev) =>
      prev.map((apt) =>
        apt.id === selectedAppointment.id ? { ...apt, status: "pending" as const } : apt
      )
    )
    setIsDialogOpen(false)
  }

  const clearFilter = () => {
    setDateFilter(undefined)
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
        {dateFilter && (
          <Button variant="ghost" size="sm" onClick={clearFilter}>
            Clear filter
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          {filteredAppointments.length} appointment
          {filteredAppointments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell className="font-medium">
                  {formatDate(apt.start_time)}
                </TableCell>
                <TableCell>
                  {formatTimeRange(apt.start_time, apt.end_time)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {apt.address}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={apt.status === "pending" ? "secondary" : "default"}
                  >
                    {apt.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {apt.status === "pending" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssign(apt)}
                    >
                      <UserPlus className="mr-1 h-4 w-4" />
                      Assign
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnassign(apt)}
                    >
                      <UserMinus className="mr-1 h-4 w-4" />
                      Unassign
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="rounded-lg border bg-card p-4 text-card-foreground"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDate(apt.start_time)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeRange(apt.start_time, apt.end_time)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                  <span>{apt.address}</span>
                </div>
              </div>
              <Badge
                variant={apt.status === "pending" ? "secondary" : "default"}
              >
                {apt.status}
              </Badge>
            </div>
            <div className="mt-3 pt-3 border-t">
              {apt.status === "pending" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleAssign(apt)}
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  Assign Worker
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleUnassign(apt)}
                >
                  <UserMinus className="mr-1 h-4 w-4" />
                  Unassign Worker
                </Button>
              )}
            </div>
          </div>
        ))}
        {filteredAppointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Appointments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No appointments match your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Assign/Unassign Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "assign" ? "Assign Worker" : "Unassign Worker"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "assign"
                ? "Select a worker and multiplier for this appointment."
                : "Are you sure you want to unassign the worker from this appointment?"}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="flex flex-col gap-4 py-2">
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">
                  {formatDate(selectedAppointment.start_time)}
                </p>
                <p className="text-muted-foreground">
                  {formatTimeRange(
                    selectedAppointment.start_time,
                    selectedAppointment.end_time
                  )}
                </p>
                <p className="mt-1">{selectedAppointment.address}</p>
              </div>
              {dialogMode === "assign" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="worker">Worker</Label>
                    <Select
                      value={selectedWorker}
                      onValueChange={setSelectedWorker}
                    >
                      <SelectTrigger id="worker">
                        <SelectValue placeholder="Select a worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkers.map((worker) => (
                          <SelectItem key={worker} value={worker}>
                            {worker}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="multiplier">Multiplier</Label>
                    <Select
                      value={selectedMultiplier}
                      onValueChange={setSelectedMultiplier}
                    >
                      <SelectTrigger id="multiplier">
                        <SelectValue placeholder="Select multiplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0">1.0x (Full)</SelectItem>
                        <SelectItem value="0.5">0.5x (Half)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {dialogMode === "assign" ? (
              <Button onClick={confirmAssign} disabled={!selectedWorker}>
                Assign
              </Button>
            ) : (
              <Button variant="destructive" onClick={confirmUnassign}>
                Unassign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
