package com.srimaps.backend.repository;

import com.srimaps.backend.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostFoundRepository extends JpaRepository<LostFoundItem, Integer> {

    List<LostFoundItem> findAllByOrderByReportedAtDesc();

    List<LostFoundItem> findByItemTypeOrderByReportedAtDesc(String itemType);
    
    List<LostFoundItem> findByStatusOrderByReportedAtDesc(String status);
    
    List<LostFoundItem> findByRoute_RouteNumberOrderByReportedAtDesc(String routeNumber);

    List<LostFoundItem> findByItemTypeAndRoute_RouteNumberOrderByReportedAtDesc(String itemType, String routeNumber);

}
