import { createClient } from '@supabase/supabase-js'

// These will be set via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error(
      '❌ Supabase environment variables are not set!\n' +
      'Please check:\n' +
      '1. File .env.local exists in the project root (with a dot at the start)\n' +
      '2. Variables are named: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      '3. Server was restarted after creating/editing .env.local\n' +
      '\n' +
      'Current values:\n' +
      `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}\n` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`
    )
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
