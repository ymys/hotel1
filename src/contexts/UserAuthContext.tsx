import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, User } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

interface UserAuthContextType {
  user: User | null
  session: Session | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  error: string | null
  clearError: () => void
  isGuest: boolean
  isRegistered: boolean
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined)

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    
    const initializeAuth = async () => {
      try {
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession()
        const sessionTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        )
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          sessionTimeout
        ]) as any
        
        if (!isMounted) return
        
        if (error) {
          console.error('Session error:', error)
          setSession(null)
          setUser(null)
          setIsLoading(false)
          return
        }
        
        setSession(session)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (isMounted) {
          setSession(null)
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    // Add timeout to prevent infinite loading - reduced to 8 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('User auth initialization timeout')
        setIsLoading(false)
        setUser(null)
        setSession(null)
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
      
      setSession(session)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
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

  const fetchUserProfile = async (userId: string) => {
    try {
      // Add timeout to user profile query
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
        
      const profileTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile query timeout')), 5000)
      )
      
      const { data, error } = await Promise.race([
        profilePromise,
        profileTimeout
      ]) as any

      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create a basic one
        console.log('User profile not found, creating basic profile for user:', userId)
        
        try {
          // Get user info from auth with timeout
          const authPromise = supabase.auth.getUser()
          const authTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth user timeout')), 3000)
          )
          
          const { data: { user: authUser } } = await Promise.race([
            authPromise,
            authTimeout
          ]) as any
          
          if (authUser) {
            const newUserProfile = {
              id: authUser.id,
              email: authUser.email || '',
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              phone: authUser.user_metadata?.phone || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            // Create user profile with timeout
            const createPromise = supabase
              .from('users')
              .insert(newUserProfile)
              .select()
              .single()
              
            const createTimeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Create profile timeout')), 5000)
            )
            
            const { data: createdUser, error: createError } = await Promise.race([
              createPromise,
              createTimeout
            ]) as any
            
            if (createError) {
              console.error('Error creating user profile:', createError)
              setError('Failed to create user profile')
            } else if (createdUser) {
              setUser(createdUser)
            }
          }
        } catch (authError) {
          console.error('Error getting auth user:', authError)
          setError('Failed to get user information')
        }
      } else if (error && error.message !== 'Profile query timeout') {
        console.error('Error fetching user profile:', error)
        setError('Failed to fetch user profile')
      } else if (data) {
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      if (error instanceof Error && error.message !== 'Profile query timeout') {
        setError('Failed to fetch user profile')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      })

      if (error) {
        setIsLoading(false)
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            phone
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          setIsLoading(false)
          return { success: false, error: 'Failed to create user profile' }
        }

        setIsLoading(false)
        return { success: true }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return { success: false, error: 'An unexpected error occurred' }
    }

    setIsLoading(false)
    return { success: false, error: 'Registration failed' }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setIsLoading(false)
        return { success: false, error: error.message }
      }

      if (data.user) {
        setIsLoading(false)
        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return { success: false, error: 'An unexpected error occurred' }
    }

    setIsLoading(false)
    return { success: false, error: 'Login failed' }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setError(null)
    } catch (error) {
      console.error('Logout error:', error)
      setError('Failed to logout')
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No user logged in' }
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      if (data) {
        setUser(data)
        return { success: true }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }

    return { success: false, error: 'Update failed' }
  }

  const clearError = () => {
    setError(null)
  }

  const value: UserAuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    error,
    clearError,
    isGuest: !session,
    isRegistered: !!session && !!user
  }

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider')
  }
  return context
}