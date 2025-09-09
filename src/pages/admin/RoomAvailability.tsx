import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Building2,
  Bed,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  Plus,
  Minus,
  AlertTriangle
} from 'lucide-react';

interface RoomType {
  id: string;
  name: string;
  branchId: string;
  branchName: string;
  capacity: number;
  basePrice: number;
  totalRooms: number;
  description: string;
}

interface RoomAvailability {
  id: string;
  roomTypeId: string;
  date: string;
  availableRooms: number;
  price: number;
  isBlocked: boolean;
  reason?: string;
}

const RoomAvailabilityManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAvailability, setEditingAvailability] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [blockReason, setBlockReason] = useState('');

  // Mock room types data
  const roomTypes: RoomType[] = [
    {
      id: '1',
      name: 'Standard Room',
      branchId: '1',
      branchName: 'Vinotel Grand Plaza',
      capacity: 2,
      basePrice: 150,
      totalRooms: 50,
      description: 'Comfortable standard room with city view'
    },
    {
      id: '2',
      name: 'Deluxe Suite',
      branchId: '1',
      branchName: 'Vinotel Grand Plaza',
      capacity: 4,
      basePrice: 300,
      totalRooms: 20,
      description: 'Spacious suite with premium amenities'
    },
    {
      id: '3',
      name: 'Ocean View Room',
      branchId: '2',
      branchName: 'Vinotel Ocean View',
      capacity: 2,
      basePrice: 200,
      totalRooms: 80,
      description: 'Beautiful room with ocean view'
    },
    {
      id: '4',
      name: 'Presidential Suite',
      branchId: '2',
      branchName: 'Vinotel Ocean View',
      capacity: 6,
      basePrice: 500,
      totalRooms: 5,
      description: 'Luxury presidential suite with panoramic views'
    },
    {
      id: '5',
      name: 'Mountain Cabin',
      branchId: '3',
      branchName: 'Vinotel Mountain Lodge',
      capacity: 4,
      basePrice: 180,
      totalRooms: 30,
      description: 'Cozy cabin with mountain views'
    }
  ];

  // Mock availability data
  const [availability, setAvailability] = useState<RoomAvailability[]>([
    {
      id: '1',
      roomTypeId: '1',
      date: selectedDate,
      availableRooms: 45,
      price: 150,
      isBlocked: false
    },
    {
      id: '2',
      roomTypeId: '2',
      date: selectedDate,
      availableRooms: 18,
      price: 300,
      isBlocked: false
    },
    {
      id: '3',
      roomTypeId: '3',
      date: selectedDate,
      availableRooms: 0,
      price: 200,
      isBlocked: true,
      reason: 'Maintenance scheduled'
    },
    {
      id: '4',
      roomTypeId: '4',
      date: selectedDate,
      availableRooms: 4,
      price: 500,
      isBlocked: false
    },
    {
      id: '5',
      roomTypeId: '5',
      date: selectedDate,
      availableRooms: 25,
      price: 180,
      isBlocked: false
    }
  ]);

  const branches = Array.from(new Set(roomTypes.map(rt => ({ id: rt.branchId, name: rt.branchName }))));

  const filteredRoomTypes = roomTypes.filter(roomType => {
    const matchesBranch = selectedBranch === 'all' || roomType.branchId === selectedBranch;
    const matchesSearch = 
      roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomType.branchName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBranch && matchesSearch;
  });

  const getAvailabilityForRoomType = (roomTypeId: string) => {
    return availability.find(a => a.roomTypeId === roomTypeId && a.date === selectedDate);
  };

  const updateAvailability = (roomTypeId: string, field: 'availableRooms' | 'price', value: number) => {
    setAvailability(prev => prev.map(a => 
      a.roomTypeId === roomTypeId && a.date === selectedDate
        ? { ...a, [field]: value }
        : a
    ));
  };

  const toggleBlock = (roomTypeId: string, block: boolean, reason?: string) => {
    setAvailability(prev => prev.map(a => 
      a.roomTypeId === roomTypeId && a.date === selectedDate
        ? { ...a, isBlocked: block, availableRooms: block ? 0 : roomTypes.find(rt => rt.id === roomTypeId)?.totalRooms || 0, reason }
        : a
    ));
  };

  const getOccupancyRate = (roomType: RoomType) => {
    const avail = getAvailabilityForRoomType(roomType.id);
    if (!avail || avail.isBlocked) return 0;
    return ((roomType.totalRooms - avail.availableRooms) / roomType.totalRooms) * 100;
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const BlockRoomModal: React.FC = () => {
    if (!selectedRoomType) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Block Rooms</h2>
            <button onClick={() => setShowBlockModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Block all rooms for <strong>{selectedRoomType.name}</strong> on {selectedDate}?
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for blocking:
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter reason for blocking rooms..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleBlock(selectedRoomType.id, true, blockReason);
                  setShowBlockModal(false);
                  setBlockReason('');
                  setSelectedRoomType(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Block Rooms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Room Availability Management</h1>
        <p className="text-gray-600 mt-1">Manage room inventory and availability</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-vinotel-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Room Types</p>
              <p className="text-2xl font-bold text-gray-900">{roomTypes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Bed className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{roomTypes.reduce((sum, rt) => sum + rt.totalRooms, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {availability.filter(a => a.date === selectedDate && !a.isBlocked).reduce((sum, a) => sum + a.availableRooms, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-gray-900">
                {availability.filter(a => a.date === selectedDate && a.isBlocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search room types or branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white min-w-[200px]"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Availability Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoomTypes.map((roomType) => {
                const avail = getAvailabilityForRoomType(roomType.id);
                const occupancyRate = getOccupancyRate(roomType);
                const isEditing = editingAvailability === roomType.id;
                
                return (
                  <tr key={roomType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{roomType.name}</div>
                        <div className="text-sm text-gray-500">{roomType.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{roomType.branchName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{roomType.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{roomType.totalRooms}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateAvailability(roomType.id, 'availableRooms', Math.max(0, (avail?.availableRooms || 0) - 1))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={avail?.availableRooms || 0}
                            onChange={(e) => updateAvailability(roomType.id, 'availableRooms', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                            min="0"
                            max={roomType.totalRooms}
                          />
                          <button
                            onClick={() => updateAvailability(roomType.id, 'availableRooms', Math.min(roomType.totalRooms, (avail?.availableRooms || 0) + 1))}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {avail?.isBlocked ? (
                            <span className="text-red-600 font-medium">Blocked</span>
                          ) : (
                            avail?.availableRooms || 0
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            value={avail?.price || roomType.basePrice}
                            onChange={(e) => updateAvailability(roomType.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">${avail?.price || roomType.basePrice}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOccupancyColor(occupancyRate)}`}>
                        {occupancyRate.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {avail?.isBlocked ? (
                        <div className="flex items-center">
                          <XCircle className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-sm text-red-600">Blocked</span>
                          {avail.reason && (
                            <div className="ml-2 group relative">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {avail.reason}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600">Available</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {isEditing ? (
                          <button
                            onClick={() => setEditingAvailability(null)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingAvailability(roomType.id)}
                            className="text-vinotel-primary hover:text-vinotel-primary/80"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {avail?.isBlocked ? (
                          <button
                            onClick={() => toggleBlock(roomType.id, false)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedRoomType(roomType);
                              setShowBlockModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Room Modal */}
      {showBlockModal && <BlockRoomModal />}
    </div>
  );
};

export default RoomAvailabilityManagement;