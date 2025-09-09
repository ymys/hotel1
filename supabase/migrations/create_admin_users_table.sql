-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager')),
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
-- Only authenticated users can read admin_users
CREATE POLICY "Admin users can read admin_users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only super_admin can insert new admin users
CREATE POLICY "Super admin can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only super_admin can update admin users
CREATE POLICY "Super admin can update admin_users" ON admin_users
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only super_admin can delete admin users
CREATE POLICY "Super admin can delete admin_users" ON admin_users
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON admin_users TO anon;
GRANT ALL PRIVILEGES ON admin_users TO authenticated;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin user (password will be handled by Supabase Auth)
INSERT INTO admin_users (email, name, role, permissions) VALUES
('admin@vinotel.com', 'Super Admin', 'super_admin', ARRAY['manage_hotels', 'manage_bookings', 'manage_users', 'manage_admins', 'view_analytics', 'manage_reviews', 'manage_availability'])
ON CONFLICT (email) DO NOTHING;