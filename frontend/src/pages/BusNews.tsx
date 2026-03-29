package com.srimaps.backend.controller;

import com.srimaps.backend.entity.Route;
import com.srimaps.backend.repository.RouteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteRepository routeRepository;

    public RouteController(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}
