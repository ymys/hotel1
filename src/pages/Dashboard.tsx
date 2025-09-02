import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Heart, Settings, CreditCard, Bell, MapPin, Star, Phone, Mail } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

interface Booking {
  id: string;
  hotel: {
    name: string;
    location: string;
    image: string;
    rating: number;
  };
  room: {
    name: string;
    type: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: number;
  total: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}

interface SavedHotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: number;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'saved' | 'profile'>('overview');
  
  // Mock data - in real app, fetch from API
  const [userProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 987-6543',
    dateOfBirth: '1990-05-15',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  });

  const [bookings] = useState<Booking[]>([
    {
      id: 'BK123456789',
      hotel: {
        name: 'Grand Palace Hotel',
        location: 'Downtown, New York',
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20grand%20palace%20style%20architecture%20elegant%20facade&image_size=square',
        rating: 4.8
      },
      room: {
        name: 'Deluxe Room',
        type: 'King Bed'
      },
      dates: {
        checkIn: '2024-03-15',
        checkOut: '2024-03-18',
        nights: 3
      },
      guests: 2,
      total: 1004.64,
      status: 'confirmed'
    },
    {
      id: 'BK987654321',
      hotel: {
        name: 'Seaside Resort',
        location: 'Miami Beach, FL',
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beachfront%20resort%20hotel%20tropical%20palm%20trees%20ocean%20view&image_size=square',
        rating: 4.6
      },
      room: {
        name: 'Ocean View Suite',
        type: 'Queen Bed'
      },
      dates: {
        checkIn: '2024-02-10',
        checkOut: '2024-02-14',
        nights: 4
      },
      guests: 2,
      total: 1256.80,
      status: 'completed'
    }
  ]);

  const [savedHotels] = useState<SavedHotel[]>([
    {
      id: '1',
      name: 'Mountain View Lodge',
      location: 'Aspen, CO',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mountain%20lodge%20hotel%20snow%20peaks%20cozy%20wooden%20architecture&image_size=square',
      rating: 4.7,
      price: 299
    },
    {
      id: '2',
      name: 'City Center Hotel',
      location: 'San Francisco, CA',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20city%20hotel%20urban%20architecture%20glass%20facade%20downtown&image_size=square',
      rating: 4.5,
      price: 189
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome back, {userProfile.firstName}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-vinotel-primary/5 rounded-lg">
            <Calendar className="w-8 h-8 text-vinotel-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center p-4 bg-vinotel-secondary/5 rounded-lg">
            <Heart className="w-8 h-8 text-vinotel-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{savedHotels.length}</div>
            <div className="text-sm text-gray-600">Saved Hotels</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Avg. Rating</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="space-y-4">
          {bookings.slice(0, 2).map((booking) => (
            <div key={booking.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <img
                src={booking.hotel.image}
                alt={booking.hotel.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{booking.hotel.name}</h4>
                <p className="text-sm text-gray-600">{booking.hotel.location}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(booking.dates.checkIn)} - {formatDate(booking.dates.checkOut)}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">${booking.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('bookings')}
            className="w-full"
          >
            View All Bookings
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                  <img
                    src={booking.hotel.image}
                    alt={booking.hotel.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{booking.hotel.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{booking.hotel.location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{booking.hotel.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{booking.room.name} - {booking.room.type}</p>
                  </div>
                </div>
                
                <div className="lg:text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {formatDate(booking.dates.checkIn)} - {formatDate(booking.dates.checkOut)}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{booking.dates.nights} nights • {booking.guests} guests</p>
                  <p className="text-lg font-bold text-gray-900">${booking.total.toFixed(2)}</p>
                  <div className="mt-3 space-x-2">
                    <Link to={`/confirmation/${booking.id}`}>
                      <Button size="sm" variant="outline">View Details</Button>
                    </Link>
                    {booking.status === 'confirmed' && (
                      <Button size="sm" variant="outline">Modify</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSavedHotels = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedHotels.map((hotel) => (
            <div key={hotel.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{hotel.location}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-vinotel-primary">${hotel.price}</span>
                  <span className="text-sm text-gray-600">/night</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/hotel/${hotel.id}`} className="flex-1">
                  <Button className="w-full" size="sm">View Hotel</Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={userProfile.firstName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={userProfile.lastName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={userProfile.address.street}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={userProfile.address.city}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={userProfile.address.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={userProfile.address.zipCode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={userProfile.address.country}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vinotel-primary focus:border-transparent">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-vinotel-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{userProfile.firstName} {userProfile.lastName}</h2>
                <p className="text-sm text-gray-600">{userProfile.email}</p>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-vinotel-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-vinotel-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  My Bookings
                </button>
                
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'saved'
                      ? 'bg-vinotel-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Saved Hotels
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-vinotel-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Settings
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'saved' && renderSavedHotels()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;