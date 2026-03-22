package com.srimaps.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_id")
    private Integer busId;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @Column(name = "plate_number", nullable = false, unique = true)
    private String plateNumber;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "status")
    private String status = "ACTIVE";



}
