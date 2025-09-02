import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, MapPin, Star, Phone, Mail, Download, Share2, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

interface BookingDetails {
  id: string;
  hotel: {
    name: string;
    location: string;
    rating: number;
    image: string;
    phone: string;
    email: string;
    amenities: string[];
  };
  room: {
    name: string;
    type: string;
    amenities: string[];
  };
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: number;
  rooms: number;
  pricing: {
    roomTotal: number;
    taxes: number;
    total: number;
  };
  status: string;
  bookingDate: string;
}

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch booking details
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        // Mock booking data - in real app, fetch from API
        const mockBooking: BookingDetails = {
          id: bookingId || 'BK123456789',
          hotel: {
            name: 'Grand Palace Hotel',
            location: 'Downtown, New York',
            rating: 4.8,
            image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20grand%20palace%20style%20architecture%20elegant%20facade&image_size=landscape_16_9',
            phone: '+1 (555) 123-4567',
            email: 'info@grandpalacehotel.com',
            amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Fitness Center']
          },
          room: {
            name: 'Deluxe Room',
            type: 'King Bed',
            amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service']
          },
          guest: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 987-6543'
          },
          dates: {
            checkIn: '2024-03-15',
            checkOut: '2024-03-18',
            nights: 3
          },
          guests: 2,
          rooms: 1,
          pricing: {
            roomTotal: 897.00,
            taxes: 107.64,
            total: 1004.64
          },
          status: 'Confirmed',
          bookingDate: new Date().toISOString().split('T')[0]
        };
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBooking(mockBooking);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Free WiFi': <Wifi className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Restaurant': <Coffee className="w-4 h-4" />,
    'Fitness Center': <Dumbbell className="w-4 h-4" />
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadConfirmation = () => {
    // In a real app, this would generate and download a PDF
    alert('Booking confirmation download will be available soon!');
  };

  const handleShareBooking = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: 'Hotel Booking Confirmation',
        text: `My booking at ${booking.hotel.name} is confirmed! Booking ID: ${booking.id}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vinotel-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find a booking with ID: {bookingId}</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your reservation has been successfully confirmed</p>
          <p className="text-sm text-gray-500 mt-2">Booking ID: <span className="font-mono font-medium">{booking.id}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hotel Details</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={booking.hotel.image}
                  alt={booking.hotel.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.hotel.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{booking.hotel.location}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{booking.hotel.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {booking.hotel.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                        {amenityIcons[amenity]}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{booking.hotel.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{booking.hotel.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Stay Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{formatDate(booking.dates.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{formatDate(booking.dates.checkOut)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{booking.dates.nights} night{booking.dates.nights > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{booking.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rooms:</span>
                      <span className="font-medium">{booking.rooms}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Room Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium">{booking.room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bed Type:</span>
                      <span className="font-medium">{booking.room.type}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Room Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {booking.room.amenities.map((amenity) => (
                        <span key={amenity} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{booking.guest.firstName} {booking.guest.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{booking.guest.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{booking.guest.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Check-in time: 3:00 PM</li>
                <li>• Check-out time: 11:00 AM</li>
                <li>• Please bring a valid photo ID and the credit card used for booking</li>
                <li>• Cancellation policy: Free cancellation up to 24 hours before check-in</li>
                <li>• For any changes or questions, contact the hotel directly</li>
              </ul>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">{booking.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono font-medium">{booking.id}</span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room Total:</span>
                  <span className="font-medium">${booking.pricing.roomTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes &amp; Fees:</span>
                  <span className="font-medium">${booking.pricing.taxes.toFixed(2)}</span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total Paid:</span>
                <span className="text-vinotel-primary">${booking.pricing.total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleDownloadConfirmation}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>
                
                <Button 
                  onClick={handleShareBooking}
                  variant="outline" 
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Booking
                </Button>
                
                <Link to="/dashboard/bookings" className="block">
                  <Button className="w-full">
                    View All Bookings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingConfirmation;