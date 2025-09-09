import React, { useState, useEffect } from 'react';
import { Room } from '../../services/roomService';
import { roomService } from '../../services/roomService';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

interface RoomDetailsProps {
  roomId: string;
  onEdit?: (room: Room) => void;
  onDelete?: (roomId: string) => void;
  onClose?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'occupied':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'out_of_order':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'occupied':
      return 'Occupied';
    case 'maintenance':
      return 'Maintenance';
    case 'out_of_order':
      return 'Out of Order';
    default:
      return status;
  }
};

export const RoomDetails: React.FC<RoomDetailsProps> = ({
  roomId,
  onEdit,
  onDelete,
  onClose
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: roomData, error: roomError } = await roomService.getRoomById(roomId);
      if (roomError) {
        throw new Error(roomError.message || 'Failed to fetch room details');
      }
      setRoom(roomData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!room || !onDelete) return;
    
    if (window.confirm(`Are you sure you want to delete room ${room.room_number}?`)) {
      try {
        setDeleting(true);
        const { error: deleteError } = await roomService.deleteRoom(room.id);
        if (deleteError) {
          throw new Error(deleteError.message || 'Failed to delete room');
        }
        onDelete(room.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete room');
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorAlert error={error} />
        <button
          onClick={loadRoom}
          className="mt-4 px-4 py-2 bg-vinotel-primary text-white rounded-md hover:bg-vinotel-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="p-6 text-center text-gray-500">
        Room not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Room {room.room_number}
          </h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.availability_status)}`}>
              {getStatusLabel(room.availability_status)}
            </span>
            <span className="text-lg font-semibold text-vinotel-primary">
              ${room.price_per_night}/night
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(room)}
              className="px-4 py-2 bg-vinotel-primary text-white rounded-md hover:bg-vinotel-primary/90"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Room Images */}
      {room.images && room.images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.images.map((image, index) => (
              <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Room ${room.room_number} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Branch ID</span>
              <p className="text-gray-900">{room.hotel_id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Room Type</span>
              <p className="text-gray-900">{room.room_type}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Capacity</span>
              <p className="text-gray-900">{room.capacity} guests</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Floor</span>
              <p className="text-gray-900">{room.floor_number}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bed Type</span>
              <p className="text-gray-900">{room.bed_type}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bathroom</span>
              <p className="text-gray-900">{room.bathroom_type}</p>
            </div>
            {room.size_sqm && (
              <div>
                <span className="text-sm font-medium text-gray-500">Size</span>
                <p className="text-gray-900">{room.size_sqm} sqm</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Features</h3>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${room.balcony ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span className="text-sm text-gray-700">Balcony</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${room.smoking_allowed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span className="text-sm text-gray-700">Smoking Allowed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${room.pet_friendly ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span className="text-sm text-gray-700">Pet Friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {room.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{room.description}</p>
        </div>
      )}

      {/* Amenities */}
      {room.amenities && room.amenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {room.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                <span className="w-2 h-2 bg-vinotel-primary rounded-full"></span>
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      {room.accessibility_features && room.accessibility_features.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {room.accessibility_features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-md">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t pt-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">Created:</span> {new Date(room.created_at).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(room.updated_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};