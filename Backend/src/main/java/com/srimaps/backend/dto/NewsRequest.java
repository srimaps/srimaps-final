package com.srimaps.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NewsRequest {

    @NotBlank(message = "Title is required")
    private String title;
