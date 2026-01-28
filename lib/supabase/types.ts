// Database types matching the Supabase schema
// These types are generated from your Supabase schema

export type JobStatus = "scheduled" | "in_progress" | "done"

export interface Worker {
  id: string
  name: string
  email: string
  daily_rate: number
  created_at?: string
  updated_at?: string
}

export interface Job {
  id: string
  hcp_id: string
  customer_name: string
  address: string
  start_date: string
  end_date: string
  status: JobStatus
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface DayAssignment {
  id: string
  job_id: string
  day_date: string
  worker_id: string
  multiplier: 0.5 | 1.0
  created_at?: string
  updated_at?: string
}

export interface PayrollSnapshot {
  id: string
  worker_id: string
  worker_name: string
  week_start: string
  week_end: string
  unique_days: number
  rate_snapshot: number
  total: number
  created_at?: string
}

export interface UserProfile {
  id: string
  email: string
  role: "worker" | "supervisor" | "admin"
  worker_id?: string | null
  created_at?: string
  updated_at?: string
}
