// Mock data for HCP-OPS-SYNC
// Updated to support: multi-day jobs, multiple workers per job, customer details, and separated status

// Job status (work progress)
export type JobStatus = "scheduled" | "in_progress" | "done"

// Worker interface
export interface Worker {
  id: string
  name: string
  email: string
  daily_rate: number
}

// Job interface (can span multiple days)
export interface Job {
  id: string
  hcp_id: string
  customer_name: string
  address: string
  start_date: string      // First day of the job (YYYY-MM-DD)
  end_date: string        // Last day of the job (YYYY-MM-DD)
  status: JobStatus
  notes?: string
}

// Day Assignment - assigns a worker to a specific day of a job
export interface DayAssignment {
  id: string
  job_id: string
  day_date: string        // Specific date (YYYY-MM-DD)
  worker_id: string
  multiplier: 1.0 | 0.5
}

export interface PayrollSnapshot {
  worker_id: string
  worker_name: string
  week_start: string
  week_end: string
  unique_days: number
  rate_snapshot: number
  total: number
}

// Mock Workers
export const workers: Worker[] = [
  { id: "w-001", name: "John Smith", email: "john@example.com", daily_rate: 200 },
  { id: "w-002", name: "Sarah Johnson", email: "sarah@example.com", daily_rate: 220 },
  { id: "w-003", name: "Mike Davis", email: "mike@example.com", daily_rate: 180 },
  { id: "w-004", name: "Emily Brown", email: "emily@example.com", daily_rate: 240 },
  { id: "w-005", name: "David Wilson", email: "david@example.com", daily_rate: 200 },
]

// Mock Jobs (some single-day, some multi-day)
export const jobs: Job[] = [
  {
    id: "job-001",
    hcp_id: "hcp-12345",
    customer_name: "Robert Anderson",
    address: "123 Main St, Springfield, IL",
    start_date: "2026-01-20",
    end_date: "2026-01-20",
    status: "done",
    notes: "Kitchen renovation",
  },
  {
    id: "job-002",
    hcp_id: "hcp-12346",
    customer_name: "Maria Garcia",
    address: "456 Oak Ave, Springfield, IL",
    start_date: "2026-01-20",
    end_date: "2026-01-22",  // 3-day job
    status: "in_progress",
    notes: "Full bathroom remodel",
  },
  {
    id: "job-003",
    hcp_id: "hcp-12347",
    customer_name: "James Wilson",
    address: "789 Pine Rd, Decatur, IL",
    start_date: "2026-01-21",
    end_date: "2026-01-21",
    status: "scheduled",
  },
  {
    id: "job-004",
    hcp_id: "hcp-12348",
    customer_name: "Patricia Martinez",
    address: "321 Elm St, Champaign, IL",
    start_date: "2026-01-21",
    end_date: "2026-01-23",  // 3-day job
    status: "scheduled",
    notes: "Deck installation",
  },
  {
    id: "job-005",
    hcp_id: "hcp-12349",
    customer_name: "Michael Thompson",
    address: "654 Maple Dr, Urbana, IL",
    start_date: "2026-01-22",
    end_date: "2026-01-22",
    status: "scheduled",
  },
  {
    id: "job-006",
    hcp_id: "hcp-12350",
    customer_name: "Linda Davis",
    address: "987 Cedar Ln, Bloomington, IL",
    start_date: "2026-01-22",
    end_date: "2026-01-24",  // 3-day job
    status: "scheduled",
    notes: "Roof repair",
  },
  {
    id: "job-007",
    hcp_id: "hcp-12351",
    customer_name: "William Brown",
    address: "147 Birch Way, Normal, IL",
    start_date: "2026-01-23",
    end_date: "2026-01-23",
    status: "scheduled",
  },
  {
    id: "job-008",
    hcp_id: "hcp-12352",
    customer_name: "Elizabeth Taylor",
    address: "258 Walnut Ct, Peoria, IL",
    start_date: "2026-01-24",
    end_date: "2026-01-25",  // 2-day job
    status: "scheduled",
  },
]

// Mock Day Assignments (per-day worker assignments)
export const dayAssignments: DayAssignment[] = [
  // Job 001 - single day, one worker
  { id: "da-001", job_id: "job-001", day_date: "2026-01-20", worker_id: "w-001", multiplier: 1.0 },
  
  // Job 002 - 3 days: Worker X on days 1-2, Worker Y on day 3
  { id: "da-002", job_id: "job-002", day_date: "2026-01-20", worker_id: "w-001", multiplier: 1.0 },
  { id: "da-003", job_id: "job-002", day_date: "2026-01-20", worker_id: "w-003", multiplier: 1.0 }, // 2 workers same day
  { id: "da-004", job_id: "job-002", day_date: "2026-01-21", worker_id: "w-001", multiplier: 1.0 },
  { id: "da-005", job_id: "job-002", day_date: "2026-01-22", worker_id: "w-002", multiplier: 1.0 },
  
  // Job 006 - partially assigned
  { id: "da-006", job_id: "job-006", day_date: "2026-01-22", worker_id: "w-002", multiplier: 1.0 },
  { id: "da-007", job_id: "job-006", day_date: "2026-01-22", worker_id: "w-004", multiplier: 0.5 },
]

// Mock Payroll Snapshots
export const payrollSnapshots: PayrollSnapshot[] = [
  {
    worker_id: "w-001",
    worker_name: "John Smith",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 5,
    rate_snapshot: 200,
    total: 1000.0,
  },
  {
    worker_id: "w-002",
    worker_name: "Sarah Johnson",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 4,
    rate_snapshot: 220,
    total: 880.0,
  },
  {
    worker_id: "w-003",
    worker_name: "Mike Davis",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 5,
    rate_snapshot: 180,
    total: 900.0,
  },
  {
    worker_id: "w-004",
    worker_name: "Emily Brown",
    week_start: "2026-01-13",
    week_end: "2026-01-19",
    unique_days: 3,
    rate_snapshot: 240,
    total: 720.0,
  },
  {
    worker_id: "w-001",
    worker_name: "John Smith",
    week_start: "2026-01-06",
    week_end: "2026-01-12",
    unique_days: 4,
    rate_snapshot: 200,
    total: 800.0,
  },
  {
    worker_id: "w-002",
    worker_name: "Sarah Johnson",
    week_start: "2026-01-06",
    week_end: "2026-01-12",
    unique_days: 5,
    rate_snapshot: 220,
    total: 1100.0,
  },
]

// Helper: Get all dates for a job
export function getJobDates(job: Job): string[] {
  const dates: string[] = []
  const start = new Date(job.start_date)
  const end = new Date(job.end_date)
  
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// Helper: Get job duration in days
export function getJobDuration(job: Job): number {
  return getJobDates(job).length
}

// Helper: Get assignments for a specific job
export function getJobAssignments(jobId: string): DayAssignment[] {
  return dayAssignments.filter(da => da.job_id === jobId)
}

// Helper: Get assignments for a specific job on a specific day
export function getJobDayAssignments(jobId: string, dayDate: string): DayAssignment[] {
  return dayAssignments.filter(da => da.job_id === jobId && da.day_date === dayDate)
}

// Helper: Check if a job has any assignments
export function isJobAssigned(jobId: string): boolean {
  return dayAssignments.some(da => da.job_id === jobId)
}

// Helper: Check if all days of a job are assigned
export function isJobFullyAssigned(job: Job): boolean {
  const dates = getJobDates(job)
  return dates.every(date => 
    dayAssignments.some(da => da.job_id === job.id && da.day_date === date)
  )
}

// Helper: Get assignment status for display
export function getAssignmentStatus(job: Job): "not_assigned" | "partially_assigned" | "fully_assigned" {
  const dates = getJobDates(job)
  const assignedDates = dates.filter(date => 
    dayAssignments.some(da => da.job_id === job.id && da.day_date === date)
  )
  
  if (assignedDates.length === 0) return "not_assigned"
  if (assignedDates.length < dates.length) return "partially_assigned"
  return "fully_assigned"
}

// Helper: Get worker by ID
export function getWorkerById(workerId: string): Worker | undefined {
  return workers.find(w => w.id === workerId)
}

// Helper: Get worker assignments (for worker view)
export function getWorkerAssignments(workerId: string) {
  const workerAssignments = dayAssignments.filter(da => da.worker_id === workerId)
  
  return workerAssignments.map(assignment => {
    const job = jobs.find(j => j.id === assignment.job_id)
    const coworkers = dayAssignments
      .filter(da => da.job_id === assignment.job_id && da.day_date === assignment.day_date && da.worker_id !== workerId)
      .map(da => getWorkerById(da.worker_id))
      .filter(Boolean)
    
    return {
      ...assignment,
      job,
      coworkers,
    }
  })
}

// Helper: Get worker by name (for backwards compatibility with role context)
export function getWorkerByName(name: string): Worker | undefined {
  return workers.find(w => w.name === name)
}

// For backward compatibility with old code
export const availableWorkers = workers.map(w => w.name)
