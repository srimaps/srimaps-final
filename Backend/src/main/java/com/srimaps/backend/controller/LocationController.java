package com.srimaps.backend.controller;

import com.srimaps.backend.dto.LocationRequest;
import com.srimaps.backend.entity.BusLocation;
import com.srimaps.backend.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/bus/{busId}")
    public BusLocation addLocation(
            @PathVariable Integer busId,
            @Valid @RequestBody LocationRequest request
    ) {
        return locationService.addLocation(busId, request);
    }

    @GetMapping("/bus/{busId}/latest")
    public BusLocation getLatestLocation(@PathVariable Integer busId) {
        return locationService.getLatestLocation(busId);
    }

    @GetMapping("/bus/{busId}/history")
    public List<BusLocation> getLocationHistory(@PathVariable Integer busId) {
        return locationService.getLocationHistory(busId);
    }

    @GetMapping("/live")
    public List<BusLocation> getLiveLocations() {
        return locationService.getLatestLocationsForSharingBuses();
    }
}
