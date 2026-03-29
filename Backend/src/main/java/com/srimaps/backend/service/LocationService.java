package com.srimaps.backend.service;

import com.srimaps.backend.dto.LiveDriverLocationResponse;
import com.srimaps.backend.dto.LocationRequest;
import com.srimaps.backend.entity.BusLocation;
import com.srimaps.backend.entity.Driver;
import com.srimaps.backend.exception.ResourceNotFoundException;
import com.srimaps.backend.repository.BusLocationRepository;
import com.srimaps.backend.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LocationService {

    private final BusLocationRepository busLocationRepository;
    private final DriverRepository driverRepository;

    public LocationService(BusLocationRepository busLocationRepository,
                           DriverRepository driverRepository) {
        this.busLocationRepository = busLocationRepository;
        this.driverRepository = driverRepository;
    }

    public BusLocation addLocation(Integer driverId, LocationRequest request) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));

        if (driver.getRoute() == null) {
            throw new IllegalArgumentException("Driver must select a route before sharing location");
        }

        BusLocation location = new BusLocation();
        location.setDriver(driver);
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setSpeed(request.getSpeed() != null ? request.getSpeed() : 0.0);
        location.setRecordedAt(LocalDateTime.now());

        return busLocationRepository.save(location);
    }

    public BusLocation getLatestLocation(Integer driverId) {
        return busLocationRepository.findTopByDriver_DriverIdOrderByRecordedAtDesc(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("No location found for driver id: " + driverId));
    }

    public List<BusLocation> getLocationHistory(Integer driverId) {
        return busLocationRepository.findByDriver_DriverIdOrderByRecordedAtDesc(driverId);
    }

    public List<LiveDriverLocationResponse> getLiveLocations(String routeNumber) {
        List<BusLocation> allLocations = busLocationRepository.findAllByOrderByRecordedAtDesc();

        Map<Integer, BusLocation> latestPerDriver = new LinkedHashMap<>();

        for (BusLocation location : allLocations) {
            Driver driver = location.getDriver();
            if (driver == null || driver.getRoute() == null) {
                continue;
            }

            if (routeNumber != null && !routeNumber.isBlank()
                    && !driver.getRoute().getRouteNumber().equalsIgnoreCase(routeNumber)) {
                continue;
            }

            if (!latestPerDriver.containsKey(driver.getDriverId())) {
                latestPerDriver.put(driver.getDriverId(), location);
            }
        }

        List<LiveDriverLocationResponse> results = new ArrayList<>();

        for (BusLocation location : latestPerDriver.values()) {
            Driver driver = location.getDriver();
            results.add(new LiveDriverLocationResponse(
                    driver.getDriverId(),
                    driver.getFullName(),
                    driver.getUsername(),
                    driver.getRoute().getRouteNumber(),
                    location.getLatitude(),
                    location.getLongitude(),
                    location.getSpeed(),
                    location.getRecordedAt()
            ));
        }

        return results;
    }
}
