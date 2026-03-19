SELECT * FROM buses;
SELECT * FROM drivers;
SELECT * FROM routes;

SELECT b.bus_number, r.route_number
FROM buses b
JOIN routes r ON b.route_id = r.id;