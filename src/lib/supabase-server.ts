import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy initialization for Edge Runtime compatibility
let _supabaseServer: SupabaseClient | null = null

export function getSupabaseServer(): SupabaseClient {
  if (!_supabaseServer) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    _supabaseServer = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabaseServer
}
