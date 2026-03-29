package com.srimaps.backend.service;

import com.srimaps.backend.dto.DriverRouteUpdateRequest;
import com.srimaps.backend.dto.DriverSignupRequest;
import com.srimaps.backend.dto.LoginRequest;
import com.srimaps.backend.dto.LoginResponse;
import com.srimaps.backend.entity.Driver;
import com.srimaps.backend.entity.Route;
import com.srimaps.backend.exception.ResourceNotFoundException;
import com.srimaps.backend.repository.DriverRepository;
import com.srimaps.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;

    public DriverService(DriverRepository driverRepository, RouteRepository routeRepository) {
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
    }

    public LoginResponse signup(DriverSignupRequest request) {
        driverRepository.findByUsername(request.getUsername()).ifPresent(driver -> {
            throw new IllegalArgumentException("Username already exists");
        });

        Driver driver = new Driver();
        driver.setFullName(request.getFullName());
        driver.setUsername(request.getUsername());
        driver.setPassword(request.getPassword());
        driver.setMobileNumber(request.getPhoneNumber());
        driver.setIsActive(true);

        Driver saved = driverRepository.save(driver);

        return new LoginResponse(
                saved.getDriverId(),
                saved.getFullName(),
                saved.getUsername(),
                saved.getMobileNumber(),
                null,
                "Signup successful"
        );
    }

    public LoginResponse login(LoginRequest request) {
        Driver driver = driverRepository
                .findByUsernameAndPasswordAndIsActiveTrue(request.getUsername(), request.getPassword())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        String routeNumber = driver.getRoute() != null ? driver.getRoute().getRouteNumber() : null;

        return new LoginResponse(
                driver.getDriverId(),
                driver.getFullName(),
                driver.getUsername(),
                driver.getMobileNumber(),
                routeNumber,
                "Login successful"
        );
    }

    public LoginResponse updateRoute(Integer driverId, DriverRouteUpdateRequest request) {
        Driver driver = getDriverById(driverId);

        Route route = routeRepository.findByRouteNumber(request.getRouteNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + request.getRouteNumber()));

        driver.setRoute(route);
        Driver saved = driverRepository.save(driver);

        return new LoginResponse(
                saved.getDriverId(),
                saved.getFullName(),
                saved.getUsername(),
                saved.getMobileNumber(),
                saved.getRoute().getRouteNumber(),
                "Route updated successfully"
        );
    }

    public Driver getDriverById(Integer driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
    }
}
