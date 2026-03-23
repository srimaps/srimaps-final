INSERT INTO routes (route_id, route_number, start_destination, end_destination, distance_km, is_active) VALUES
(1, '138', 'Colombo Fort', 'Malabe', 18.0, TRUE),
(2, '177', 'Colombo Fort', 'Kaduwela', 16.0, TRUE),
(3, '120', 'Colombo Fort', 'Piliyandala', 20.0, TRUE)
ON DUPLICATE KEY UPDATE route_number=VALUES(route_number);
