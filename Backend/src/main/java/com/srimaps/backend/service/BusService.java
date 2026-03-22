package com.srimaps.backend.service;

import com.srimaps.backend.entity.Bus;
import com.srimaps.backend.exception.ResourceNotFoundException;
import com.srimaps.backend.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Integer busId) {
        return busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));
    }



    
}
