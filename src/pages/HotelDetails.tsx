import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Sparkles, 
  ChevronLeft, ChevronRight, Heart, Share2, Calendar,
  Users, Bed, Bath, Square, Check, X
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { Hotel } from '../components/HotelCard';

interface RoomType {
  id: string;
  name: string;
  size: number;
  beds: string;
  maxGuests: number;
  price: number;
  originalPrice?: number;
  amenities: string[];
  images: string[];
  description: string;
  available: boolean;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Mock hotel data - in real app, this would come from API
  const hotel: Hotel & { 
    images: string[];
    fullDescription: string;
    address: string;
    phone: string;
    email: string;
    checkInTime: string;
    checkOutTime: string;
    policies: string[];
  } = {
    id: id || '1',
    name: 'The Grand Palazzo',
    location: 'New York, NY',
    rating: 4.8,
    reviewCount: 1247,
    price: 299,
    originalPrice: 399,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20grand%20palazzo%20style%20architecture%20elegant%20facade%20golden%20hour&image_size=landscape_4_3',
    images: [
      'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20grand%20palazzo%20style%20architecture%20elegant%20facade%20golden%20hour&image_size=landscape_4_3',
      'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20lobby%20marble%20floors%20crystal%20chandelier%20elegant%20interior%20design&image_size=landscape_4_3',
      'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20room%20king%20bed%20city%20view%20modern%20elegant%20decor&image_size=landscape_4_3',
      'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20restaurant%20fine%20dining%20elegant%20atmosphere%20gourmet%20cuisine&image_size=landscape_4_3',
      'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20spa%20wellness%20center%20relaxation%20luxury%20treatment%20rooms&image_size=landscape_4_3'
    ],
    amenities: ['wifi', 'parking', 'restaurant', 'gym', 'pool', 'spa'],
    description: 'Experience luxury at its finest in the heart of Manhattan with stunning city views and world-class amenities.',
    fullDescription: 'The Grand Palazzo stands as a beacon of luxury in the heart of Manhattan, offering an unparalleled experience for discerning travelers. Our elegantly appointed rooms and suites feature breathtaking city views, marble bathrooms, and state-of-the-art amenities. Indulge in world-class dining at our award-winning restaurant, rejuvenate at our full-service spa, or maintain your fitness routine in our fully equipped gym. With impeccable service and attention to detail, The Grand Palazzo ensures every moment of your stay is extraordinary.',
    featured: true,
    address: '123 Fifth Avenue, New York, NY 10001',
    phone: '+1 (212) 555-0123',
    email: 'reservations@grandpalazzo.com',
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    policies: [
      'Cancellation: Free cancellation up to 24 hours before check-in',
      'Pets: Pet-friendly with additional fee',
      'Smoking: Non-smoking property',
      'Age requirement: Guests must be 18+ to check in'
    ]
  };

  const roomTypes: RoomType[] = [
    {
      id: '1',
      name: 'Deluxe King Room',
      size: 350,
      beds: '1 King Bed',
      maxGuests: 2,
      price: 299,
      originalPrice: 399,
      amenities: ['wifi', 'minibar', 'safe', 'ac'],
      images: [
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20room%20king%20bed%20city%20view%20modern%20elegant%20decor&image_size=landscape_4_3'
      ],
      description: 'Spacious room with king bed, city views, and modern amenities.',
      available: true
    },
    {
      id: '2',
      name: 'Executive Suite',
      size: 650,
      beds: '1 King Bed + Sofa Bed',
      maxGuests: 4,
      price: 499,
      originalPrice: 649,
      amenities: ['wifi', 'minibar', 'safe', 'ac', 'balcony'],
      images: [
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20suite%20separate%20living%20area%20panoramic%20city%20views&image_size=landscape_4_3'
      ],
      description: 'Luxurious suite with separate living area and panoramic city views.',
      available: true
    },
    {
      id: '3',
      name: 'Presidential Suite',
      size: 1200,
      beds: '2 King Beds',
      maxGuests: 6,
      price: 899,
      amenities: ['wifi', 'minibar', 'safe', 'ac', 'balcony', 'butler'],
      images: [
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=presidential%20hotel%20suite%20luxury%20multiple%20rooms%20premium%20furnishing&image_size=landscape_4_3'
      ],
      description: 'Ultimate luxury with multiple rooms, premium amenities, and butler service.',
      available: false
    }
  ];

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely stunning hotel! The service was impeccable and the room was beautifully appointed. The location is perfect for exploring Manhattan.',
      helpful: 12
    },
    {
      id: '2',
      userName: 'Michael Chen',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great hotel with excellent amenities. The spa was fantastic and the restaurant served amazing food. Only minor issue was the noise from the street.',
      helpful: 8
    },
    {
      id: '3',
      userName: 'Emily Rodriguez',
      rating: 5,
      date: '2024-01-05',
      comment: 'Perfect for a romantic getaway. The suite was spacious and the city views were breathtaking. Staff went above and beyond to make our stay special.',
      helpful: 15
    }
  ];

  const amenityIcons: { [key: string]: React.ReactNode } = {
    wifi: <Wifi className="w-5 h-5" />,
    parking: <Car className="w-5 h-5" />,
    restaurant: <Coffee className="w-5 h-5" />,
    gym: <Dumbbell className="w-5 h-5" />,
    pool: <Waves className="w-5 h-5" />,
    spa: <Sparkles className="w-5 h-5" />
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-vinotel-secondary fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={hotel.images[currentImageIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {hotel.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{hotel.address}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {renderStars(hotel.rating)}
                    <span className="ml-2 font-medium">{hotel.rating}</span>
                  </div>
                  <span className="text-gray-600">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                {hotel.fullDescription}
              </p>
              
              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {amenityIcons[amenity] || <div className="w-5 h-5 bg-gray-300 rounded" />}
                      <span className="text-gray-700 capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Types</h2>
              <div className="space-y-6">
                {roomTypes.map((room) => (
                  <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-vinotel-primary">
                                ${room.price}
                              </span>
                              {room.originalPrice && (
                                <span className="text-lg text-gray-500 line-through">
                                  ${room.originalPrice}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">per night</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{room.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-1">
                            <Square className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{room.size} sq ft</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bed className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{room.beds}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Up to {room.maxGuests} guests</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {room.available ? (
                              <>
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">Available</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600">Not Available</span>
                              </>
                            )}
                          </div>
                          <Button
                            disabled={!room.available}
                            onClick={() => setSelectedRoom(room.id)}
                            className={selectedRoom === room.id ? 'bg-vinotel-secondary' : ''}
                          >
                            {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="hover:text-vinotel-primary transition-colors">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">View All Reviews</Button>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-vinotel-primary">
                    ${hotel.price}
                  </span>
                  {hotel.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${hotel.originalPrice}
                    </span>
                  )}
                </div>
                <span className="text-gray-600">per night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rooms
                    </label>
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} room{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Link to={`/booking/${hotel.id}`}>
                <Button size="lg" className="w-full mb-4">
                  Book Now
                </Button>
              </Link>
              
              <div className="text-center text-sm text-gray-600 mb-4">
                Free cancellation until 24 hours before check-in
              </div>
              
              {/* Hotel Contact Info */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phone:</span>
                  <span className="text-vinotel-primary">{hotel.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-vinotel-primary">{hotel.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Check-in:</span>
                  <span>{hotel.checkInTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Check-out:</span>
                  <span>{hotel.checkOutTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetails;