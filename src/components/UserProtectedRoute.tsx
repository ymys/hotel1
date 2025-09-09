import { Navigate, useLocation } from 'react-router-dom'
import { useUserAuth } from '@/contexts/UserAuthContext'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

interface UserProtectedRouteProps {
  children: React.ReactNode
  requireRegistered?: boolean
}

export default function UserProtectedRoute({ children, requireRegistered = true }: UserProtectedRouteProps) {
  const { isLoading, isRegistered, session } = useUserAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // If registration is required but user is not registered
  if (requireRegistered && !isRegistered) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If any authentication is required but user has no session
  if (!requireRegistered && !session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}