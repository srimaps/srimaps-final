package com.srimaps.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {
      @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Integer routeId;

    @Column(name = "route_number", nullable = false, unique = true)
    private String routeNumber;

    @Column(name = "start_destination", nullable = false)
    private String startDestination;

    @Column(name = "end_destination", nullable = false)
    private String endDestination;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "is_active")
    private Boolean isActive = true;


}
