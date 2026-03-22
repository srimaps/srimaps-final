package com.srimaps.backend.controller;

import com.srimaps.backend.entity.Alert;
import com.srimaps.backend.service.AlertService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getAlerts(@RequestParam(required = false) String routeNumber) {
    if (routeNumber != null && !routeNumber.isBlank()) {
        return alertService.getAlertsByRoute(routeNumber.trim());
    }
    return alertService.getAllAlerts();
}
}
