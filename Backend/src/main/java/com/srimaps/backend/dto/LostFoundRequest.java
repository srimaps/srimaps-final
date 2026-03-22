package com.srimaps.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class LostFoundRequest {
  
  private String itemType;
  private String itemName;
  private String description;
  private String contactInfo;
  private Integer routeId;

}
