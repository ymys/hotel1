import React from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const AdminDebugInfo: React.FC = () => {
  const { user, isLoading, error } = useAdminAuth()
  
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>User: {user ? user.email : 'null'}</div>
      <div>Error: {error || 'none'}</div>
      <div>Time: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}

export default AdminDebugInfo