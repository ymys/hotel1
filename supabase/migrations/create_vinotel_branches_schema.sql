-- Create Vinotel branches schema migration
-- This migration creates the complete database schema for Vinotel's multi-branch booking system

-- Create branches table (replaces hotels concept)
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    branch_type VARCHAR(50) DEFAULT 'standard' CHECK (branch_type IN ('standard', 'luxury', 'resort', 'business')),
    amenities JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for branches
CREATE INDEX IF NOT EXISTS idx_branches_city ON public.branches(city);
CREATE INDEX IF NOT EXISTS idx_branches_type ON public.branches(branch_type);
CREATE INDEX IF NOT EXISTS idx_branches_location ON public.branches(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_branches_active ON public.branches(is_active);

-- Update rooms table to reference branches instead of hotels
ALTER TABLE public.rooms DROP COLUMN IF EXISTS hotel_id;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE;

-- Create index for branch_id in rooms
CREATE INDEX IF NOT EXISTS idx_rooms_branch_id ON public.rooms(branch_id);

-- Create users table for registered users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    confirmation_number VARCHAR(20) UNIQUE NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_branch_id ON public.bookings(branch_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation ON public.bookings(confirmation_number);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_branch_id ON public.reviews(branch_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, branch_id)
);

-- Create indexes for favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_branch_id ON public.favorites(branch_id);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);

-- Update admin_users table to include new roles
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_role_check CHECK (role IN ('super_admin', 'corporate_admin', 'regional_manager', 'branch_manager'));

-- Create index for branch_id in admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_branch_id ON public.admin_users(branch_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for branches
CREATE POLICY "Branches are viewable by everyone" ON public.branches
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin users can manage branches" ON public.branches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'corporate_admin', 'regional_manager')
        )
        OR
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role = 'branch_manager'
            AND admin_users.branch_id = branches.id
        )
    );

-- Create RLS policies for users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin users can view all bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'corporate_admin', 'regional_manager')
        )
        OR
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role = 'branch_manager'
            AND admin_users.branch_id = bookings.branch_id
        )
    );

-- Create RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.user_id = auth.uid()
            AND bookings.status = 'completed'
        )
    );

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for favorites
CREATE POLICY "Users can manage own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE bookings.id = payments.booking_id 
            AND bookings.user_id = auth.uid()
        )
    );

CREATE POLICY "Admin users can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('super_admin', 'corporate_admin', 'regional_manager')
        )
        OR
        EXISTS (
            SELECT 1 FROM public.admin_users a
            JOIN public.bookings b ON b.branch_id = a.branch_id
            WHERE a.id = auth.uid()
            AND a.role = 'branch_manager'
            AND b.id = payments.booking_id
        )
    );

-- Grant permissions
GRANT SELECT ON public.branches TO anon;
GRANT ALL PRIVILEGES ON public.branches TO authenticated;

GRANT SELECT ON public.users TO anon;
GRANT ALL PRIVILEGES ON public.users TO authenticated;

GRANT ALL PRIVILEGES ON public.bookings TO authenticated;
GRANT ALL PRIVILEGES ON public.reviews TO authenticated;
GRANT ALL PRIVILEGES ON public.favorites TO authenticated;
GRANT ALL PRIVILEGES ON public.payments TO authenticated;

-- Insert sample Vinotel branches
INSERT INTO public.branches (name, description, address, city, country, latitude, longitude, branch_type, amenities, images) VALUES
('Vinotel Grand Palace', 'Luxury branch in the heart of the city with world-class amenities and exceptional service.', '123 Grand Avenue', 'New York', 'USA', 40.7589, -73.9851, 'luxury', '["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Valet Parking"]', '["https://images.unsplash.com/photo-1566073771259-6a8506099945", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"]'),
('Vinotel Seaside Resort', 'Beachfront resort branch with stunning ocean views and premium facilities.', '456 Ocean Drive', 'Miami', 'USA', 25.7617, -80.1918, 'resort', '["WiFi", "Beach Access", "Pool", "Restaurant", "Water Sports", "Spa", "Bar"]', '["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"]'),
('Vinotel Business Center', 'Modern business branch with state-of-the-art conference facilities.', '789 Business Blvd', 'San Francisco', 'USA', 37.7749, -122.4194, 'business', '["WiFi", "Business Center", "Gym", "Restaurant", "Meeting Rooms", "Conference Facilities"]', '["https://images.unsplash.com/photo-1564501049412-61c2a3083791", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"]');

-- Update existing rooms to reference the new branches
UPDATE public.rooms SET branch_id = (
    SELECT id FROM public.branches WHERE name = 'Vinotel Grand Palace' LIMIT 1
) WHERE branch_id IS NULL;

-- Insert additional rooms for each branch
INSERT INTO public.rooms (branch_id, room_number, room_type, capacity, price_per_night, amenities, description, floor_number, bed_type, bathroom_type, size_sqm, balcony) 
SELECT 
    b.id,
    '201',
    'deluxe',
    2,
    299.99,
    '["King Bed", "City View", "Mini Bar", "Work Desk", "Premium WiFi", "Coffee Machine"]',
    'Deluxe room with premium amenities and stunning city views.',
    2,
    'king',
    'private',
    35.0,
    true
FROM public.branches b WHERE b.name = 'Vinotel Grand Palace';

INSERT INTO public.rooms (branch_id, room_number, room_type, capacity, price_per_night, amenities, description, floor_number, bed_type, bathroom_type, size_sqm, balcony) 
SELECT 
    b.id,
    '101',
    'standard',
    2,
    199.99,
    '["Queen Bed", "Ocean View", "Mini Bar", "WiFi", "Air Conditioning"]',
    'Comfortable room with beautiful ocean views.',
    1,
    'queen',
    'private',
    28.0,
    true
FROM public.branches b WHERE b.name = 'Vinotel Seaside Resort';

INSERT INTO public.rooms (branch_id, room_number, room_type, capacity, price_per_night, amenities, description, floor_number, bed_type, bathroom_type, size_sqm, balcony) 
SELECT 
    b.id,
    '301',
    'suite',
    4,
    399.99,
    '["King Bed", "Ocean View", "Living Area", "Jacuzzi", "Premium WiFi", "Butler Service"]',
    'Luxury suite with separate living area and premium amenities.',
    3,
    'king',
    'private',
    55.0,
    true
FROM public.branches b WHERE b.name = 'Vinotel Seaside Resort';

INSERT INTO public.rooms (branch_id, room_number, room_type, capacity, price_per_night, amenities, description, floor_number, bed_type, bathroom_type, size_sqm, balcony) 
SELECT 
    b.id,
    '501',
    'standard',
    2,
    179.99,
    '["Queen Bed", "City View", "Work Desk", "WiFi", "Business Center Access"]',
    'Modern business room with work-friendly amenities.',
    5,
    'queen',
    'private',
    30.0,
    false
FROM public.branches b WHERE b.name = 'Vinotel Business Center';

-- Generate confirmation number function
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'VIN' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically generate confirmation numbers
CREATE OR REPLACE FUNCTION set_confirmation_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_number IS NULL OR NEW.confirmation_number = '' THEN
        NEW.confirmation_number := generate_confirmation_number();
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM public.bookings WHERE confirmation_number = NEW.confirmation_number) LOOP
            NEW.confirmation_number := generate_confirmation_number();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confirmation number generation
CREATE TRIGGER set_booking_confirmation_number
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_confirmation_number();