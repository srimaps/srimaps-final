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
    private String phoneNumber;
    private String routeNumber;
    private String message;
}
