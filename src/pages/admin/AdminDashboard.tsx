import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Star
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-vinotel-primary/5 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {changeType === 'increase' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ml-1 ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <DollarSign className="w-6 h-6 text-vinotel-primary" />
    },
    {
      title: 'Total Bookings',
      value: '1,247',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <Calendar className="w-6 h-6 text-vinotel-primary" />
    },
    {
      title: 'Active Branches',
      value: '24',
      change: '+2',
      changeType: 'increase' as const,
      icon: <Building2 className="w-6 h-6 text-vinotel-primary" />
    },
    {
      title: 'Total Users',
      value: '3,456',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-vinotel-primary" />
    }
  ];

  const recentBookings = [
    {
      id: '1',
      guest: 'John Smith',
      branch: 'Vinotel Grand Plaza',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      amount: '$450',
      status: 'confirmed'
    },
    {
      id: '2',
      guest: 'Sarah Johnson',
      branch: 'Vinotel Ocean View',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      amount: '$680',
      status: 'pending'
    },
    {
      id: '3',
      guest: 'Mike Davis',
      branch: 'Vinotel City Center',
      checkIn: '2024-01-17',
      checkOut: '2024-01-19',
      amount: '$320',
      status: 'confirmed'
    }
  ];

  const topBranches = [
    {
      name: 'Vinotel Grand Plaza',
      bookings: 156,
      revenue: '$45,600',
      rating: 4.8
    },
    {
      name: 'Ocean View Resort',
      bookings: 134,
      revenue: '$38,200',
      rating: 4.7
    },
    {
      name: 'Mountain Lodge',
      bookings: 98,
      revenue: '$28,400',
      rating: 4.6
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <TrendingUp className="w-5 h-5 text-vinotel-primary" />
          </div>
          <div className="h-64 bg-gradient-to-r from-teal-50 to-amber-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-vinotel-primary mx-auto mb-2" />
              <p className="text-gray-600">Revenue chart would be displayed here</p>
              <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Top Branches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Branches</h3>
          <div className="space-y-4">
            {topBranches.map((branch, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{branch.name}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{branch.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{branch.revenue}</p>
                  <p className="text-sm text-gray-600">{branch.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.guest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;