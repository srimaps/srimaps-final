package com.srimaps.backend.controller;

import com.srimaps.backend.dto.NewsRequest;
import com.srimaps.backend.entity.News;
import com.srimaps.backend.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;
}
