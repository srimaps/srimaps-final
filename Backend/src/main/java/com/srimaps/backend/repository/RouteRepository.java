package com.srimaps.backend.repository;

import com.srimaps.backend.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    Optional<Route> findByRouteNumber(String routeNumber);
}
