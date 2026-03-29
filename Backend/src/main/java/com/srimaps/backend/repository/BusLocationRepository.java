package com.srimaps.backend.repository;

import com.srimaps.backend.entity.BusLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusLocationRepository extends JpaRepository<BusLocation, Integer> {

    Optional<BusLocation> findTopByDriver_DriverIdOrderByRecordedAtDesc(Integer driverId);

    List<BusLocation> findByDriver_DriverIdOrderByRecordedAtDesc(Integer driverId);

    List<BusLocation> findAllByOrderByRecordedAtDesc();
}
