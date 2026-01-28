"use client"

import { useEffect, useState } from 'react'
import type { Worker, Job, DayAssignment, PayrollSnapshot } from './types'
import * as queries from './queries'

// Hook for fetching workers
export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchWorkers() {
      try {
        setLoading(true)
        const data = await queries.getWorkers()
        setWorkers(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch workers'))
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

  return { workers, loading, error }
}

// Hook for fetching jobs
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        const data = await queries.getJobs()
        setJobs(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch jobs'))
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const refreshJobs = async () => {
    try {
      const data = await queries.getJobs()
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh jobs'))
    }
  }

  return { jobs, loading, error, refreshJobs, setJobs }
}

// Hook for fetching day assignments
export function useDayAssignments() {
  const [assignments, setAssignments] = useState<DayAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchAssignments() {
      try {
        setLoading(true)
        const data = await queries.getDayAssignments()
        setAssignments(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch assignments'))
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const refreshAssignments = async () => {
    try {
      const data = await queries.getDayAssignments()
      setAssignments(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh assignments'))
    }
  }

  return { assignments, loading, error, refreshAssignments, setAssignments }
}

// Hook for fetching worker assignments
export function useWorkerAssignments(workerId: string | null) {
  const [assignments, setAssignments] = useState<(DayAssignment & { job: Job | null; coworkers: Worker[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!workerId) {
      setAssignments([])
      setLoading(false)
      return
    }

    async function fetchAssignments() {
      try {
        setLoading(true)
        const data = await queries.getWorkerAssignments(workerId)
        setAssignments(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch worker assignments'))
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [workerId])

  return { assignments, loading, error }
}

// Hook for fetching payroll snapshots
export function usePayrollSnapshots() {
  const [snapshots, setSnapshots] = useState<PayrollSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSnapshots() {
      try {
        setLoading(true)
        const data = await queries.getPayrollSnapshots()
        setSnapshots(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch payroll snapshots'))
      } finally {
        setLoading(false)
      }
    }

    fetchSnapshots()
  }, [])

  return { snapshots, loading, error }
}
