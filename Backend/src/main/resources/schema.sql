CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_number VARCHAR(50) NOT NULL UNIQUE,
    start_destination VARCHAR(255) NOT NULL,
    end_destination VARCHAR(255) NOT NULL,
    distance_km DOUBLE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL UNIQUE,
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    route_id INT NOT NULL,
    capacity INT,
    status VARCHAR(50),
    is_sharing_location BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_buses_route FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

CREATE TABLE IF NOT EXISTS drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    license_number VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bus_id INT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_drivers_bus FOREIGN KEY (bus_id) REFERENCES buses(bus_id)
);
