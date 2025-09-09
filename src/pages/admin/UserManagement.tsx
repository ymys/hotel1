import React, { useState } from 'react';
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Eye,
  Ban,
  CheckCircle,
  X,
  Building2,
  CreditCard
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  totalBookings: number;
  totalSpent: number;
  location: string;
  preferredBranches: string[];
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock user data
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-06-15',
      lastLogin: '2024-01-14',
      status: 'active',
      totalBookings: 12,
      totalSpent: 4500,
      location: 'New York, NY',
      preferredBranches: ['Vinotel Grand Plaza', 'Vinotel Ocean View'],
      loyaltyTier: 'gold'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      joinDate: '2023-08-22',
      lastLogin: '2024-01-13',
      status: 'active',
      totalBookings: 8,
      totalSpent: 2800,
      location: 'Los Angeles, CA',
      preferredBranches: ['Vinotel Ocean View'],
      loyaltyTier: 'silver'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2023-03-10',
      lastLogin: '2024-01-12',
      status: 'active',
      totalBookings: 25,
      totalSpent: 8900,
      location: 'Chicago, IL',
      preferredBranches: ['Vinotel Grand Plaza', 'Vinotel Mountain Lodge', 'Vinotel Ocean View'],
      loyaltyTier: 'platinum'
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.wilson@email.com',
      phone: '+1 (555) 321-0987',
      joinDate: '2023-11-05',
      lastLogin: '2024-01-10',
      status: 'inactive',
      totalBookings: 3,
      totalSpent: 950,
      location: 'Miami, FL',
      preferredBranches: ['Vinotel Ocean View'],
      loyaltyTier: 'bronze'
    },
    {
      id: '5',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '+1 (555) 654-3210',
      joinDate: '2023-01-18',
      lastLogin: '2024-01-11',
      status: 'suspended',
      totalBookings: 15,
      totalSpent: 5200,
      location: 'Seattle, WA',
      preferredBranches: ['Vinotel Mountain Lodge'],
      loyaltyTier: 'gold'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 789-0123',
      joinDate: '2023-09-30',
      lastLogin: '2024-01-15',
      status: 'active',
      totalBookings: 6,
      totalSpent: 1800,
      location: 'Denver, CO',
      preferredBranches: ['Vinotel Mountain Lodge'],
      loyaltyTier: 'silver'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const UserDetailsModal: React.FC<{ user: UserData; onClose: () => void }> = ({ user, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Full Name:</span>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Location:</span>
                  <p className="font-medium">{user.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Join Date:</span>
                  <p className="font-medium">{user.joinDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Last Login:</span>
                  <p className="font-medium">{user.lastLogin}</p>
                </div>
              </div>
            </div>
            
            {/* Account Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <br />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Loyalty Tier:</span>
                  <br />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyTierColor(user.loyaltyTier)}`}>
                    {user.loyaltyTier}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Booking Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-vinotel-primary mr-2" />
                  <div>
                    <span className="text-sm text-gray-600">Total Bookings:</span>
                    <p className="font-medium text-lg">{user.totalBookings}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-vinotel-primary mr-2" />
                  <div>
                    <span className="text-sm text-gray-600">Total Spent:</span>
                    <p className="font-medium text-lg">${user.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preferred Branches */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Preferred Branches</h3>
              <div className="space-y-2">
                {user.preferredBranches.map((branch, index) => (
                  <div key={index} className="flex items-center p-2 bg-white rounded border">
                    <Building2 className="w-4 h-4 text-vinotel-primary mr-2" />
                    <span className="text-sm">{branch}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {user.status === 'active' && (
                <button
                  onClick={() => {
                    handleStatusChange(user.id, 'suspended');
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend User
                </button>
              )}
              {user.status === 'suspended' && (
                <button
                  onClick={() => {
                    handleStatusChange(user.id, 'active');
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate User
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">View and manage registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-vinotel-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Ban className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'suspended').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-amber-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{users.reduce((sum, user) => sum + user.totalBookings, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-vinotel-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-vinotel-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">Joined {user.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{user.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{user.lastLogin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.totalBookings} bookings</div>
                    <div className="text-sm text-gray-500">${user.totalSpent.toLocaleString()} spent</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyTierColor(user.loyaltyTier)}`}>
                        {user.loyaltyTier}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="text-vinotel-primary hover:text-vinotel-primary/80"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;