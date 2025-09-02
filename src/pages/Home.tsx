import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Shield, Clock, ArrowRight, Quote } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchWidget from '../components/SearchWidget';
import HotelCard, { Hotel } from '../components/HotelCard';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  // Mock data for featured hotels
  const featuredHotels: Hotel[] = [
    {
      id: '1',
      name: 'The Grand Palazzo',
      location: 'New York, NY',
      rating: 4.8,
      reviewCount: 1247,
      price: 299,
      originalPrice: 399,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20grand%20palazzo%20style%20architecture%20elegant%20facade%20golden%20hour&image_size=landscape_4_3',
      amenities: ['wifi', 'parking', 'restaurant', 'gym'],
      description: 'Experience luxury at its finest in the heart of Manhattan with stunning city views and world-class amenities.',
      featured: true
    },
    {
      id: '2',
      name: 'Oceanview Resort & Spa',
      location: 'Miami Beach, FL',
      rating: 4.9,
      reviewCount: 892,
      price: 249,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beachfront%20resort%20hotel%20ocean%20view%20tropical%20paradise%20palm%20trees%20sunset&image_size=landscape_4_3',
      amenities: ['wifi', 'parking', 'restaurant', 'gym'],
      description: 'Relax and unwind at our beachfront paradise with pristine white sand beaches and crystal-clear waters.',
      featured: true
    },
    {
      id: '3',
      name: 'Mountain Lodge Retreat',
      location: 'Aspen, CO',
      rating: 4.7,
      reviewCount: 634,
      price: 189,
      originalPrice: 259,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mountain%20lodge%20hotel%20snow%20capped%20peaks%20cozy%20cabin%20style%20winter%20wonderland&image_size=landscape_4_3',
      amenities: ['wifi', 'parking', 'restaurant'],
      description: 'Escape to the mountains and enjoy breathtaking alpine views in our cozy and luxurious mountain retreat.',
      featured: true
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Los Angeles, CA',
      rating: 5,
      comment: 'Absolutely incredible experience! The booking process was seamless and the hotel exceeded all expectations. Will definitely use Vinotel again.',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20woman%20smiling%20business%20attire%20friendly%20approachable&image_size=square'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      rating: 5,
      comment: 'The best hotel booking platform I\'ve used. Great prices, amazing selection, and excellent customer service. Highly recommended!',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20man%20smiling%20business%20casual%20confident%20friendly&image_size=square'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Chicago, IL',
      rating: 5,
      comment: 'Found the perfect hotel for our anniversary trip. The photos were accurate and the booking process was so easy. Thank you Vinotel!',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20woman%20latina%20smiling%20elegant%20warm%20expression&image_size=square'
    }
  ];

  const features = [
    {
      icon: <Award className="w-8 h-8 text-vinotel-secondary" />,
      title: 'Premium Selection',
      description: 'Handpicked luxury hotels and resorts worldwide'
    },
    {
      icon: <Shield className="w-8 h-8 text-vinotel-secondary" />,
      title: 'Secure Booking',
      description: 'Safe and secure payment processing with 24/7 support'
    },
    {
      icon: <Clock className="w-8 h-8 text-vinotel-secondary" />,
      title: 'Instant Confirmation',
      description: 'Get immediate booking confirmation and digital receipts'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20lobby%20elegant%20interior%20marble%20columns%20crystal%20chandelier%20warm%20lighting%20sophisticated%20atmosphere&image_size=landscape_16_9"
            alt="Luxury Hotel Lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Your Perfect
            <span className="block text-vinotel-secondary">Luxury Escape</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Experience world-class hospitality with our curated selection of premium hotels and resorts. Your journey to luxury begins here.
          </p>
          
          {/* Search Widget */}
          <SearchWidget variant="hero" className="mb-8" />
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/search">
              <Button size="lg" className="px-8 py-4 text-lg">
                Explore Hotels
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              Watch Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Vinotel?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the finest hotel booking experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of luxury accommodations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} variant="featured" />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/search">
              <Button size="lg" variant="outline" className="px-8">
                View All Hotels
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-vinotel-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Guests Say</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Read reviews from travelers who've experienced luxury with Vinotel
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={i} className="w-4 h-4 text-vinotel-secondary fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-vinotel-secondary mb-4" />
                <p className="text-gray-700 leading-relaxed">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-vinotel-primary to-vinotel-primary/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers and book your perfect getaway today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" variant="secondary" className="px-8">
                Book Now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;