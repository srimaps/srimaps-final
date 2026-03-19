CREATE INDEX idx_bus_route ON buses(route_id);
CREATE INDEX idx_bus_driver ON buses(driver_id);
CREATE INDEX idx_location_bus ON bus_location_history(bus_id);
CREATE INDEX idx_news_route ON news(route_id);
CREATE INDEX idx_alerts_route ON alerts(route_id);