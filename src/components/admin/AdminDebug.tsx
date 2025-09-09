import React from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminDebug: React.FC = () => {
  const { user, isLoading, error } = useAdminAuth();

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 p-4 rounded shadow-lg z-50">
      <h3 className="font-bold text-sm mb-2">Admin Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>User: {user ? user.email : 'null'}</div>
        <div>Error: {error || 'none'}</div>
        <div>Timestamp: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default AdminDebug;