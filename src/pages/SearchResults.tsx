import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, MapPin, Star, Grid, List, ChevronDown } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchWidget from '../components/SearchWidget';
import HotelCard, { Hotel } from '../components/HotelCard';
import Button from '../components/ui/Button';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    amenities: [] as string[],
    hotelType: [] as string[]
  });

  // Get search parameters
  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';
  const rooms = searchParams.get('rooms') || '1';

  // Mock hotel data
  const allHotels: Hotel[] = [
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
      description: 'Relax and unwind at our beachfront paradise with pristine white sand beaches and crystal-clear waters.'
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
      description: 'Escape to the mountains and enjoy breathtaking alpine views in our cozy and luxurious mountain retreat.'
    },
    {
      id: '4',
      name: 'Urban Boutique Hotel',
      location: 'San Francisco, CA',
      rating: 4.6,
      reviewCount: 523,
      price: 179,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20boutique%20hotel%20urban%20design%20contemporary%20architecture%20city%20setting&image_size=landscape_4_3',
      amenities: ['wifi', 'restaurant', 'gym'],
      description: 'A stylish boutique hotel in the heart of San Francisco with modern amenities and personalized service.'
    },
    {
      id: '5',
      name: 'Desert Oasis Resort',
      location: 'Scottsdale, AZ',
      rating: 4.5,
      reviewCount: 789,
      price: 219,
      originalPrice: 289,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=desert%20resort%20hotel%20southwestern%20architecture%20cactus%20landscape%20sunset%20mountains&image_size=landscape_4_3',
      amenities: ['wifi', 'parking', 'restaurant', 'gym'],
      description: 'Experience the beauty of the Sonoran Desert at our luxurious resort with world-class spa facilities.'
    },
    {
      id: '6',
      name: 'Historic Downtown Inn',
      location: 'Charleston, SC',
      rating: 4.4,
      reviewCount: 456,
      price: 159,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=historic%20southern%20hotel%20colonial%20architecture%20charming%20facade%20cobblestone%20street&image_size=landscape_4_3',
      amenities: ['wifi', 'restaurant'],
      description: 'Step back in time at our beautifully restored historic inn in the heart of Charleston\'s historic district.'
    }
  ];

  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(allHotels);

  // Filter and sort hotels
  useEffect(() => {
    let filtered = [...allHotels];

    // Apply filters
    filtered = filtered.filter(hotel => {
      const priceInRange = hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1];
      const ratingMatch = hotel.rating >= filters.rating;
      return priceInRange && ratingMatch;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep recommended order (featured first)
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredHotels(filtered);
  }, [filters, sortBy]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {destination ? `Hotels in ${destination}` : 'Search Results'}
            </h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              {checkIn && checkOut && (
                <span>{checkIn} - {checkOut}</span>
              )}
              <span>{guests} guests, {rooms} room{parseInt(rooms) > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          {/* Compact Search Widget */}
          <SearchWidget variant="compact" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ priceRange: [0, 1000], rating: 0, amenities: [], hotelType: [] })}
                >
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                        className="text-vinotel-primary"
                      />
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-vinotel-secondary fill-current" />
                        <span className="ml-1 text-sm">{rating}+</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
                <div className="space-y-2">
                  {['WiFi', 'Parking', 'Restaurant', 'Gym', 'Pool', 'Spa'].map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.toLowerCase())}
                        onChange={(e) => {
                          const amenities = e.target.checked
                            ? [...filters.amenities, amenity.toLowerCase()]
                            : filters.amenities.filter(a => a !== amenity.toLowerCase());
                          handleFilterChange('amenities', amenities);
                        }}
                        className="text-vinotel-primary"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  {filteredHotels.length} hotels found
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-vinotel-primary focus:border-transparent"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-vinotel-primary text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-vinotel-primary text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel Results */}
            {filteredHotels.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredHotels.map((hotel) => (
                  <HotelCard 
                    key={hotel.id} 
                    hotel={hotel} 
                    className={viewMode === 'list' ? 'md:flex md:max-w-none' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={() => setFilters({ priceRange: [0, 1000], rating: 0, amenities: [], hotelType: [] })}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredHotels.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Hotels
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;