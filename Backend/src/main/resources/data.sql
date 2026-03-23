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

INSERT INTO drivers (driver_id, full_name, email, phone, license_number, username, password, bus_id, is_active) VALUES
(1, 'Kamal Perera', 'kamal@example.com', '0771234567', 'LIC138', 'kamal', 'driver138', 1, TRUE),
(2, 'Sunil Silva', 'sunil@example.com', '0779876543', 'LIC177', 'sunil', 'driver177', 2, TRUE),
(3, 'Nimal Fernando', 'nimal@example.com', '0774567890', 'LIC120', 'nimal', 'driver120', 3, TRUE)
ON DUPLICATE KEY UPDATE username=VALUES(username);

INSERT INTO schedules (schedule_id, route_id, departure_time, arrival_time, start_destination, end_destination, bus_stop, day_type) VALUES
(1, 1, '06:00:00', '07:00:00', 'Colombo Fort', 'Malabe', 'Fort', 'WEEKDAY'),
(2, 1, '07:30:00', '08:30:00', 'Colombo Fort', 'Malabe', 'Fort', 'WEEKDAY'),
(3, 2, '06:30:00', '07:30:00', 'Colombo Fort', 'Kaduwela', 'Fort', 'WEEKDAY'),
(4, 3, '07:00:00', '08:00:00', 'Colombo Fort', 'Piliyandala', 'Fort', 'WEEKDAY')
ON DUPLICATE KEY UPDATE route_id=VALUES(route_id);

INSERT INTO news (news_id, title, description, route_id, posted_by, posted_at) VALUES
(1, 'New Express Service on Route 138', 'Starting Monday, Route 138 will have express services during peak hours.', 1, 'Admin', NOW()),
(2, 'Route 177 Schedule Update', 'Due to road construction, Route 177 may have slight delays.', 2, 'Admin', NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO alerts (alert_id, title, message, severity, route_id, created_at, expires_at) VALUES
(1, 'Arrival Alert', 'Bus approaching Malabe Junction in 5 minutes', 'MEDIUM', 1, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 'Delay Alert', 'Route 120 delayed by 15 minutes due to traffic', 'HIGH', 3, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE title=VALUES(title);
