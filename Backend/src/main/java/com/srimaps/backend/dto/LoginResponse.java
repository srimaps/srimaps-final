package com.srimaps.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Integer driverId;
    private String fullName;
    private String username;
    private Integer busId;
    private String busNumber;
    private String routeNumber;
    private String message;
}
