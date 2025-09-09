import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dnqhcmynxirwlqmdjwev.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucWhjbXlueGlyd2xxbWRqd2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDYwMDAsImV4cCI6MjA3MjM4MjAwMH0.rZiXqZnt5RYu305wbe69WCR7IH2pf43Jg9y7UW9ExWo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for admin users
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'corporate_admin' | 'regional_manager' | 'branch_manager'
  permissions: string[]
  branch_id?: string
  created_at: string
  updated_at: string
}

// Types for regular users
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

// Role permissions mapping
export const rolePermissions = {
  super_admin: [
    'analytics.view',
    'branches.manage',
    'rooms.manage',
    'bookings.manage',
    'users.view',
    'users.manage',
    'admins.manage',
    'reviews.moderate',
    'system.configure',
    'all'
  ],
  corporate_admin: [
    'analytics.view',
    'branches.manage',
    'rooms.manage',
    'bookings.manage',
    'users.view',
    'users.manage',
    'admins.manage',
    'reviews.moderate',
    'system.configure'
  ],
  regional_manager: [
    'analytics.view',
    'branches.view',
    'branches.manage_assigned',
    'rooms.manage',
    'bookings.manage',
    'users.view',
    'reviews.moderate'
  ],
  branch_manager: [
    'analytics.view_branch',
    'branches.view_own',
    'rooms.manage_own',
    'bookings.manage_own',
    'users.view',
    'reviews.moderate_own'
  ]
}

// User role types
export type UserRole = 'guest' | 'registered' | 'branch_manager' | 'regional_manager' | 'corporate_admin'