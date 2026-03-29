package com.srimaps.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverSignupRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    private String password;
}
