import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // During build time or when not configured, return null
      return null as unknown as ReturnType<typeof createClient>
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Backward compatibility: export supabase as getter
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabase()
    if (!client) {
      return () => Promise.resolve({ data: null, error: null })
    }
    return (client as unknown as Record<string, () => Promise<unknown>>)[prop as string]
  }
})

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url !== 'your_supabase_project_url')
}

// Type definitions for our database tables
export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'pro' | 'team'
  quota_used: number
  quota_limit: number
  created_at: string
  updated_at: string
}

export type Regulation = {
  id: string
  country: 'BR' | 'MX' | 'AR' | 'CL' | 'CO'
  category: 'ingredient' | 'label' | 'claim' | 'packaging'
  rule_type: 'prohibited' | 'restricted' | 'required' | 'allowed'
  keyword: string
  severity: 'critical' | 'warning' | 'info'
  suggestion?: string
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  user_id: string
  name: string
  ingredients?: string
  description?: string
  country_target: 'BR' | 'MX' | 'AR' | 'CL' | 'CO'
  created_at: string
  updated_at: string
}

export type Check = {
  id: string
  product_id: string
  results_json: Record<string, unknown>
  regulation_version: number
  is_compliant?: boolean
  issues_count: number
  created_at: string
}

export type Listing = {
  id: string
  product_id: string
  language: 'pt-br' | 'es-mx' | 'es-co' | 'es-ar' | 'es-cl' | 'en'
  generated_content: Record<string, unknown>
  created_at: string
}
