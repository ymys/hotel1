-- Check current permissions for admin_users table
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'admin_users'
AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- Grant permissions to anon role (for unauthenticated access)
GRANT SELECT ON admin_users TO anon;

-- Grant full permissions to authenticated role
GRANT ALL PRIVILEGES ON admin_users TO authenticated;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'admin_users';

-- Create or update RLS policies to allow anon access for login verification
DROP POLICY IF EXISTS "Allow anon to read admin users for login" ON admin_users;
CREATE POLICY "Allow anon to read admin users for login" 
ON admin_users FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated users full access
DROP POLICY IF EXISTS "Allow authenticated users full access" ON admin_users;
CREATE POLICY "Allow authenticated users full access" 
ON admin_users FOR ALL 
TO authenticated 
USING (true);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'admin_users';