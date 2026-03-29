package com.srimaps.backend.controller;

import com.srimaps.backend.dto.DriverRouteUpdateRequest;
import com.srimaps.backend.dto.DriverSignupRequest;
import com.srimaps.backend.dto.LoginRequest;
import com.srimaps.backend.dto.LoginResponse;
import com.srimaps.backend.entity.Driver;
import com.srimaps.backend.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping("/signup")
    public LoginResponse signup(@Valid @RequestBody DriverSignupRequest request) {
        return driverService.signup(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return driverService.login(request);
    }

    @PutMapping("/{driverId}/route")
    public LoginResponse updateRoute(@PathVariable Integer driverId,
                                     @Valid @RequestBody DriverRouteUpdateRequest request) {
        return driverService.updateRoute(driverId, request);
    }

    @GetMapping("/{driverId}")
    public Driver getDriverById(@PathVariable Integer driverId) {
        return driverService.getDriverById(driverId);
    }
}
