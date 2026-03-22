package com.srimaps.backend.repository;

import com.srimaps.backend.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Integer> {

    List<News> findAllByOrderByPostedAtDesc();

    List<News> findByRoute_RouteNumberOrderByPostedAtDesc(String routeNumber);
}
