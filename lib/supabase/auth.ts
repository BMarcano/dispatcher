"use client"

import { supabase } from './client'
import type { UserProfile } from './types'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

// Get current user and profile
export async function getCurrentUser(): Promise<AuthUser> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { user: null, profile: null, loading: false }
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching user profile:', profileError)
    return { user, profile: null, loading: false }
  }

  return { user, profile, loading: false }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

// Sign up (for creating new users)
export async function signUp(email: string, password: string, role: 'worker' | 'supervisor' | 'admin' = 'worker', workerId?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  if (data.user) {
    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        role,
        worker_id: workerId || null,
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      throw profileError
    }
  }

  return data
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null)
  })
}
