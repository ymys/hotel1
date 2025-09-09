# Admin User Setup Guide

This guide explains how to add admin users to the Vinotel Hotel Booking System using Supabase.

## Prerequisites

- Access to your Supabase project dashboard
- Admin privileges in Supabase

## Method 1: Using Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Navigate to Table Editor**
   - Click on "Table Editor" in the left sidebar
   - Find and select the `admin_users` table

3. **Add New Admin User**
   - Click the "Insert" button or "+" icon
   - Fill in the required fields:
     - `email`: Admin's email address (must be unique)
     - `name`: Admin's full name
     - `role`: Choose from `super_admin`, `admin`, or `manager`
     - `permissions`: JSON array of permissions (see roles below)
   - Click "Save" to create the user

## Method 2: Using SQL Editor

1. **Access SQL Editor**
   - In your Supabase dashboard, click "SQL Editor"
   - Create a new query

2. **Insert Admin User**
   ```sql
   INSERT INTO admin_users (email, name, role, permissions)
   VALUES (
     'admin@example.com',
     'John Doe',
     'admin',
     '["users.read", "users.write", "bookings.read", "bookings.write", "hotels.read"]'
   );
   ```

3. **Run the Query**
   - Click "Run" to execute the SQL
   - Verify the user was created successfully

## Admin Roles and Permissions

### Super Admin (`super_admin`)
- Full system access
- Can manage all users, bookings, hotels, and system settings
- Default permissions: `["*"]` (all permissions)

### Admin (`admin`)
- Can manage users, bookings, and hotels
- Cannot access system-level settings
- Default permissions:
  ```json
  [
    "users.read", "users.write", "users.delete",
    "bookings.read", "bookings.write", "bookings.delete",
    "hotels.read", "hotels.write", "hotels.delete"
  ]
  ```

### Manager (`manager`)
- Can view and manage bookings and hotels
- Limited user management (read-only)
- Default permissions:
  ```json
  [
    "users.read",
    "bookings.read", "bookings.write",
    "hotels.read", "hotels.write"
  ]
  ```

## Available Permissions

- `users.read` - View user information
- `users.write` - Create and edit users
- `users.delete` - Delete users
- `bookings.read` - View bookings
- `bookings.write` - Create and edit bookings
- `bookings.delete` - Cancel/delete bookings
- `hotels.read` - View hotel information
- `hotels.write` - Create and edit hotels
- `hotels.delete` - Delete hotels
- `reports.read` - View reports and analytics
- `settings.write` - Modify system settings

## Example SQL Queries

### Create Super Admin
```sql
INSERT INTO admin_users (email, name, role, permissions)
VALUES (
  'superadmin@vinotel.com',
  'Super Administrator',
  'super_admin',
  '["*"]'
);
```

### Create Regular Admin
```sql
INSERT INTO admin_users (email, name, role, permissions)
VALUES (
  'admin@vinotel.com',
  'Hotel Administrator',
  'admin',
  '["users.read", "users.write", "users.delete", "bookings.read", "bookings.write", "bookings.delete", "hotels.read", "hotels.write", "hotels.delete"]'
);
```

### Create Manager
```sql
INSERT INTO admin_users (email, name, role, permissions)
VALUES (
  'manager@vinotel.com',
  'Hotel Manager',
  'manager',
  '["users.read", "bookings.read", "bookings.write", "hotels.read", "hotels.write"]'
);
```

## Authentication Setup

**Important**: Admin users created in the `admin_users` table are for authorization purposes only. For authentication, you need to:

1. **Create Supabase Auth User**
   - Go to "Authentication" > "Users" in Supabase dashboard
   - Click "Add user"
   - Enter the same email address used in `admin_users` table
   - Set a temporary password
   - The admin can change their password on first login

2. **Alternative: Use Magic Link**
   - Admin users can use the "Forgot Password" feature on the login page
   - This will create the auth user automatically if the email exists in `admin_users`

## Security Notes

- Always use strong, unique passwords for admin accounts
- Regularly review and update admin permissions
- Remove access for users who no longer need it
- Monitor admin activity through Supabase logs
- Consider enabling two-factor authentication in Supabase Auth settings

## Troubleshooting

### User Can't Login
1. Verify the user exists in both `admin_users` table and Supabase Auth
2. Check that the email addresses match exactly
3. Ensure the user's role has appropriate permissions
4. Check Supabase Auth logs for authentication errors

### Permission Denied Errors
1. Verify the user's role and permissions in the `admin_users` table
2. Check that Row Level Security policies are properly configured
3. Ensure the `anon` and `authenticated` roles have proper table access

### Need Help?
Refer to the [Supabase Documentation](https://supabase.com/docs) or check the application logs for detailed error messages.