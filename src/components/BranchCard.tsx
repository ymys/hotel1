import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Heart } from 'lucide-react';
import Button from './ui/Button';

export interface Branch {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  description: string;
  featured?: boolean;
}

interface BranchCardProps {
  branch: Branch;
  variant?: 'default' | 'featured';
  className?: string;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  restaurant: <Coffee className="w-4 h-4" />,
  gym: <Dumbbell className="w-4 h-4" />,
};

const BranchCard: React.FC<BranchCardProps> = ({ branch, variant = 'default', className = '' }) => {
  const isFeatured = variant === 'featured';
  
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

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={branch.image}
          alt={branch.name}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isFeatured ? 'h-64' : 'h-48'
          }`}
        />
        
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        
        {/* Featured Badge */}
        {branch.featured && (
          <div className="absolute top-3 left-3 bg-vinotel-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
        
        {/* Discount Badge */}
        {branch.originalPrice && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            {Math.round((1 - branch.price / branch.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
            isFeatured ? 'text-xl' : 'text-lg'
          }`}>
            {branch.name}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{branch.location}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(branch.rating)}
            </div>
            <span className="text-sm text-gray-600">
              {branch.rating} ({branch.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {branch.description}
        </p>

        {/* Amenities */}
        <div className="flex items-center space-x-3 mb-4">
          {branch.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center text-gray-500" title={amenity}>
              {amenityIcons[amenity.toLowerCase()] || <div className="w-4 h-4 bg-gray-300 rounded" />}
            </div>
          ))}
          {branch.amenities.length > 4 && (
            <span className="text-xs text-gray-500">+{branch.amenities.length - 4} more</span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-vinotel-primary">
                ${branch.price}
              </span>
              {branch.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${branch.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">per night</span>
          </div>
          
          <Link to={`/branch/${branch.id}`}>
            <Button size="sm" className="px-6">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;