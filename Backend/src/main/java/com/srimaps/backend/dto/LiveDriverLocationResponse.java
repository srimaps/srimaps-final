package com.srimaps.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LiveDriverLocationResponse {
    private Integer driverId;
    private String driverName;
    private String username;
    private String routeNumber;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private LocalDateTime recordedAt;
}
