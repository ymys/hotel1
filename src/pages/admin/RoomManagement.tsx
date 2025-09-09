import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Room, CreateRoomData, UpdateRoomData } from '../../services/roomService';
import { roomService } from '../../services/roomService';
import RoomList from '../../components/admin/RoomList';
import { RoomForm } from '../../components/admin/RoomForm';
import { RoomDetails } from '../../components/admin/RoomDetails';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorAlert from '../../components/admin/ErrorAlert';

type ViewMode = 'list' | 'form' | 'details' | 'view' | 'edit';

const RoomManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: roomsData, error: roomsError } = await roomService.getRooms();
      if (roomsError) {
        throw new Error(roomsError.message || 'Failed to fetch rooms');
      }
      setRooms(roomsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setViewMode('form');
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setViewMode('form');
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoomId(room.id);
    setViewMode('view');
  };

  const handleDeleteRoom = async (room: Room) => {
    const roomId = room.id;
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const { error: deleteError } = await roomService.deleteRoom(roomId);
        if (deleteError) {
          throw new Error(deleteError.message || 'Failed to delete room');
        }
        await loadRooms(); // Refresh the list
        if (viewMode === 'details' && selectedRoomId === roomId) {
          setViewMode('list');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete room');
      }
    }
  };

  const handleFormSubmit = async (data: CreateRoomData | UpdateRoomData) => {
    try {
      setFormLoading(true);
      setError(null);
      
      if (selectedRoom) {
        // Update existing room
        const { error: updateError } = await roomService.updateRoom({ ...data, id: selectedRoom.id } as UpdateRoomData);
        if (updateError) {
          throw new Error(updateError.message || 'Failed to update room');
        }
      } else {
        // Create new room
        const { error: createError } = await roomService.createRoom(data as CreateRoomData);
        if (createError) {
          throw new Error(createError.message || 'Failed to create room');
        }
      }
      
      await loadRooms(); // Refresh the list
      setViewMode('list');
      setSelectedRoom(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedRoom(null);
  };

  const handleDetailsClose = () => {
    setViewMode('list');
    setSelectedRoomId(null);
  };

  const handleDetailsEdit = (room: Room) => {
    setSelectedRoom(room);
    setViewMode('form');
  };

  const handleDetailsDelete = async (roomId: string) => {
    // Find the room object from the rooms array
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      await handleDeleteRoom(room);
      setViewMode('list');
    }
  };

  const handleBulkStatusUpdate = async (roomIds: string[], status: string) => {
    try {
      setError(null);
      const { error: bulkUpdateError } = await roomService.bulkUpdateRoomStatus(roomIds, status as Room['availability_status']);
      if (bulkUpdateError) {
        throw new Error(bulkUpdateError.message || 'Failed to update room status');
      }
      await loadRooms(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room status');
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            {viewMode === 'list' && 'Room Management'}
            {viewMode === 'form' && (selectedRoom ? 'Edit Room' : 'Add New Room')}
            {viewMode === 'details' && 'Room Details'}
          </h1>
          <p className="text-gray-600 mt-1">
            {viewMode === 'list' && `Manage room inventory, pricing, and availability across all Vinotel branches (${rooms.length} rooms)`}
            {viewMode === 'form' && (selectedRoom ? 'Update room information' : 'Create a new room')}
            {viewMode === 'details' && 'View detailed room information'}
          </p>
        </div>
        
        {viewMode === 'list' && (
          <button
            onClick={handleAddRoom}
            className="flex items-center space-x-2 px-4 py-2 bg-vinotel-primary text-white rounded-lg hover:bg-vinotel-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Room</span>
          </button>
        )}
        
        {(viewMode === 'form' || viewMode === 'details') && (
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>← Back to List</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
      )}

      {/* Content based on view mode */}
      {viewMode === 'list' && (
        <RoomList
          onEditRoom={handleEditRoom}
          onDeleteRoom={handleDeleteRoom}
          onViewRoom={handleViewRoom}
        />
      )}

      {viewMode === 'form' && (
        <RoomForm
          room={selectedRoom || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}

      {viewMode === 'details' && selectedRoomId && (
        <RoomDetails
          roomId={selectedRoomId}
          onEdit={handleDetailsEdit}
          onDelete={handleDetailsDelete}
          onClose={handleDetailsClose}
        />
      )}
    </div>
  );
};

export default RoomManagement;