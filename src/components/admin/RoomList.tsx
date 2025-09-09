import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wrench,
  Users,
  DollarSign,
  Building,
  Bed
} from 'lucide-react';
import { roomService, Room, RoomFilters } from '../../services/roomService';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

interface RoomListProps {
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
  onViewRoom?: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onEditRoom, onDeleteRoom, onViewRoom }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RoomFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Load rooms
  const loadRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await roomService.getRooms({ ...filters, search: searchTerm });
      
      if (error) {
        setError('Failed to load rooms: ' + (error.message || 'Unknown error'));
        return;
      }
      
      setRooms(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [filters, searchTerm]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof RoomFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Handle room selection
  const handleRoomSelection = (roomId: string, checked: boolean) => {
    if (checked) {
      setSelectedRooms(prev => [...prev, roomId]);
    } else {
      setSelectedRooms(prev => prev.filter(id => id !== roomId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRooms(rooms.map(room => room.id));
    } else {
      setSelectedRooms([]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedRooms.length === 0) return;

    try {
      setLoading(true);
      const { error } = await roomService.bulkUpdateRoomStatus(
        selectedRooms, 
        bulkAction as Room['availability_status']
      );
      
      if (error) {
        setError('Failed to update rooms: ' + (error.message || 'Unknown error'));
        return;
      }
      
      await loadRooms();
      setSelectedRooms([]);
      setBulkAction('');
    } catch (err) {
      setError('Failed to update rooms');
      console.error('Error updating rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get status icon and color
  const getStatusDisplay = (status: Room['availability_status']) => {
    switch (status) {
      case 'available':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Available' };
      case 'occupied':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Occupied' };
      case 'maintenance':
        return { icon: Wrench, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Maintenance' };
      case 'out_of_order':
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Order' };
      default:
        return { icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage branch rooms and their availability</p>
        </div>
        <Link
          to="/admin/rooms/new"
          className="bg-vinotel-primary hover:bg-vinotel-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search rooms by number or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Room Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={filters.room_type || ''}
                  onChange={(e) => handleFilterChange('room_type', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidential</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.availability_status || ''}
                  onChange={(e) => handleFilterChange('availability_status', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out_of_order">Out of Order</option>
                </select>
              </div>

              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
                <select
                  value={filters.capacity || ''}
                  onChange={(e) => handleFilterChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Any Capacity</option>
                  <option value="1">1+ Guests</option>
                  <option value="2">2+ Guests</option>
                  <option value="3">3+ Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              {/* Floor Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <select
                  value={filters.floor_number || ''}
                  onChange={(e) => handleFilterChange('floor_number', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">All Floors</option>
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                  <option value="4">Floor 4</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedRooms.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Action</option>
                <option value="available">Mark Available</option>
                <option value="occupied">Mark Occupied</option>
                <option value="maintenance">Mark Maintenance</option>
                <option value="out_of_order">Mark Out of Order</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && <ErrorAlert error={error} />}

      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRooms.length === rooms.length && rooms.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-vinotel-primary focus:ring-vinotel-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Night
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => {
                const statusDisplay = getStatusDisplay(room.availability_status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room.id)}
                        onChange={(e) => handleRoomSelection(room.id, e.target.checked)}
                        className="rounded border-gray-300 text-vinotel-primary focus:ring-vinotel-primary"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{room.room_number}</div>
                          {room.bed_type && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Bed className="h-3 w-3 mr-1" />
                              {room.bed_type}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {room.room_type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusDisplay.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        {room.capacity}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {room.price_per_night}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {room.floor_number || 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onViewRoom?.(room)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditRoom?.(room)}
                          className="text-vinotel-primary/60 hover:text-vinotel-primary transition-colors"
                          title="Edit Room"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRoom?.(room)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {rooms.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first room'}
            </p>
            {!searchTerm && Object.keys(filters).length === 0 && (
              <div className="mt-6">
                <Link
                  to="/admin/rooms/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-vinotel-primary hover:bg-vinotel-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vinotel-primary"
                >
                  <Plus className="-ml-1 mr-2 h-4 w-4" />
                  Add Room
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      {loading && rooms.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default RoomList;