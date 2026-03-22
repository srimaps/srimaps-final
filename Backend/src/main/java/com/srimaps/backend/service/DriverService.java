package com.srimaps.backend.service;

import com.srimaps.backend.dto.LoginRequest;
import com.srimaps.backend.dto.LoginResponse;
import com.srimaps.backend.entity.Driver;
import com.srimaps.backend.exception.ResourceNotFoundException;
import com.srimaps.backend.repository.DriverRepository;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }


}
