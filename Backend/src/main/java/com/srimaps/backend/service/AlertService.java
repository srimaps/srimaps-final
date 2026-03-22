package com.srimaps.backend.service;

import com.srimaps.backend.entity.Alert;
import com.srimaps.backend.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findByExpiresAtIsNullOrExpiresAtAfterOrderByCreatedAtDesc(
                LocalDateTime.now()
        );
    }
        public List<Alert> getAlertsByRoute(String routeNumber) {
        return alertRepository.findByRoute_RouteNumberOrderByCreatedAtDesc(routeNumber);
    }

}
