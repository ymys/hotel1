-- Create rooms table for hotel room management
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hotel_id UUID, -- For multi-hotel support (can be null for single hotel)
    room_number VARCHAR(20) NOT NULL UNIQUE,
    room_type VARCHAR(50) NOT NULL, -- e.g., 'standard', 'deluxe', 'suite', 'presidential'
    capacity INTEGER NOT NULL DEFAULT 2,
    price_per_night DECIMAL(10,2) NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb, -- Array of amenities like ['wifi', 'tv', 'minibar']
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'occupied', 'maintenance', 'out_of_order')),
    floor_number INTEGER,
    bed_type VARCHAR(30), -- e.g., 'single', 'double', 'queen', 'king'
    bathroom_type VARCHAR(30), -- e.g., 'private', 'shared'
    size_sqm DECIMAL(6,2), -- Room size in square meters
    balcony BOOLEAN DEFAULT false,
    smoking_allowed BOOLEAN DEFAULT false,
    pet_friendly BOOLEAN DEFAULT false,
    accessibility_features JSONB DEFAULT '[]'::jsonb, -- Array of accessibility features
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON public.rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type ON public.rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_rooms_availability_status ON public.rooms(availability_status);
CREATE INDEX IF NOT EXISTS idx_rooms_capacity ON public.rooms(capacity);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON public.rooms(price_per_night);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON public.rooms(floor_number);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can view all rooms" ON public.rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin', 'manager')
        )
    );

CREATE POLICY "Admin users can insert rooms" ON public.rooms
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admin users can update rooms" ON public.rooms
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Super admin can delete rooms" ON public.rooms
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role = 'super_admin'
        )
    );

-- Grant permissions to authenticated users
GRANT ALL PRIVILEGES ON public.rooms TO authenticated;
GRANT ALL PRIVILEGES ON public.rooms TO anon;

-- Insert some sample rooms for testing
INSERT INTO public.rooms (room_number, room_type, capacity, price_per_night, amenities, description, floor_number, bed_type, bathroom_type, size_sqm, balcony) VALUES
('101', 'standard', 2, 120.00, '["wifi", "tv", "air_conditioning", "minibar"]', 'Comfortable standard room with city view', 1, 'queen', 'private', 25.5, false),
('102', 'standard', 2, 120.00, '["wifi", "tv", "air_conditioning", "minibar"]', 'Comfortable standard room with city view', 1, 'queen', 'private', 25.5, false),
('201', 'deluxe', 2, 180.00, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe"]', 'Spacious deluxe room with premium amenities', 2, 'king', 'private', 35.0, true),
('202', 'deluxe', 3, 200.00, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe", "sofa_bed"]', 'Deluxe room with sofa bed for extra guest', 2, 'king', 'private', 40.0, true),
('301', 'suite', 4, 350.00, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe", "jacuzzi", "living_area"]', 'Luxury suite with separate living area and jacuzzi', 3, 'king', 'private', 65.0, true),
('401', 'presidential', 6, 800.00, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe", "jacuzzi", "living_area", "dining_area", "kitchen", "butler_service"]', 'Presidential suite with full amenities and butler service', 4, 'king', 'private', 120.0, true);

-- Create room_types table for better type management
CREATE TABLE IF NOT EXISTS public.room_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 2,
    default_amenities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for room_types
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for room_types
CREATE POLICY "Admin users can view all room types" ON public.room_types
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin', 'manager')
        )
    );

CREATE POLICY "Admin users can manage room types" ON public.room_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin')
        )
    );

-- Grant permissions for room_types
GRANT ALL PRIVILEGES ON public.room_types TO authenticated;
GRANT ALL PRIVILEGES ON public.room_types TO anon;

-- Insert default room types
INSERT INTO public.room_types (name, description, base_price, max_capacity, default_amenities) VALUES
('standard', 'Standard room with basic amenities', 120.00, 2, '["wifi", "tv", "air_conditioning", "minibar"]'),
('deluxe', 'Deluxe room with premium amenities', 180.00, 3, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe"]'),
('suite', 'Luxury suite with separate living area', 350.00, 4, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe", "jacuzzi", "living_area"]'),
('presidential', 'Presidential suite with full luxury amenities', 800.00, 6, '["wifi", "tv", "air_conditioning", "minibar", "coffee_machine", "safe", "jacuzzi", "living_area", "dining_area", "kitchen", "butler_service"]');

-- Create trigger for room_types updated_at
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON public.room_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();