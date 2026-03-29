package com.srimaps.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverRouteUpdateRequest {

    @NotBlank(message = "Route number is required")
    private String routeNumber;
}
