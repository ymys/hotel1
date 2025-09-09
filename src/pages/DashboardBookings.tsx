import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Star, Clock, CreditCard } from 'lucide-react';
import { useUserAuth } from '../contexts/UserAuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/admin/LoadingSpinner';

interface Booking {
  id: string;
  branchName: string;
  branchLocation: string;
  branchImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
}

const DashboardBookings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useUserAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Mock bookings data - replace with actual API call
  useEffect(() => {
    if (user) {
      // Simulate API call
      setTimeout(() => {
        setBookings([
          {
            id: '1',
            branchName: 'Vinotel Downtown',
            branchLocation: 'New York, NY',
            branchImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20luxury%20hotel%20exterior%20downtown%20city&image_size=landscape_4_3',
            checkIn: '2024-02-15',
            checkOut: '2024-02-18',
            guests: 2,
            roomType: 'Deluxe Suite',
            totalAmount: 450,
            status: 'confirmed',
            bookingDate: '2024-01-20'
          },
          {
            id: '2',
            branchName: 'Vinotel Beachfront',
            branchLocation: 'Miami, FL',
            branchImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20beachfront%20hotel%20resort%20palm%20trees&image_size=landscape_4_3',
            checkIn: '2024-01-10',
            checkOut: '2024-01-12',
            guests: 1,
            roomType: 'Ocean View Room',
            totalAmount: 280,
            status: 'completed',
            bookingDate: '2023-12-15'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your hotel reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start exploring our branches and make your first reservation!</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-vinotel-primary text-white px-6 py-3 rounded-lg hover:bg-vinotel-primary/90 transition-colors"
            >
              Browse Branches
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                      <img
                        src={booking.branchImage}
                        alt={booking.branchName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.branchName}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{booking.branchLocation}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{booking.checkIn} - {booking.checkOut}</span>
                          </div>
                          <div className="flex items-center">
                            <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ${booking.totalAmount}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.roomType}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-3">
                      {booking.status === 'confirmed' && (
                        <button className="text-vinotel-primary hover:text-vinotel-primary/80 text-sm font-medium">
                          Modify Booking
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        View Details
                      </button>
                      {booking.status === 'completed' && (
                        <button className="text-vinotel-primary hover:text-vinotel-primary/80 text-sm font-medium">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardBookings;