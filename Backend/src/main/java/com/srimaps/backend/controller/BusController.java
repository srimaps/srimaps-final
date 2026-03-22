package com.srimaps.backend.controller;

import com.srimaps.backend.entity.Bus;
import com.srimaps.backend.service.BusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

   private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }
}
