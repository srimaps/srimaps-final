package com.srimaps.backend.controller;

import com.srimaps.backend.dto.LostFoundRequest;
import com.srimaps.backend.entity.LostFoundItem;
import com.srimaps.backend.service.LostFoundService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

@GetMapping
    public List<LostFoundItem> getItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String routeNumber
    ) {
        if (type != null && !type.isBlank() && routeNumber != null && !routeNumber.isBlank()) {
            return lostFoundService.getItemsByTypeAndRoute(type.trim(), routeNumber.trim());
        }

        if (type != null && !type.isBlank()) {
            return lostFoundService.getItemsByType(type.trim());
        }

        if (status != null && !status.isBlank()) {
            return lostFoundService.getItemsByStatus(status.trim());
        }

        if (routeNumber != null && !routeNumber.isBlank()) {
            return lostFoundService.getItemsByRoute(routeNumber.trim());
        }

        return lostFoundService.getAllItems();
    }
