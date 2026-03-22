package com.srimaps.backend.service;

import com.srimaps.backend.dto.LoginRequest;
import com.srimaps.backend.dto.LoginResponse;
import com.srimaps.backend.entity.Driver;
import com.srimaps.backend.exception.ResourceNotFoundException;
import com.srimaps.backend.repository.DriverRepository;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }
    public LoginResponse login(LoginRequest request) {
        Driver driver = driverRepository
                .findByUsernameAndPasswordAndIsActiveTrue(request.getUsername(), request.getPassword())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        Integer busId = driver.getBus() != null ? driver.getBus().getBusId() : null;
        String busNumber = driver.getBus() != null ? driver.getBus().getBusNumber() : null;
        String routeNumber = (driver.getBus() != null && driver.getBus().getRoute() != null)
                ? driver.getBus().getRoute().getRouteNumber()
                : null;

        return new LoginResponse(
                driver.getDriverId(),
                driver.getFullName(),
                driver.getUsername(),
                busId,
                busNumber,
                routeNumber,
                "Login successful"
        );
    }
    public Driver getDriverById(Integer driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
    }



}
