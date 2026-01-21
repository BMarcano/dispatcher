// Mock data for HCP-OPS-SYNC

export type AppointmentStatus = "pending" | "assigned"

export interface Appointment {
  id: string
  start_time: string
  end_time: string
  address: string
  status: AppointmentStatus
}

export interface Assignment {
  appointment_id: string
  worker_name: string
  multiplier: 1.0 | 0.5
}

export interface PayrollSnapshot {
  worker_name: string
  week_start: string
  week_end: string
  unique_days: number
  rate_snapshot: number
  total: number
}

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: "apt-001",
    start_time: "2026-01-20T08:00:00",
    end_time: "2026-01-20T12:00:00",
    address: "123 Main St, Springfield, IL",
    status: "assigned",
  },
  {
    id: "apt-002",
    start_time: "2026-01-20T13:00:00",
    end_time: "2026-01-20T17:00:00",
    address: "456 Oak Ave, Springfield, IL",
    status: "assigned",
  },
  {
    id: "apt-003",
    start_time: "2026-01-21T09:00:00",
    end_time: "2026-01-21T14:00:00",
    address: "789 Pine Rd, Decatur, IL",
    status: "pending",
  },
  {
    id: "apt-004",
    start_time: "2026-01-21T15:00:00",
    end_time: "2026-01-21T18:00:00",
    address: "321 Elm St, Champaign, IL",
    status: "pending",
  },
  {
    id: "apt-005",
    start_time: "2026-01-22T08:00:00",
    end_time: "2026-01-22T12:00:00",
    address: "654 Maple Dr, Urbana, IL",
    status: "pending",
  },
  {
    id: "apt-006",
    start_time: "2026-01-22T14:00:00",
    end_time: "2026-01-22T18:00:00",
    address: "987 Cedar Ln, Bloomington, IL",
    status: "assigned",
  },
  {
    id: "apt-007",
    start_time: "2026-01-23T10:00:00",
    end_time: "2026-01-23T15:00:00",
    address: "147 Birch Way, Normal, IL",
    status: "pending",
  },
  {
    id: "apt-008",
    start_time: "2026-01-24T08:00:00",
    end_time: "2026-01-24T12:00:00",
    address: "258 Walnut Ct, Peoria, IL",
    status: "pending",
  },
]

// Mock Assignments
export const assignments: Assignment[] = [
  { appointment_id: "apt-001", worker_name: "John Smith", multiplier: 1.0 },
  { appointment_id: "apt-002", worker_name: "John Smith", multiplier: 0.5 },
  { appointment_id: "apt-006", worker_name: "Sarah Johnson", multiplier: 1.0 },
]

// Mock Payroll Snapshots
export const payrollSnapshots: PayrollSnapshot[] = [
  {
    worker_name: "John Smith",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 5,
    rate_snapshot: 25.0,
    total: 1000.0,
  },
  {
    worker_name: "Sarah Johnson",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 4,
    rate_snapshot: 28.0,
    total: 896.0,
  },
  {
    worker_name: "Mike Davis",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 5,
    rate_snapshot: 22.0,
    total: 880.0,
  },
  {
    worker_name: "Emily Brown",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 3,
    rate_snapshot: 30.0,
    total: 720.0,
  },
  {
    worker_name: "John Smith",
    week_start: "2026-01-06",
    week_end: "2026-01-12",
    unique_days: 4,
    rate_snapshot: 25.0,
    total: 800.0,
  },
  {
    worker_name: "Sarah Johnson",
    week_start: "2026-01-06",
    week_end: "2026-01-12",
    unique_days: 5,
    rate_snapshot: 28.0,
    total: 1120.0,
  },
]

// Available workers for assignment
export const availableWorkers = [
  "John Smith",
  "Sarah Johnson",
  "Mike Davis",
  "Emily Brown",
  "David Wilson",
]

// Helper to get assigned appointments for a worker
export function getWorkerAssignments(workerName: string) {
  const workerAssignments = assignments.filter(
    (a) => a.worker_name === workerName
  )
  return workerAssignments.map((assignment) => {
    const appointment = appointments.find(
      (apt) => apt.id === assignment.appointment_id
    )
    return {
      ...appointment,
      multiplier: assignment.multiplier,
    }
  })
}

// Helper to get pending appointments
export function getPendingAppointments() {
  return appointments.filter((apt) => apt.status === "pending")
}
