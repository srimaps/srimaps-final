CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_number VARCHAR(50) NOT NULL UNIQUE,
    start_destination VARCHAR(255) NOT NULL,
    end_destination VARCHAR(255) NOT NULL,
    distance_km DOUBLE,
    is_active BOOLEAN DEFAULT TRUE
);
