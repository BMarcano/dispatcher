import { supabase } from './client'
import type { Worker, Job, DayAssignment, PayrollSnapshot, JobStatus } from './types'

// Workers
export async function getWorkers(): Promise<Worker[]> {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching workers:', error)
    throw error
  }

  return data || []
}

export async function getWorkerById(workerId: string): Promise<Worker | null> {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', workerId)
    .single()

  if (error) {
    console.error('Error fetching worker:', error)
    return null
  }

  return data
}

export async function getWorkerByName(name: string): Promise<Worker | null> {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    console.error('Error fetching worker by name:', error)
    return null
  }

  return data
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }

  return data || []
}

export async function getJobById(jobId: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    console.error('Error fetching job:', error)
    return null
  }

  return data
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single()

  if (error) {
    console.error('Error creating job:', error)
    throw error
  }

  return data
}

export async function updateJobStatus(jobId: string, status: JobStatus): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', jobId)
    .select()
    .single()

  if (error) {
    console.error('Error updating job status:', error)
    throw error
  }

  return data
}

// Day Assignments
export async function getDayAssignments(): Promise<DayAssignment[]> {
  const { data, error } = await supabase
    .from('day_assignments')
    .select('*')
    .order('day_date', { ascending: true })

  if (error) {
    console.error('Error fetching day assignments:', error)
    throw error
  }

  return data || []
}

export async function getJobAssignments(jobId: string): Promise<DayAssignment[]> {
  const { data, error } = await supabase
    .from('day_assignments')
    .select('*')
    .eq('job_id', jobId)
    .order('day_date', { ascending: true })

  if (error) {
    console.error('Error fetching job assignments:', error)
    throw error
  }

  return data || []
}

export async function getJobDayAssignments(jobId: string, dayDate: string): Promise<DayAssignment[]> {
  const { data, error } = await supabase
    .from('day_assignments')
    .select('*')
    .eq('job_id', jobId)
    .eq('day_date', dayDate)

  if (error) {
    console.error('Error fetching day assignments:', error)
    throw error
  }

  return data || []
}

export async function getWorkerAssignments(workerId: string): Promise<(DayAssignment & { job: Job | null; coworkers: Worker[] })[]> {
  // Get all assignments for this worker
  const { data: assignments, error: assignmentsError } = await supabase
    .from('day_assignments')
    .select('*')
    .eq('worker_id', workerId)
    .order('day_date', { ascending: true })

  if (assignmentsError) {
    console.error('Error fetching worker assignments:', assignmentsError)
    throw assignmentsError
  }

  if (!assignments || assignments.length === 0) {
    return []
  }

  // Fetch jobs for these assignments
  const jobIds = [...new Set(assignments.map(a => a.job_id))]
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds)

  if (jobsError) {
    console.error('Error fetching jobs:', jobsError)
    throw jobsError
  }

  // Fetch coworkers for each assignment
  const result = await Promise.all(
    assignments.map(async (assignment) => {
      const job = jobs?.find(j => j.id === assignment.job_id) || null

      // Get coworkers (other workers assigned to the same job on the same day)
      const { data: coworkerAssignments } = await supabase
        .from('day_assignments')
        .select('worker_id')
        .eq('job_id', assignment.job_id)
        .eq('day_date', assignment.day_date)
        .neq('worker_id', workerId)

      const coworkerIds = coworkerAssignments?.map(a => a.worker_id) || []
      const coworkers: Worker[] = []

      if (coworkerIds.length > 0) {
        const { data: coworkerData } = await supabase
          .from('workers')
          .select('*')
          .in('id', coworkerIds)

        if (coworkerData) {
          coworkers.push(...coworkerData)
        }
      }

      return {
        ...assignment,
        job,
        coworkers,
      }
    })
  )

  return result
}

export async function createDayAssignment(
  assignment: Omit<DayAssignment, 'id' | 'created_at' | 'updated_at'>
): Promise<DayAssignment> {
  const { data, error } = await supabase
    .from('day_assignments')
    .insert(assignment)
    .select()
    .single()

  if (error) {
    console.error('Error creating day assignment:', error)
    throw error
  }

  return data
}

export async function createDayAssignments(
  assignments: Omit<DayAssignment, 'id' | 'created_at' | 'updated_at'>[]
): Promise<DayAssignment[]> {
  const { data, error } = await supabase
    .from('day_assignments')
    .insert(assignments)
    .select()

  if (error) {
    console.error('Error creating day assignments:', error)
    throw error
  }

  return data || []
}

export async function deleteDayAssignment(assignmentId: string): Promise<void> {
  const { error } = await supabase
    .from('day_assignments')
    .delete()
    .eq('id', assignmentId)

  if (error) {
    console.error('Error deleting day assignment:', error)
    throw error
  }
}

// Payroll Snapshots
export async function getPayrollSnapshots(): Promise<PayrollSnapshot[]> {
  const { data, error } = await supabase
    .from('payroll_snapshots')
    .select('*')
    .order('week_start', { ascending: false })
    .order('worker_name', { ascending: true })

  if (error) {
    console.error('Error fetching payroll snapshots:', error)
    throw error
  }

  return data || []
}

// Helper functions (matching the mock-data.ts helpers)
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

export function getJobDuration(job: Job): number {
  return getJobDates(job).length
}

export async function isJobAssigned(jobId: string): Promise<boolean> {
  const assignments = await getJobAssignments(jobId)
  return assignments.length > 0
}

export async function isJobFullyAssigned(job: Job): Promise<boolean> {
  const dates = getJobDates(job)
  const assignments = await getJobAssignments(job.id)
  const assignedDates = new Set(assignments.map(a => a.day_date))
  return dates.every(date => assignedDates.has(date))
}

export async function getAssignmentStatus(
  job: Job
): Promise<"not_assigned" | "partially_assigned" | "fully_assigned"> {
  const dates = getJobDates(job)
  const assignments = await getJobAssignments(job.id)
  const assignedDates = new Set(assignments.map(a => a.day_date))

  if (assignedDates.size === 0) return "not_assigned"
  if (assignedDates.size < dates.length) return "partially_assigned"
  return "fully_assigned"
}
