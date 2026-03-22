package com.srimaps.backend.repository;

import com.srimaps.backend.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Integer> {

    List<Alert> findAllByOrderByCreatedAtDesc();

}
