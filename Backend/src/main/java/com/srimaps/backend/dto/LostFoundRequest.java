package com.srimaps.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class LostFoundRequest {
  
  @NotBlank(message = "Item type is required")
  private String itemType;

  @NotBlank(message = "Item name is required")
  private String itemName;
  private String description;
  private String contactInfo;
  private Integer routeId;

} 
