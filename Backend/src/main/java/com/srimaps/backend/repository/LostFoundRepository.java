package com.srimaps.backend.repository;

import com.srimaps.backend.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostFoundRepository extends JpaRepository<LostFoundItem, Integer> {

    List<LostFoundItem> findAllByOrderByReportedAtDesc();

    List<LostFoundItem> findByItemTypeOrderByReportedAtDesc(String itemType);

}
