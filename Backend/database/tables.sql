-- DRIVERS
CREATE TABLE drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DRIVERS
CREATE TABLE drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ROUTES
CREATE TABLE routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_number VARCHAR(20) NOT NULL,
    start_destination VARCHAR(100),
    end_destination VARCHAR(100),
    description TEXT
);

-- BUSES
CREATE TABLE buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL,
    route_id BIGINT,
    driver_id BIGINT,
    status VARCHAR(20),
    tracking_enabled BOOLEAN DEFAULT FALSE,
    current_latitude DECIMAL(10,6),
    current_longitude DECIMAL(10,6),
    last_location_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- LOCATION HISTORY
CREATE TABLE bus_location_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- NEWS
CREATE TABLE news (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    route_id BIGINT,
    created_by_driver_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (created_by_driver_id) REFERENCES drivers(id)
);

-- ALERTS
CREATE TABLE alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT,
    description TEXT,
    severity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- SCHEDULES
CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT,
    start_destination VARCHAR(100),
    end_destination VARCHAR(100),
    departure_time TIME,
    arrival_time TIME,

    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- LOST & FOUND
CREATE TABLE lost_found_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(10),
    item_name VARCHAR(100),
    description TEXT,
    contact VARCHAR(100),
    route_id BIGINT,
    bus_id BIGINT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),

    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

