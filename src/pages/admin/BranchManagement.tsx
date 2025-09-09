import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Star,
  Bed,
  Users,
  DollarSign,
  X,
  Save
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  location: string;
  rating: number;
  totalRooms: number;
  availableRooms: number;
  priceRange: string;
  image: string;
  amenities: string[];
  description: string;
}

interface Room {
  id: string;
  branchId: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  available: boolean;
}

const BranchManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showRooms, setShowRooms] = useState<string | null>(null);

  // Mock data
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'Vinotel Grand Plaza',
      location: 'New York, NY',
      rating: 4.8,
      totalRooms: 120,
      availableRooms: 45,
      priceRange: '$200-$500',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20vinotel%20branch%20exterior%20grand%20plaza%20modern%20architecture&image_size=landscape_4_3',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      description: 'Luxury Vinotel branch in the heart of Manhattan with world-class amenities.'
    },
    {
      id: '2',
      name: 'Vinotel Ocean View',
      location: 'Miami, FL',
      rating: 4.7,
      totalRooms: 200,
      availableRooms: 78,
      priceRange: '$150-$400',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beachfront%20vinotel%20branch%20ocean%20view%20tropical%20paradise&image_size=landscape_4_3',
      amenities: ['Beach Access', 'Pool', 'Restaurant', 'Bar', 'Water Sports'],
      description: 'Beautiful beachfront resort with stunning ocean views.'
    },
    {
      id: '3',
      name: 'Vinotel Mountain Lodge',
      location: 'Aspen, CO',
      rating: 4.6,
      totalRooms: 80,
      availableRooms: 23,
      priceRange: '$180-$350',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mountain%20vinotel%20branch%20rustic%20wooden%20architecture%20snow%20peaks&image_size=landscape_4_3',
      amenities: ['Ski Access', 'Fireplace', 'Restaurant', 'Spa', 'Hot Tub'],
      description: 'Cozy mountain retreat perfect for ski enthusiasts.'
    }
  ]);

  const [rooms] = useState<Room[]>([
    {
      id: '1',
      branchId: '1',
      type: 'Standard Room',
      price: 200,
      capacity: 2,
      amenities: ['WiFi', 'TV', 'AC'],
      available: true
    },
    {
      id: '2',
      branchId: '1',
      type: 'Deluxe Suite',
      price: 350,
      capacity: 4,
      amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Balcony'],
      available: true
    },
    {
      id: '3',
      branchId: '2',
      type: 'Ocean View Room',
      price: 250,
      capacity: 2,
      amenities: ['WiFi', 'TV', 'AC', 'Ocean View'],
      available: false
    }
  ]);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteBranch = (branchId: string) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      setBranches(branches.filter(branch => branch.id !== branchId));
    }
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const BranchModal: React.FC<{ branch?: Branch; onClose: () => void; onSave: (branch: Branch) => void }> = ({ branch, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Branch>>(branch || {
      name: '',
      location: '',
      rating: 0,
      totalRooms: 0,
      availableRooms: 0,
      priceRange: '',
      image: '',
      amenities: [],
      description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newBranch: Branch = {
        id: branch?.id || Date.now().toString(),
        name: formData.name || '',
        location: formData.location || '',
        rating: formData.rating || 0,
        totalRooms: formData.totalRooms || 0,
        availableRooms: formData.availableRooms || 0,
        priceRange: formData.priceRange || '',
        image: formData.image || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20vinotel%20branch%20building%20exterior&image_size=landscape_4_3',
        amenities: formData.amenities || [],
        description: formData.description || ''
      };
      onSave(newBranch);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {branch ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalRooms}
                  onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Rooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.availableRooms}
                  onChange={(e) => setFormData({ ...formData, availableRooms: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <input
                  type="text"
                  placeholder="e.g., $200-$500"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-vinotel-primary text-white rounded-md hover:bg-vinotel-primary/90 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {branch ? 'Update' : 'Create'} Branch
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600 mt-1">Manage branches and room inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-vinotel-primary text-white px-4 py-2 rounded-md hover:bg-vinotel-primary/90 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search branches by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={branch.image}
              alt={branch.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{branch.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{branch.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{branch.totalRooms} rooms</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{branch.availableRooms} available</span>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">{branch.priceRange}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{branch.description}</p>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowRooms(showRooms === branch.id ? null : branch.id)}
                  className="text-vinotel-primary hover:text-vinotel-primary/80 text-sm font-medium"
                >
                  {showRooms === branch.id ? 'Hide Rooms' : 'View Rooms'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="p-2 text-gray-600 hover:text-vinotel-primary hover:bg-vinotel-primary/5 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Room List */}
              {showRooms === branch.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Rooms</h4>
                  <div className="space-y-2">
                    {rooms
                      .filter(room => room.branchId === branch.id)
                      .map(room => (
                        <div key={room.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="text-sm font-medium">{room.type}</span>
                            <span className="text-sm text-gray-600 ml-2">${room.price}/night</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            room.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {room.available ? 'Available' : 'Occupied'}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <BranchModal
          onClose={() => setShowAddModal(false)}
          onSave={(branch) => {
            setBranches([...branches, branch]);
            setShowAddModal(false);
          }}
        />
      )}
      
      {showEditModal && selectedBranch && (
        <BranchModal
          branch={selectedBranch}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
          onSave={(updatedBranch) => {
            setBranches(branches.map(b => b.id === updatedBranch.id ? updatedBranch : b));
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
        />
      )}
    </div>
  );
};

export default BranchManagement;