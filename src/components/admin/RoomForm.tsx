import React, { useState, useEffect } from 'react';
import { Room, RoomType, CreateRoomData, UpdateRoomData } from '../../services/roomService';
import { roomService, roomTypeService } from '../../services/roomService';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

interface RoomFormProps {
  room?: Room;
  onSubmit: (data: CreateRoomData | UpdateRoomData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AMENITIES_OPTIONS = [
  'WiFi',
  'Air Conditioning',
  'TV',
  'Mini Bar',
  'Safe',
  'Hair Dryer',
  'Coffee Machine',
  'Room Service',
  'Balcony',
  'Sea View',
  'City View',
  'Jacuzzi',
  'Kitchenette'
];

const BED_TYPES = [
  'Single',
  'Double',
  'Queen',
  'King',
  'Twin',
  'Sofa Bed'
];

const BATHROOM_TYPES = [
  'Private',
  'Shared',
  'Ensuite'
];

const AVAILABILITY_STATUS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'out_of_order', label: 'Out of Order' }
];

export const RoomForm: React.FC<RoomFormProps> = ({
  room,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    hotel_id: room?.hotel_id || '',
    room_number: room?.room_number || '',
    room_type: room?.room_type || '',
    capacity: room?.capacity || 1,
    price_per_night: room?.price_per_night || 0,
    amenities: room?.amenities || [],
    description: room?.description || '',
    images: room?.images || [],
    availability_status: room?.availability_status || 'available',
    floor_number: room?.floor_number || 1,
    bed_type: room?.bed_type || 'Double',
    bathroom_type: room?.bathroom_type || 'Private',
    size_sqm: room?.size_sqm || 0,
    balcony: room?.balcony || false,
    smoking_allowed: room?.smoking_allowed || false,
    pet_friendly: room?.pet_friendly || false,
    accessibility_features: room?.accessibility_features || []
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [accessibilityFeature, setAccessibilityFeature] = useState('');

  useEffect(() => {
    loadRoomTypes();
  }, []);

  const loadRoomTypes = async () => {
    try {
      setLoadingTypes(true);
      const { data: types, error } = await roomTypeService.getRoomTypes();
      if (error) {
        throw new Error(error.message || 'Failed to load room types');
      }
      setRoomTypes(types || []);
    } catch (err) {
      console.error('Error loading room types:', err);
      setError('Failed to load room types');
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddAccessibilityFeature = () => {
    if (accessibilityFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        accessibility_features: [...prev.accessibility_features, accessibilityFeature.trim()]
      }));
      setAccessibilityFeature('');
    }
  };

  const handleRemoveAccessibilityFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accessibility_features: prev.accessibility_features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loadingTypes) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {room ? 'Edit Room' : 'Add New Room'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {error && <ErrorAlert error={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch ID
            </label>
            <input
              type="text"
              name="hotel_id"
              value={formData.hotel_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Night ($)
            </label>
            <input
              type="number"
              name="price_per_night"
              value={formData.price_per_night}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability Status
            </label>
            <select
              name="availability_status"
              value={formData.availability_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {AVAILABILITY_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floor Number
            </label>
            <input
              type="number"
              name="floor_number"
              value={formData.floor_number}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bed Type
            </label>
            <select
              name="bed_type"
              value={formData.bed_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {BED_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathroom Type
            </label>
            <select
              name="bathroom_type"
              value={formData.bathroom_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {BATHROOM_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (sqm)
            </label>
            <input
              type="number"
              name="size_sqm"
              value={formData.size_sqm}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter room description..."
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AMENITIES_OPTIONS.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-vinotel-primary focus:ring-vinotel-primary"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="balcony"
              checked={formData.balcony}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-vinotel-primary focus:ring-vinotel-primary"
            />
            <span className="text-sm font-medium text-gray-700">Has Balcony</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="smoking_allowed"
              checked={formData.smoking_allowed}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-vinotel-primary focus:ring-vinotel-primary"
            />
            <span className="text-sm font-medium text-gray-700">Smoking Allowed</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="pet_friendly"
              checked={formData.pet_friendly}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-vinotel-primary focus:ring-vinotel-primary"
            />
            <span className="text-sm font-medium text-gray-700">Pet Friendly</span>
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Images
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-vinotel-primary text-white rounded-md hover:bg-vinotel-primary/90"
            >
              Add
            </button>
          </div>
          {formData.images.length > 0 && (
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accessibility Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accessibility Features
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={accessibilityFeature}
              onChange={(e) => setAccessibilityFeature(e.target.value)}
              placeholder="Enter accessibility feature"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={handleAddAccessibilityFeature}
              className="px-4 py-2 bg-vinotel-primary text-white rounded-md hover:bg-vinotel-primary/90"
            >
              Add
            </button>
          </div>
          {formData.accessibility_features.length > 0 && (
            <div className="space-y-2">
              {formData.accessibility_features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccessibilityFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-vinotel-primary text-white rounded-md hover:bg-vinotel-primary/90 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>{room ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : (
              room ? 'Update Room' : 'Create Room'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};