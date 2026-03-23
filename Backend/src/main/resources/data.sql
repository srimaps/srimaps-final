INSERT INTO routes (route_id, route_number, start_destination, end_destination, distance_km, is_active) VALUES
(1, '138', 'Colombo Fort', 'Malabe', 18.0, TRUE),
(2, '177', 'Colombo Fort', 'Kaduwela', 16.0, TRUE),
(3, '120', 'Colombo Fort', 'Piliyandala', 20.0, TRUE)
ON DUPLICATE KEY UPDATE route_number=VALUES(route_number);

INSERT INTO buses (bus_id, bus_number, plate_number, route_id, capacity, status, is_sharing_location) VALUES
(1, '138', 'NB-1381', 1, 54, 'ACTIVE', TRUE),
(2, '177', 'NB-1773', 2, 54, 'ACTIVE', TRUE),
(3, '120', 'NB-1202', 3, 54, 'ACTIVE', FALSE)
ON DUPLICATE KEY UPDATE bus_number=VALUES(bus_number);
