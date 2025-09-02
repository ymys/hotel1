import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Users, CreditCard, Shield, ArrowLeft, MapPin, Star, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  amenities: string[];
}

interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  available: number;
}

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

const Booking: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(parseInt(searchParams.get('guests') || '2'));
  const [rooms, setRooms] = useState(parseInt(searchParams.get('rooms') || '1'));
  
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockHotel: Hotel = {
      id: hotelId || '1',
      name: 'Grand Palace Hotel',
      location: 'Downtown, New York',
      rating: 4.8,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20grand%20palace%20style%20architecture%20elegant%20facade&image_size=landscape_16_9',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Fitness Center']
    };
    
    const mockRoomTypes: RoomType[] = [
      {
        id: '1',
        name: 'Deluxe Room',
        description: 'Spacious room with city view and modern amenities',
        price: 299,
        maxGuests: 2,
        amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service'],
        images: ['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20room%20deluxe%20modern%20interior%20city%20view&image_size=landscape_16_9'],
        available: 3
      },
      {
        id: '2',
        name: 'Executive Suite',
        description: 'Premium suite with separate living area and premium amenities',
        price: 499,
        maxGuests: 4,
        amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Balcony', 'Jacuzzi'],
        images: ['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20suite%20executive%20premium%20living%20area%20elegant&image_size=landscape_16_9'],
        available: 2
      }
    ];
    
    setHotel(mockHotel);
    setRoomTypes(mockRoomTypes);
    setSelectedRoom(mockRoomTypes[0]);
  }, [hotelId]);

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Free WiFi': <Wifi className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Restaurant': <Coffee className="w-4 h-4" />,
    'Fitness Center': <Dumbbell className="w-4 h-4" />
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const roomTotal = selectedRoom.price * nights * rooms;
    const taxes = roomTotal * 0.12;
    return roomTotal + taxes;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      if (!checkIn) newErrors.checkIn = 'Check-in date is required';
      if (!checkOut) newErrors.checkOut = 'Check-out date is required';
      if (!selectedRoom) newErrors.room = 'Please select a room type';
    }
    
    if (step === 2) {
      if (!guestDetails.firstName) newErrors.firstName = 'First name is required';
      if (!guestDetails.lastName) newErrors.lastName = 'Last name is required';
      if (!guestDetails.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestDetails.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!guestDetails.phone) newErrors.phone = 'Phone number is required';
    }
    
    if (step === 3) {
      if (!paymentDetails.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!paymentDetails.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentDetails.cvv) newErrors.cvv = 'CVV is required';
      if (!paymentDetails.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate booking ID and redirect to confirmation
      const bookingId = 'BK' + Date.now();
      navigate(`/confirmation/${bookingId}`);
    } catch (error) {
      setErrors({ general: 'Booking failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vinotel-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-vinotel-primary hover:text-vinotel-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Hotel Details
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-vinotel-primary text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-vinotel-primary' : 'text-gray-600'
                }`}>
                  {step === 1 ? 'Select Room' : step === 2 ? 'Guest Details' : 'Payment'}
                </span>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > step ? 'bg-vinotel-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hotel Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hotel.location}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{hotel.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                        {amenityIcons[amenity]}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Your Room</h2>
                
                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Room Types */}
                <div className="space-y-4">
                  {roomTypes.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRoom?.id === room.id
                          ? 'border-vinotel-primary bg-vinotel-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <input
                              type="radio"
                              checked={selectedRoom?.id === room.id}
                              onChange={() => setSelectedRoom(room)}
                              className="mr-3 text-vinotel-primary"
                            />
                            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                          </div>
                          <p className="text-gray-600 mb-3">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {room.amenities.map((amenity) => (
                              <span key={amenity} className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>Up to {room.maxGuests} guests</span>
                            <span className="mx-2">•</span>
                            <span>{room.available} rooms available</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-vinotel-primary">
                            ${room.price}
                          </div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Guest Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={guestDetails.firstName}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={guestDetails.lastName}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    value={guestDetails.specialRequests}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                          errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                          errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                          errors.cvv ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      value={paymentDetails.cardholderName}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent ${
                        errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Name as it appears on card"
                    />
                    {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800 font-medium">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Complete Booking'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedRoom && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type</span>
                    <span className="font-medium">{selectedRoom.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">{checkIn || 'Select date'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">{checkOut || 'Select date'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights</span>
                    <span className="font-medium">{calculateNights()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms</span>
                    <span className="font-medium">{rooms}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Total</span>
                    <span className="font-medium">${(selectedRoom.price * calculateNights() * rooms).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes &amp; Fees</span>
                    <span className="font-medium">${(selectedRoom.price * calculateNights() * rooms * 0.12).toFixed(2)}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-vinotel-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;