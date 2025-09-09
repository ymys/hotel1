import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, AdminUser } from '../lib/supabase'

interface AdminAuthContextType {
  user: AdminUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    
    const initializeAuth = async () => {
      try {
        // Set a shorter timeout for individual operations
        const sessionPromise = supabase.auth.getSession()
        const sessionTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        )
        
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          sessionTimeout
        ]) as any
        
        if (!isMounted) return
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setIsLoading(false)
          return
        }
        
        if (session?.user) {
          // Query admin_users table with timeout
          const adminPromise = supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .single()
            
          const adminTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Admin query timeout')), 5000)
          )
          
          try {
            const { data: adminData, error: adminError } = await Promise.race([
              adminPromise,
              adminTimeout
            ]) as any
            
            if (!isMounted) return
            
            if (!adminError && adminData) {
              setUser({
                id: adminData.id,
                email: adminData.email,
                name: adminData.name,
                role: adminData.role,
                permissions: adminData.permissions || [],
                branch_id: adminData.branch_id,
                created_at: adminData.created_at,
                updated_at: adminData.updated_at
              })
            } else {
              // If admin user not found, sign out the session
              console.warn('Admin user not found for email:', session.user.email)
              try {
                await supabase.auth.signOut()
              } catch (signOutError) {
                console.error('Sign out error:', signOutError)
              }
              setUser(null)
            }
          } catch (queryError) {
            console.error('Admin query error:', queryError)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    // Add timeout to prevent infinite loading - reduced to 8 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Admin auth initialization timeout')
        setIsLoading(false)
        setUser(null)
      }
    }, 8000)
    
    initializeAuth().finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        setIsLoading(false)
      }
    })
    
    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) {
        throw new Error(authError.message)
      }
      
      if (!authData.user) {
        throw new Error('Authentication failed')
      }
      
      // Query admin_users table to get admin details
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (adminError) {
        // Sign out the user if they're not an admin
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin account required.')
      }
      
      if (!adminData) {
        await supabase.auth.signOut()
        throw new Error('Admin account not found')
      }
      
      // Set the admin user with data from admin_users table
      setUser({
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        permissions: adminData.permissions || [],
        branch_id: adminData.branch_id,
        created_at: adminData.created_at,
        updated_at: adminData.updated_at
      })
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if signOut fails
      setUser(null)
      setError(null)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    // Simplified permission check - admin role has all permissions
    return user.role === 'super_admin'
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
    clearError,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}