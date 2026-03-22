package com.srimaps.backend.repository;

import com.srimaps.backend.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusRepository extends JpaRepository<Bus, Integer> {

    List<Bus> findByRoute_RouteNumber(String routeNumber);

    List<Bus> findByRoute_StartDestinationIgnoreCaseAndRoute_EndDestinationIgnoreCase(
            String startDestination,
            String endDestination
    );

    List<Bus> findByIsSharingLocationTrue();
}

