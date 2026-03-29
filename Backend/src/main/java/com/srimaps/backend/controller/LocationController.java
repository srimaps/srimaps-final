package com.srimaps.backend.controller;

import com.srimaps.backend.dto.LiveDriverLocationResponse;
import com.srimaps.backend.dto.LocationRequest;
import com.srimaps.backend.entity.BusLocation;
import com.srimaps.backend.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/driver/{driverId}")
    public BusLocation addLocation(@PathVariable Integer driverId,
                                   @Valid @RequestBody LocationRequest request) {
        return locationService.addLocation(driverId, request);
    }

    @GetMapping("/driver/{driverId}/latest")
    public BusLocation getLatestLocation(@PathVariable Integer driverId) {
        return locationService.getLatestLocation(driverId);
    }

    @GetMapping("/driver/{driverId}/history")
    public List<BusLocation> getLocationHistory(@PathVariable Integer driverId) {
        return locationService.getLocationHistory(driverId);
    }

    @GetMapping("/live")
    public List<LiveDriverLocationResponse> getLiveLocations(
            @RequestParam(required = false) String routeNumber) {
        return locationService.getLiveLocations(routeNumber);
    }
}
