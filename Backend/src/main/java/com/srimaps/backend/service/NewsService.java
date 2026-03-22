package com.srimaps.backend.service;

import com.srimaps.backend.dto.NewsRequest;
import com.srimaps.backend.entity.News;
import com.srimaps.backend.entity.Route;
import com.srimaps.backend.repository.NewsRepository;
import com.srimaps.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final RouteRepository routeRepository;

    public NewsService(NewsRepository newsRepository, RouteRepository routeRepository) {
        this.newsRepository = newsRepository;
        this.routeRepository = routeRepository;
    }

    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByPostedAtDesc();
    }

    public List<News> getNewsByRoute(String routeNumber) {
        return newsRepository.findByRoute_RouteNumberOrderByPostedAtDesc(routeNumber);
    }
    
    public News createNews(NewsRequest request) {
        News news = new News();
        news.setTitle(request.getTitle().trim());
        news.setDescription(request.getDescription().trim());
        news.setPostedBy(
                request.getPostedBy() != null && !request.getPostedBy().isBlank()
                        ? request.getPostedBy().trim()
                        : "Admin"
        );
        news.setPostedAt(LocalDateTime.now());

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new IllegalArgumentException("Route not found"));
            news.setRoute(route);
        }

        return newsRepository.save(news);
    }
}    


