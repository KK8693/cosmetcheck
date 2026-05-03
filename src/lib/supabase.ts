import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url')
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