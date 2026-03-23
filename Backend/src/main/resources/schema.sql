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

CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    start_destination VARCHAR(255) NOT NULL,
    end_destination VARCHAR(255) NOT NULL,
    bus_stop VARCHAR(255),
    day_type VARCHAR(50) DEFAULT 'WEEKDAY',
    CONSTRAINT fk_schedules_route FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

CREATE TABLE IF NOT EXISTS news (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    route_id INT NULL,
    posted_by VARCHAR(255),
    posted_at DATETIME,
    CONSTRAINT fk_news_route FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'MEDIUM',
    route_id INT NULL,
    created_at DATETIME,
    expires_at DATETIME,
    CONSTRAINT fk_alerts_route FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

CREATE TABLE IF NOT EXISTS lost_found_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    route_id INT NULL,
    reported_at DATETIME,
    status VARCHAR(50) DEFAULT 'OPEN',
    CONSTRAINT fk_lostfound_route FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

CREATE TABLE IF NOT EXISTS bus_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    speed DOUBLE DEFAULT 0,
    recorded_at DATETIME,
    CONSTRAINT fk_locations_bus FOREIGN KEY (bus_id) REFERENCES buses(bus_id)
);
