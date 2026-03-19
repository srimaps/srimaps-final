-- ROUTES
INSERT INTO routes (route_number, start_destination, end_destination)
VALUES 
('138', 'Colombo', 'Kandy'),
('120', 'Colombo', 'Galle');

-- DRIVERS
INSERT INTO drivers (full_name, username, password_hash, phone)
VALUES
('John Silva', 'john', 'hashed123', '0771234567'),
('Kasun Perera', 'kasun', 'hashed456', '0779876543');

-- BUSES
INSERT INTO buses (bus_number, route_id, driver_id, status, tracking_enabled)
VALUES
('NB-1381', 1, 1, 'ACTIVE', TRUE),
('NB-1202', 2, 2, 'ACTIVE', TRUE);

-- LOCATION HISTORY
INSERT INTO bus_location_history (bus_id, latitude, longitude)
VALUES
(1, 6.9271, 79.8612),
(1, 6.9300, 79.8700);

-- NEWS
INSERT INTO news (title, description, route_id)
VALUES
('Delay Notice', 'Bus delayed due to traffic', 1);

-- ALERTS
INSERT INTO alerts (route_id, description, severity)
VALUES
(1, 'Heavy traffic', 'HIGH');

-- LOST & FOUND
INSERT INTO lost_found_items (type, item_name, description, contact)
VALUES
('LOST', 'Wallet', 'Black wallet lost', '0770000000');