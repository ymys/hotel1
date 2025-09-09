import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Bed,
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import ErrorBoundary from './ErrorBoundary';
import ErrorAlert from './ErrorAlert';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasPermission, error, clearError } = useAdminAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      permission: 'view_analytics'
    },
    {
      name: 'Branches',
      href: '/admin/branches',
      icon: Building2,
      permission: 'manage_branches'
    },
    {
      name: 'Room Management',
      href: '/admin/rooms',
      icon: Bed,
      permission: 'manage_rooms'
    },
    {
      name: 'Room Availability',
      href: '/admin/availability',
      icon: Calendar,
      permission: 'manage_rooms'
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: Calendar,
      permission: 'manage_bookings'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      permission: 'manage_users'
    },
    {
      name: 'Admins',
      href: '/admin/admins',
      icon: Shield,
      permission: 'manage_admins'
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      icon: MessageSquare,
      permission: 'manage_reviews'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      permission: 'view_analytics'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      permission: 'manage_settings'
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.permission) || user?.role === 'super_admin'
  );



  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:flex-shrink-0 lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-vinotel-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900">Vinotel Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4">
          <div className="border-b border-gray-100"></div>
        </div>
        <nav className="flex-1 mt-4 px-3">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-vinotel-primary/10 text-vinotel-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-vinotel-primary' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

          {/* User info and logout */}
          <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-vinotel-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-vinotel-primary">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-500">
                  Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Error Alert */}
        {error && (
          <div className="px-6 py-2">
            <ErrorAlert error={error} onDismiss={clearError} />
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;