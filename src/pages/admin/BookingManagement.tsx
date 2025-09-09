import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  DollarSign
} from 'lucide-react';

interface Booking {
  id: string;
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  branchName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  specialRequests?: string;
}

const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock booking data
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      bookingNumber: 'VIN-2024-001',
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      guestPhone: '+1 (555) 123-4567',
      branchName: 'Vinotel Grand Plaza',
      roomType: 'Deluxe Suite',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      guests: 2,
      totalAmount: 1050,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-10',
      specialRequests: 'Late check-in requested'
    },
    {
      id: '2',
      bookingNumber: 'VIN-2024-002',
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      guestPhone: '+1 (555) 987-6543',
      branchName: 'Vinotel Ocean View',
      roomType: 'Ocean View Room',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      guests: 2,
      totalAmount: 1000,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-12',
      specialRequests: 'Ground floor room preferred'
    },
    {
      id: '3',
      bookingNumber: 'VIN-2024-003',
      guestName: 'Mike Davis',
      guestEmail: 'mike.davis@email.com',
      guestPhone: '+1 (555) 456-7890',
      branchName: 'Vinotel Mountain Lodge',
      roomType: 'Standard Room',
      checkIn: '2024-01-17',
      checkOut: '2024-01-19',
      guests: 1,
      totalAmount: 360,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-11'
    },
    {
      id: '4',
      bookingNumber: 'VIN-2024-004',
      guestName: 'Emily Wilson',
      guestEmail: 'emily.wilson@email.com',
      guestPhone: '+1 (555) 321-0987',
      branchName: 'Vinotel Grand Plaza',
      roomType: 'Standard Room',
      checkIn: '2024-01-20',
      checkOut: '2024-01-22',
      guests: 2,
      totalAmount: 400,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-13'
    },
    {
      id: '5',
      bookingNumber: 'VIN-2024-005',
      guestName: 'Robert Brown',
      guestEmail: 'robert.brown@email.com',
      guestPhone: '+1 (555) 654-3210',
      branchName: 'Vinotel Ocean View',
      roomType: 'Presidential Suite',
      checkIn: '2024-01-25',
      checkOut: '2024-01-28',
      guests: 4,
      totalAmount: 1800,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2024-01-08'
    }
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.branchName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, paymentStatus: newStatus === 'cancelled' ? 'refunded' : booking.paymentStatus }
        : booking
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingDetailsModal: React.FC<{ booking: Booking; onClose: () => void }> = ({ booking, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Booking Number:</span>
                  <p className="font-medium">{booking.bookingNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="font-medium">{booking.createdAt}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Guest Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Guest Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{booking.guestName}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{booking.guestEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{booking.guestPhone}</span>
                </div>
              </div>
            </div>
            
            {/* Stay Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Stay Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Branch:</span>
          <p className="font-medium">{booking.branchName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Room Type:</span>
                  <p className="font-medium">{booking.roomType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Check-in:</span>
                  <p className="font-medium">{booking.checkIn}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Check-out:</span>
                  <p className="font-medium">{booking.checkOut}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Guests:</span>
                  <p className="font-medium">{booking.guests}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <p className="font-medium text-lg">${booking.totalAmount}</p>
                </div>
              </div>
            </div>
            
            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
                <p className="text-gray-700">{booking.specialRequests}</p>
              </div>
            )}
            
            {/* Actions */}
            {booking.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    handleStatusChange(booking.id, 'cancelled');
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Booking
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(booking.id, 'confirmed');
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-1">View and manage all branch bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by guest name, booking number, or branch..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch & Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.bookingNumber}</div>
                      <div className="text-sm text-gray-500">{booking.createdAt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                      <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.branchName}</div>
                      <div className="text-sm text-gray-500">{booking.roomType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <div>
                        <div className="text-sm text-gray-900">{booking.checkIn}</div>
                        <div className="text-sm text-gray-500">to {booking.checkOut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">${booking.totalAmount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className="text-vinotel-primary hover:text-vinotel-primary/80"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingManagement;