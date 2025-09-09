-- Insert default room types if they don't exist
INSERT INTO room_types (name, description, base_price, max_capacity, default_amenities)
SELECT * FROM (
  VALUES 
    ('Standard Room', 'Comfortable room with basic amenities', 120.00, 2, '["WiFi", "Air Conditioning", "TV"]'::jsonb),
    ('Deluxe Room', 'Spacious room with premium amenities', 180.00, 2, '["WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe"]'::jsonb),
    ('Suite', 'Luxurious suite with separate living area', 300.00, 4, '["WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Room Service", "Balcony"]'::jsonb),
    ('Family Room', 'Large room perfect for families', 220.00, 6, '["WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Coffee Machine"]'::jsonb),
    ('Executive Room', 'Business-class room with work area', 250.00, 2, '["WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Coffee Machine", "Room Service"]'::jsonb)
) AS new_types(name, description, base_price, max_capacity, default_amenities)
WHERE NOT EXISTS (
  SELECT 1 FROM room_types WHERE room_types.name = new_types.name
);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON room_types TO anon;
GRANT ALL PRIVILEGES ON room_types TO authenticated;