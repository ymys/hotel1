import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import Button from './ui/Button';

interface SearchWidgetProps {
  className?: string;
  variant?: 'hero' | 'compact';
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ className = '', variant = 'hero' }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });

  const handleInputChange = (field: string, value: string | number) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.destination || !searchData.checkIn || !searchData.checkOut) {
      return;
    }
    
    const searchParams = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString(),
      rooms: searchData.rooms.toString()
    });
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const isHero = variant === 'hero';
  const containerClasses = isHero 
    ? 'bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto'
    : 'bg-white rounded-lg shadow-md p-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className={`grid gap-4 ${isHero ? 'md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
          {/* Destination */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 inline mr-1" />
              Destination
            </label>
            <input
              type="text"
              placeholder="Where are you going?"
              value={searchData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Check-in Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 inline mr-1" />
              Check-in
            </label>
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 inline mr-1" />
              Check-out
            </label>
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 inline mr-1" />
              Guests
            </label>
            <select
              value={searchData.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vinotel-primary focus:border-transparent transition-colors"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className={isHero ? 'text-center pt-4' : 'pt-2'}>
          <Button
            type="submit"
            size={isHero ? 'lg' : 'md'}
            className={isHero ? 'px-12' : 'w-full'}
          >
            <Search className="w-5 h-5 mr-2" />
            Search Hotels
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchWidget;