import { supabase } from '../lib/supabase';

export interface Room {
  id: string;
  hotel_id?: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  description?: string;
  images: string[];
  availability_status: 'available' | 'occupied' | 'maintenance' | 'out_of_order';
  floor_number?: number;
  bed_type?: string;
  bathroom_type?: string;
  size_sqm?: number;
  balcony: boolean;
  smoking_allowed: boolean;
  pet_friendly: boolean;
  accessibility_features: string[];
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  max_capacity: number;
  default_amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRoomData {
  hotel_id?: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  amenities?: string[];
  description?: string;
  images?: string[];
  availability_status?: 'available' | 'occupied' | 'maintenance' | 'out_of_order';
  floor_number?: number;
  bed_type?: string;
  bathroom_type?: string;
  size_sqm?: number;
  balcony?: boolean;
  smoking_allowed?: boolean;
  pet_friendly?: boolean;
  accessibility_features?: string[];
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  id: string;
}

export interface RoomFilters {
  room_type?: string;
  availability_status?: string;
  capacity?: number;
  min_price?: number;
  max_price?: number;
  floor_number?: number;
  balcony?: boolean;
  smoking_allowed?: boolean;
  pet_friendly?: boolean;
  search?: string;
}

// Room CRUD Operations
export const roomService = {
  // Get all rooms with optional filters
  async getRooms(filters?: RoomFilters): Promise<{ data: Room[] | null; error: any }> {
    try {
      let query = supabase
        .from('rooms')
        .select('*')
        .order('room_number', { ascending: true });

      // Apply filters
      if (filters) {
        if (filters.room_type) {
          query = query.eq('room_type', filters.room_type);
        }
        if (filters.availability_status) {
          query = query.eq('availability_status', filters.availability_status);
        }
        if (filters.capacity) {
          query = query.gte('capacity', filters.capacity);
        }
        if (filters.min_price) {
          query = query.gte('price_per_night', filters.min_price);
        }
        if (filters.max_price) {
          query = query.lte('price_per_night', filters.max_price);
        }
        if (filters.floor_number) {
          query = query.eq('floor_number', filters.floor_number);
        }
        if (filters.balcony !== undefined) {
          query = query.eq('balcony', filters.balcony);
        }
        if (filters.smoking_allowed !== undefined) {
          query = query.eq('smoking_allowed', filters.smoking_allowed);
        }
        if (filters.pet_friendly !== undefined) {
          query = query.eq('pet_friendly', filters.pet_friendly);
        }
        if (filters.search) {
          query = query.or(`room_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return { data: null, error };
    }
  },

  // Get a single room by ID
  async getRoomById(id: string): Promise<{ data: Room | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching room:', error);
      return { data: null, error };
    }
  },

  // Create a new room
  async createRoom(roomData: CreateRoomData): Promise<{ data: Room | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([{
          ...roomData,
          amenities: roomData.amenities || [],
          images: roomData.images || [],
          availability_status: roomData.availability_status || 'available',
          balcony: roomData.balcony || false,
          smoking_allowed: roomData.smoking_allowed || false,
          pet_friendly: roomData.pet_friendly || false,
          accessibility_features: roomData.accessibility_features || []
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating room:', error);
      return { data: null, error };
    }
  },

  // Update an existing room
  async updateRoom(roomData: UpdateRoomData): Promise<{ data: Room | null; error: any }> {
    try {
      const { id, ...updateData } = roomData;
      const { data, error } = await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating room:', error);
      return { data: null, error };
    }
  },

  // Delete a room
  async deleteRoom(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Error deleting room:', error);
      return { error };
    }
  },

  // Update room availability status
  async updateRoomStatus(id: string, status: Room['availability_status']): Promise<{ data: Room | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ availability_status: status })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating room status:', error);
      return { data: null, error };
    }
  },

  // Bulk update room statuses
  async bulkUpdateRoomStatus(roomIds: string[], status: Room['availability_status']): Promise<{ data: Room[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ availability_status: status })
        .in('id', roomIds)
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error bulk updating room status:', error);
      return { data: null, error };
    }
  },

  // Get room statistics
  async getRoomStats(): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('availability_status, room_type')
        .then(({ data, error }) => {
          if (error) return { data: null, error };
          
          const stats = {
            total: data?.length || 0,
            available: data?.filter(r => r.availability_status === 'available').length || 0,
            occupied: data?.filter(r => r.availability_status === 'occupied').length || 0,
            maintenance: data?.filter(r => r.availability_status === 'maintenance').length || 0,
            out_of_order: data?.filter(r => r.availability_status === 'out_of_order').length || 0,
            by_type: data?.reduce((acc: any, room) => {
              acc[room.room_type] = (acc[room.room_type] || 0) + 1;
              return acc;
            }, {}) || {}
          };
          
          return { data: stats, error: null };
        });

      return { data, error };
    } catch (error) {
      console.error('Error fetching room stats:', error);
      return { data: null, error };
    }
  }
};

// Room Types CRUD Operations
export const roomTypeService = {
  // Get all room types
  async getRoomTypes(): Promise<{ data: RoomType[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('base_price', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error fetching room types:', error);
      return { data: null, error };
    }
  },

  // Get a single room type by ID
  async getRoomTypeById(id: string): Promise<{ data: RoomType | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching room type:', error);
      return { data: null, error };
    }
  },

  // Create a new room type
  async createRoomType(roomTypeData: Omit<RoomType, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: RoomType | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .insert([roomTypeData])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating room type:', error);
      return { data: null, error };
    }
  },

  // Update an existing room type
  async updateRoomType(id: string, roomTypeData: Partial<Omit<RoomType, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: RoomType | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .update(roomTypeData)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating room type:', error);
      return { data: null, error };
    }
  },

  // Delete a room type
  async deleteRoomType(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('room_types')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Error deleting room type:', error);
      return { error };
    }
  }
};

// Real-time subscriptions
export const roomSubscriptions = {
  // Subscribe to room changes
  subscribeToRooms(callback: (payload: any) => void) {
    return supabase
      .channel('rooms')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rooms' }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to room type changes
  subscribeToRoomTypes(callback: (payload: any) => void) {
    return supabase
      .channel('room_types')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'room_types' }, 
        callback
      )
      .subscribe();
  }
};