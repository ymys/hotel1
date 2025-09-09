import React, { useState, useEffect } from 'react';
import { MapPin, Star, DollarSign, Navigation } from 'lucide-react';
import { Branch } from './BranchCard';
import Button from './ui/Button';

interface BranchMapViewProps {
  branches: Branch[];
  selectedBranch?: Branch | null;
  onBranchSelect: (branch: Branch) => void;
  className?: string;
}

interface MapBranch extends Branch {
  latitude: number;
  longitude: number;
}

const BranchMapView: React.FC<BranchMapViewProps> = ({
  branches,
  selectedBranch,
  onBranchSelect,
  className = ''
}) => {
  const [mapBranches, setMapBranches] = useState<MapBranch[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of USA
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock coordinates for branches (in a real app, this would come from the database)
  const branchCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'New York, NY': { lat: 40.7589, lng: -73.9851 },
    'Miami Beach, FL': { lat: 25.7907, lng: -80.1300 },
    'Aspen, CO': { lat: 39.1911, lng: -106.8175 },
    'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
    'Scottsdale, AZ': { lat: 33.4942, lng: -111.9261 },
    'Charleston, SC': { lat: 32.7765, lng: -79.9311 }
  };

  useEffect(() => {
    // Add coordinates to branches
    const branchesWithCoords = branches.map(branch => ({
      ...branch,
      latitude: branchCoordinates[branch.location]?.lat || 0,
      longitude: branchCoordinates[branch.location]?.lng || 0
    }));
    setMapBranches(branchesWithCoords);

    // Set map center to first branch or user location
    if (branchesWithCoords.length > 0) {
      setMapCenter({
        lat: branchesWithCoords[0].latitude,
        lng: branchesWithCoords[0].longitude
      });
    }
  }, [branches]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-vinotel-secondary fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="bg-white rounded-lg shadow-sm px-3 py-2">
          <span className="text-sm font-medium text-gray-900">
            {mapBranches.length} branches found
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={getUserLocation}
          className="bg-white shadow-sm"
        >
          <Navigation className="w-4 h-4 mr-2" />
          My Location
        </Button>
      </div>

      {/* Simulated Map Area */}
      <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500 rounded-full opacity-25 animate-ping" />
          </div>
        )}

        {/* Branch Markers */}
        {mapBranches.map((branch, index) => {
          const isSelected = selectedBranch?.id === branch.id;
          const x = 20 + (index * 80) % 300; // Distribute markers across the map
          const y = 60 + (index * 60) % 200;
          
          return (
            <div
              key={branch.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all duration-200 ${
                isSelected ? 'scale-110' : 'hover:scale-105'
              }`}
              style={{
                left: `${x}px`,
                top: `${y}px`
              }}
              onClick={() => onBranchSelect(branch)}
            >
              {/* Marker Pin */}
              <div className={`relative ${
                isSelected ? 'z-30' : 'z-20'
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  isSelected 
                    ? 'bg-vinotel-primary' 
                    : 'bg-vinotel-secondary hover:bg-vinotel-primary'
                }`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                
                {/* Price Badge */}
                <div className={`absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm border ${
                  isSelected ? 'border-vinotel-primary text-vinotel-primary' : 'border-gray-200 text-gray-700'
                }`}>
                  ${branch.price}
                </div>
              </div>

              {/* Branch Info Popup */}
              {isSelected && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl border p-4 z-40">
                  <div className="flex items-start space-x-3">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {branch.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        {renderStars(branch.rating)}
                        <span className="ml-1 text-xs text-gray-600">
                          ({branch.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-vinotel-primary">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-sm font-semibold">{branch.price}</span>
                          <span className="text-xs text-gray-500 ml-1">/ night</span>
                        </div>
                        {userLocation && (
                          <span className="text-xs text-gray-500">
                            {calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              branch.latitude,
                              branch.longitude
                            ).toFixed(1)} mi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow pointing to marker */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="bg-white rounded-lg shadow-sm p-2 hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-700">+</span>
        </button>
        <button className="bg-white rounded-lg shadow-sm p-2 hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-700">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-vinotel-secondary rounded-full" />
            <span>Vinotel Branch</span>
          </div>
          {userLocation && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchMapView;